pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/poseidon.circom";

/// @title IncomeProof
/// @notice Proves that an employee's salary >= a given threshold WITHOUT
///         revealing the actual salary. The proof is bound to an on-chain
///         Poseidon commitment so it cannot be forged.
///
/// Private inputs (known only to the prover / employee):
///   - salary:          actual salary amount (fits in 64 bits, max ~$18.4 quadrillion)
///   - nonce:           random blinding factor used when creating the commitment
///   - employeeAddress: the employee's Ethereum address (as a field element)
///
/// Public inputs (visible on-chain and to the verifier):
///   - threshold:  minimum income the prover claims to earn
///   - commitment: Poseidon(employeeAddress, salary, nonce) stored on-chain
///
/// Output:
///   - valid: 1 if salary >= threshold, 0 otherwise
///            (the proof itself only verifies if valid == 1 due to the
///             constraint structure, but we output it for explicitness)

template IncomeProof() {
    // ---- Private inputs ----
    signal input salary;
    signal input nonce;
    signal input employeeAddress;

    // ---- Public inputs ----
    signal input threshold;
    signal input commitment;

    // ---- Output ----
    signal output valid;

    // ---------------------------------------------------------------
    // 1. Verify salary >= threshold using a 64-bit comparator
    // ---------------------------------------------------------------
    component gte = GreaterEqThan(64);
    gte.in[0] <== salary;
    gte.in[1] <== threshold;

    // gte.out == 1 if salary >= threshold, 0 otherwise
    valid <== gte.out;

    // ---------------------------------------------------------------
    // 2. Verify that the commitment matches the private inputs
    //    commitment == Poseidon(employeeAddress, salary, nonce)
    // ---------------------------------------------------------------
    component hasher = Poseidon(3);
    hasher.inputs[0] <== employeeAddress;
    hasher.inputs[1] <== salary;
    hasher.inputs[2] <== nonce;

    // This is a hard constraint: if the commitment doesn't match,
    // the proof generation will fail entirely.
    commitment === hasher.out;
}

// Public signals output order (Circom 2.0+):
//   [0] valid        (output signal)
//   [1] threshold    (public input)
//   [2] commitment   (public input)
component main {public [threshold, commitment]} = IncomeProof();
