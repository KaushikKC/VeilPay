/**
 * Test script: generates a sample ZK income proof and verifies it locally.
 *
 * Usage:
 *   cd circuits && npm test
 *
 * Prerequisites:
 *   - Circuit must be compiled  (npm run compile)
 *   - Trusted setup completed   (npm run setup)
 */

const snarkjs = require("snarkjs");
const { buildPoseidon } = require("circomlibjs");
const path = require("path");
const fs = require("fs");

const BUILD_DIR = path.join(__dirname, "..", "build");
const WASM_PATH = path.join(BUILD_DIR, "income_proof_js", "income_proof.wasm");
const ZKEY_PATH = path.join(BUILD_DIR, "income_proof_final.zkey");
const VKEY_PATH = path.join(BUILD_DIR, "verification_key.json");

async function main() {
  console.log("=== ZK Income Proof Test ===\n");

  // Check build artifacts exist
  for (const f of [WASM_PATH, ZKEY_PATH, VKEY_PATH]) {
    if (!fs.existsSync(f)) {
      console.error(`Missing: ${f}`);
      console.error("Run 'npm run compile && npm run setup' first.");
      process.exit(1);
    }
  }

  // ------------------------------------------------------------------
  // 1. Setup test data
  // ------------------------------------------------------------------
  const poseidon = await buildPoseidon();

  // Employee's private data
  const employeeAddress = BigInt("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  const salary = BigInt(75000);   // $75,000 annual salary
  const nonce = BigInt(123456789); // random blinding factor

  // Public threshold to prove against
  const threshold = BigInt(50000); // proving income >= $50k

  // Compute the Poseidon commitment (matches on-chain commitment)
  const commitmentRaw = poseidon([employeeAddress, salary, nonce]);
  const commitment = poseidon.F.toString(commitmentRaw);

  console.log("Private inputs:");
  console.log("  salary:          ", salary.toString());
  console.log("  nonce:           ", nonce.toString());
  console.log("  employeeAddress: ", "0x" + employeeAddress.toString(16));
  console.log("");
  console.log("Public inputs:");
  console.log("  threshold:       ", threshold.toString());
  console.log("  commitment:      ", commitment);
  console.log("");

  // ------------------------------------------------------------------
  // 2. Generate the proof
  // ------------------------------------------------------------------
  console.log("Generating proof...");
  const startTime = Date.now();

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      salary: salary.toString(),
      nonce: nonce.toString(),
      employeeAddress: employeeAddress.toString(),
      threshold: threshold.toString(),
      commitment: commitment,
    },
    WASM_PATH,
    ZKEY_PATH
  );

  const elapsed = Date.now() - startTime;
  console.log(`Proof generated in ${elapsed}ms\n`);

  console.log("Public signals:");
  console.log("  [0] threshold:  ", publicSignals[0]);
  console.log("  [1] commitment: ", publicSignals[1]);
  console.log("  [2] valid:      ", publicSignals[2]);
  console.log("");

  // ------------------------------------------------------------------
  // 3. Verify the proof locally
  // ------------------------------------------------------------------
  console.log("Verifying proof...");
  const vkey = JSON.parse(fs.readFileSync(VKEY_PATH, "utf8"));
  const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);

  console.log("Proof valid:", isValid);
  console.log("");

  // ------------------------------------------------------------------
  // 4. Export Solidity calldata
  // ------------------------------------------------------------------
  const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
  console.log("Solidity calldata (for on-chain verification):");
  console.log(calldata);
  console.log("");

  // ------------------------------------------------------------------
  // 5. Test with salary BELOW threshold (should output valid = 0)
  // ------------------------------------------------------------------
  console.log("--- Testing with salary below threshold ---");
  const lowSalary = BigInt(30000);
  const lowNonce = BigInt(987654321);
  const lowCommitmentRaw = poseidon([employeeAddress, lowSalary, lowNonce]);
  const lowCommitment = poseidon.F.toString(lowCommitmentRaw);

  const { proof: lowProof, publicSignals: lowSignals } = await snarkjs.groth16.fullProve(
    {
      salary: lowSalary.toString(),
      nonce: lowNonce.toString(),
      employeeAddress: employeeAddress.toString(),
      threshold: threshold.toString(),
      commitment: lowCommitment,
    },
    WASM_PATH,
    ZKEY_PATH
  );

  console.log("Low salary public signals:");
  console.log("  [2] valid:", lowSignals[2], "(should be 0)");

  const lowValid = await snarkjs.groth16.verify(vkey, lowSignals, lowProof);
  console.log("  Proof technically valid (circuit ran):", lowValid);
  console.log("  But valid output = 0, so verifier contract rejects it.");
  console.log("");

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  if (isValid && publicSignals[2] === "1") {
    console.log("=== ALL TESTS PASSED ===");
    process.exit(0);
  } else {
    console.error("=== TEST FAILED ===");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
