import { Router, Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { computeCommitment, commitmentToBytes32 } from "../utils/poseidon";

export const commitmentRouter = Router();

// In-memory store for hackathon demo. Replace with PostgreSQL for production.
const employeeStore = new Map<
  string,
  { salary: string; nonce: string; commitment: string; timestamp: number }
>();

const CreateCommitmentSchema = z.object({
  employeeAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  salary: z.number().int().positive(),
});

/**
 * POST /api/commitments/create
 *
 * Creates a Poseidon commitment for a salary payment.
 * Returns the commitment (bytes32) and the nonce (must be stored securely
 * and shared with the employee for proof generation).
 */
commitmentRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const parsed = CreateCommitmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { employeeAddress, salary } = parsed.data;

    // Generate a cryptographically random nonce
    const nonce = BigInt("0x" + crypto.randomBytes(16).toString("hex"));

    // Compute Poseidon(employeeAddress, salary, nonce)
    const commitment = await computeCommitment(
      employeeAddress,
      BigInt(salary),
      nonce
    );

    const bytes32 = commitmentToBytes32(commitment);

    // Store for later proof generation (hackathon demo)
    employeeStore.set(employeeAddress.toLowerCase(), {
      salary: salary.toString(),
      nonce: nonce.toString(),
      commitment,
      timestamp: Date.now(),
    });

    res.json({
      commitment: bytes32,
      commitmentDecimal: commitment,
      nonce: nonce.toString(),
      employeeAddress,
      salary,
    });
  } catch (err) {
    console.error("Commitment creation error:", err);
    res.status(500).json({ error: "Failed to create commitment" });
  }
});

/**
 * GET /api/commitments/employee/:address
 *
 * Retrieve stored employee data (for proof generation).
 * In production this would require authentication.
 */
commitmentRouter.get("/employee/:address", (req: Request, res: Response) => {
  const address = req.params.address.toLowerCase();
  const data = employeeStore.get(address);

  if (!data) {
    res.status(404).json({ error: "Employee data not found" });
    return;
  }

  res.json({
    employeeAddress: address,
    salary: data.salary,
    nonce: data.nonce,
    commitment: data.commitment,
    timestamp: data.timestamp,
  });
});

/**
 * GET /api/commitments/all
 *
 * List all stored employees (demo/debug endpoint).
 */
commitmentRouter.get("/all", (_req: Request, res: Response) => {
  const entries: Record<string, any> = {};
  for (const [addr, data] of employeeStore.entries()) {
    entries[addr] = data;
  }
  res.json(entries);
});
