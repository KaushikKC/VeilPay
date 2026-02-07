#!/bin/bash
# Download Powers of Tau and generate the proving/verification keys
set -e

CIRCUIT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$CIRCUIT_DIR/build"
PTAU_FILE="$BUILD_DIR/pot14_final.ptau"

echo "=== Setting up Groth16 proving system ==="

mkdir -p "$BUILD_DIR"

# Check if circuit is compiled
if [ ! -f "$BUILD_DIR/income_proof.r1cs" ]; then
  echo "Error: Circuit not compiled. Run 'npm run compile' first."
  exit 1
fi

# Download Powers of Tau ceremony file (pot14 supports up to 2^14 = 16384 constraints)
if [ ! -f "$PTAU_FILE" ]; then
  echo "Downloading Powers of Tau (pot14)..."
  curl -L -o "$PTAU_FILE" \
    "https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_14.ptau"
  echo "Downloaded: $PTAU_FILE"
else
  echo "Powers of Tau already downloaded."
fi

# Generate initial zkey (Phase 2 ceremony)
echo ""
echo "=== Generating zkey (Phase 2) ==="
npx snarkjs groth16 setup \
  "$BUILD_DIR/income_proof.r1cs" \
  "$PTAU_FILE" \
  "$BUILD_DIR/income_proof_0000.zkey"

# Contribute to the ceremony (adds entropy)
echo ""
echo "=== Contributing to ceremony ==="
npx snarkjs zkey contribute \
  "$BUILD_DIR/income_proof_0000.zkey" \
  "$BUILD_DIR/income_proof_final.zkey" \
  --name="ZK-Credentials Hackathon" \
  -v -e="$(head -c 64 /dev/urandom | xxd -p)"

# Export verification key
echo ""
echo "=== Exporting verification key ==="
npx snarkjs zkey export verificationkey \
  "$BUILD_DIR/income_proof_final.zkey" \
  "$BUILD_DIR/verification_key.json"

echo ""
echo "=== Setup complete ==="
echo "Final zkey:        $BUILD_DIR/income_proof_final.zkey"
echo "Verification key:  $BUILD_DIR/verification_key.json"
