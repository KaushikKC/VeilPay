import { Router, Request, Response } from "express";
import { z } from "zod";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// snarkjs doesn't ship proper TS types – require it
const snarkjs = require("snarkjs");

export const proofRouter = Router();

// ---------------------------------------------------------------------------
// In-memory proof storage (hackathon – no DB needed)
// ---------------------------------------------------------------------------
interface ProofRecord {
  proof: unknown;
  publicSignals: string[];
  solidityCalldata: string;
  threshold: string;
  employeeAddress: string;
  storedAt: number;
}

const proofStore = new Map<string, ProofRecord>();

const StoreProofSchema = z.object({
  proof: z.any(),
  publicSignals: z.array(z.string()),
  solidityCalldata: z.string(),
  threshold: z.string(),
  employeeAddress: z.string(),
});

/**
 * POST /api/proofs/store
 *
 * Store a generated proof and return a short proofId for QR encoding.
 */
proofRouter.post("/store", (req: Request, res: Response) => {
  const parsed = StoreProofSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const proofId = crypto.randomUUID();
  const record: ProofRecord = {
    proof: parsed.data.proof,
    publicSignals: parsed.data.publicSignals,
    solidityCalldata: parsed.data.solidityCalldata,
    threshold: parsed.data.threshold,
    employeeAddress: parsed.data.employeeAddress,
    storedAt: Date.now(),
  };
  proofStore.set(proofId, record);

  res.json({ proofId });
});

/**
 * GET /api/proofs/retrieve/:proofId
 *
 * Retrieve a previously stored proof by its ID.
 */
proofRouter.get("/retrieve/:proofId", (req: Request, res: Response) => {
  const record = proofStore.get(req.params.proofId);
  if (!record) {
    res.status(404).json({ error: "Proof not found or expired" });
    return;
  }

  res.json({
    proof: record.proof,
    publicSignals: record.publicSignals,
    solidityCalldata: record.solidityCalldata,
    threshold: record.threshold,
    employeeAddress: record.employeeAddress,
  });
});

// Resolve paths to circuit build artifacts
const CIRCUIT_DIR = path.resolve(__dirname, "../../../circuits/build");
const WASM_PATH =
  process.env.CIRCUIT_WASM_PATH ||
  path.join(CIRCUIT_DIR, "income_proof_js", "income_proof.wasm");
const ZKEY_PATH =
  process.env.CIRCUIT_ZKEY_PATH ||
  path.join(CIRCUIT_DIR, "income_proof_final.zkey");
const VKEY_PATH =
  process.env.CIRCUIT_VKEY_PATH ||
  path.join(CIRCUIT_DIR, "verification_key.json");

const GenerateProofSchema = z.object({
  salary: z.string(),           // decimal string
  nonce: z.string(),            // decimal string
  employeeAddress: z.string(),  // "0x..." or decimal
  threshold: z.string(),        // decimal string
  commitment: z.string(),       // decimal string (Poseidon field element)
});

const VerifyProofSchema = z.object({
  proof: z.any(),
  publicSignals: z.array(z.string()),
});

/**
 * POST /api/proofs/generate
 *
 * Generate a Groth16 ZK proof that salary >= threshold.
 * Requires the circuit WASM + zkey to be built first.
 */
proofRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    // Validate circuit artifacts exist
    for (const f of [WASM_PATH, ZKEY_PATH]) {
      if (!fs.existsSync(f)) {
        res.status(503).json({
          error: "Circuit not compiled",
          detail: `Missing: ${f}. Run 'cd circuits && npm run build' first.`,
        });
        return;
      }
    }

    const parsed = GenerateProofSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { salary, nonce, employeeAddress, threshold, commitment } = parsed.data;

    // Normalise employeeAddress to decimal if given as hex
    const addressDecimal = employeeAddress.startsWith("0x")
      ? BigInt(employeeAddress).toString()
      : employeeAddress;

    const input = {
      salary,
      nonce,
      employeeAddress: addressDecimal,
      threshold,
      commitment,
    };

    console.log("Generating proof with inputs:", {
      ...input,
      salary: "[REDACTED]",
      nonce: "[REDACTED]",
    });

    const startMs = Date.now();
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      WASM_PATH,
      ZKEY_PATH
    );
    const elapsedMs = Date.now() - startMs;

    // Export Solidity-compatible calldata
    const solidityCalldata = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );

    console.log(`Proof generated in ${elapsedMs}ms`);

    res.json({
      proof,
      publicSignals,
      solidityCalldata,
      elapsedMs,
    });
  } catch (err: any) {
    console.error("Proof generation error:", err);
    res.status(500).json({
      error: "Proof generation failed",
      detail: err.message,
    });
  }
});

/**
 * POST /api/proofs/verify
 *
 * Verify a Groth16 proof off-chain (convenience endpoint).
 * On-chain verification via CredentialVerifier.sol is the canonical path.
 */
proofRouter.post("/verify", async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(VKEY_PATH)) {
      res.status(503).json({
        error: "Verification key not found",
        detail: `Missing: ${VKEY_PATH}. Run circuit setup first.`,
      });
      return;
    }

    const parsed = VerifyProofSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { proof, publicSignals } = parsed.data;

    const vkey = JSON.parse(fs.readFileSync(VKEY_PATH, "utf8"));
    const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);

    // snarkjs public signals order: [valid, threshold, commitment]
    const valid = isValid && publicSignals[0] === "1";

    res.json({
      valid,
      proofValid: isValid,
      incomeAboveThreshold: publicSignals[0] === "1",
      threshold: publicSignals[1],
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    res.status(500).json({
      error: "Verification failed",
      detail: err.message,
    });
  }
});

/**
 * GET /api/proofs/status
 *
 * Check if circuit artifacts are available.
 */
proofRouter.get("/status", (_req: Request, res: Response) => {
  res.json({
    wasmReady: fs.existsSync(WASM_PATH),
    zkeyReady: fs.existsSync(ZKEY_PATH),
    vkeyReady: fs.existsSync(VKEY_PATH),
    paths: { wasm: WASM_PATH, zkey: ZKEY_PATH, vkey: VKEY_PATH },
  });
});
