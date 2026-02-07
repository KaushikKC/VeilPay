#!/bin/bash
# Generate Solidity verifier contract from the final zkey
set -e

CIRCUIT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$CIRCUIT_DIR/build"
CONTRACTS_DIR="$(cd "$CIRCUIT_DIR/../contracts/contracts" && pwd)"

echo "=== Generating Solidity Verifier ==="

if [ ! -f "$BUILD_DIR/income_proof_final.zkey" ]; then
  echo "Error: Final zkey not found. Run 'npm run setup' first."
  exit 1
fi

# Generate Verifier.sol
npx snarkjs zkey export solidityverifier \
  "$BUILD_DIR/income_proof_final.zkey" \
  "$CONTRACTS_DIR/Verifier.sol"

echo "Verifier.sol generated at: $CONTRACTS_DIR/Verifier.sol"
echo ""
echo "=== Done ==="
echo "You can now deploy Verifier.sol alongside the other contracts."
echo "Use the Verifier contract address when deploying CredentialVerifier."
