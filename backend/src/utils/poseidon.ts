import { buildPoseidon } from "circomlibjs";

let poseidonInstance: any = null;

/**
 * Returns a cached Poseidon hash function instance.
 * Building it is async and expensive, so we only do it once.
 */
export async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

/**
 * Compute a Poseidon commitment: Poseidon(employeeAddress, salary, nonce)
 * Returns the commitment as a decimal string (field element).
 */
export async function computeCommitment(
  employeeAddress: string,
  salary: bigint,
  nonce: bigint
): Promise<string> {
  const poseidon = await getPoseidon();
  const hash = poseidon([BigInt(employeeAddress), salary, nonce]);
  return poseidon.F.toString(hash);
}

/**
 * Convert a Poseidon field element to bytes32 for Solidity.
 */
export function commitmentToBytes32(commitment: string): string {
  return "0x" + BigInt(commitment).toString(16).padStart(64, "0");
}
