#!/bin/bash
# Compile the Circom circuit to R1CS, WASM, and SYM files
set -e

CIRCUIT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$CIRCUIT_DIR/build"

echo "=== Compiling income_proof circuit ==="

mkdir -p "$BUILD_DIR"

# Compile the circuit
circom "$CIRCUIT_DIR/income_proof.circom" \
  --r1cs \
  --wasm \
  --sym \
  --output "$BUILD_DIR"

echo ""
echo "=== Compilation complete ==="
echo "R1CS:  $BUILD_DIR/income_proof.r1cs"
echo "WASM:  $BUILD_DIR/income_proof_js/income_proof.wasm"
echo "SYM:   $BUILD_DIR/income_proof.sym"

# Print circuit info
echo ""
echo "=== Circuit Info ==="
npx snarkjs r1cs info "$BUILD_DIR/income_proof.r1cs"
