"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import { ProofUploader } from "~/app/brutalist/_components/verifier/ProofUploader";
import { VerificationResult } from "~/app/brutalist/_components/verifier/VerificationResult";
import { CONTRACTS, CredentialVerifierABI } from "~/lib/contracts";

function parseSolidityCalldata(calldata: string) {
  // snarkjs exports: ["a0","a1"],[["b00","b01"],["b10","b11"]],["c0","c1"],["p0","p1","p2"]
  // Wrap in array brackets so it becomes valid JSON
  const jsonStr = `[${calldata}]`;
  const arr = JSON.parse(jsonStr) as [
    [string, string],
    [[string, string], [string, string]],
    [string, string],
    [string, string, string],
  ];

  const pA: [bigint, bigint] = [BigInt(arr[0][0]), BigInt(arr[0][1])];
  const pB: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(arr[1][0][0]), BigInt(arr[1][0][1])],
    [BigInt(arr[1][1][0]), BigInt(arr[1][1][1])],
  ];
  const pC: [bigint, bigint] = [BigInt(arr[2][0]), BigInt(arr[2][1])];
  const pubSignals: [bigint, bigint, bigint] = [
    BigInt(arr[3][0]),
    BigInt(arr[3][1]),
    BigInt(arr[3][2]),
  ];

  return { pA, pB, pC, pubSignals };
}

export default function VerifierPage() {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "failed"
  >("idle");
  const [threshold, setThreshold] = useState<number | undefined>();
  const [verificationsCount, setVerificationsCount] = useState(0);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [failReason, setFailReason] = useState<string | undefined>();

  const { writeContractAsync } = useWriteContract();

  const handleVerify = async (proofJson: string) => {
    setStatus("verifying");
    setFailReason(undefined);

    try {
      // Try to parse the proof JSON
      let parsed: {
        proof?: { pi_a?: string[]; pi_b?: string[][]; pi_c?: string[] };
        publicSignals?: string[];
        solidityCalldata?: string;
      };

      try {
        // Handle base64-encoded proofs (from our ProofGenerator)
        const decoded = atob(proofJson);
        parsed = JSON.parse(decoded) as typeof parsed;
      } catch {
        // Handle raw JSON proofs
        parsed = JSON.parse(proofJson) as typeof parsed;
      }

      // snarkjs public signals order: [valid, threshold, commitment]
      const t = Number(parsed.publicSignals?.[1]);
      setThreshold(isNaN(t) ? 50000 : t);

      let pA: [bigint, bigint];
      let pB: [[bigint, bigint], [bigint, bigint]];
      let pC: [bigint, bigint];
      let pubSignals: [bigint, bigint, bigint];

      if (parsed.solidityCalldata) {
        // Parse the snarkjs solidity calldata format
        const result = parseSolidityCalldata(parsed.solidityCalldata);
        pA = result.pA;
        pB = result.pB;
        pC = result.pC;
        pubSignals = result.pubSignals;
      } else if (parsed.proof) {
        const proof = parsed.proof;
        const signals = parsed.publicSignals ?? [];

        pA = [
          BigInt(proof.pi_a?.[0] ?? "0"),
          BigInt(proof.pi_a?.[1] ?? "0"),
        ];
        pB = [
          [
            BigInt(proof.pi_b?.[0]?.[0] ?? "0"),
            BigInt(proof.pi_b?.[0]?.[1] ?? "0"),
          ],
          [
            BigInt(proof.pi_b?.[1]?.[0] ?? "0"),
            BigInt(proof.pi_b?.[1]?.[1] ?? "0"),
          ],
        ];
        pC = [
          BigInt(proof.pi_c?.[0] ?? "0"),
          BigInt(proof.pi_c?.[1] ?? "0"),
        ];
        pubSignals = [
          BigInt(signals[0] ?? "0"),
          BigInt(signals[1] ?? "0"),
          BigInt(signals[2] ?? "0"),
        ];
      } else {
        throw new Error("No proof data found in JSON");
      }

      // Update threshold from parsed pubSignals
      // snarkjs order: [valid, threshold, commitment]
      setThreshold(Number(pubSignals[1]));

      // Check valid signal locally before sending tx
      // pubSignals[0] is the 'valid' output from the circuit
      if (pubSignals[0] !== 1n) {
        setFailReason(
          "Income is below the requested threshold (valid signal = 0)",
        );
        setStatus("failed");
        return;
      }

      const hash = await writeContractAsync({
        address: CONTRACTS.CredentialVerifier as `0x${string}`,
        abi: CredentialVerifierABI,
        functionName: "verifyIncomeProof",
        args: [pA, pB, pC, pubSignals],
      });

      setTxHash(hash);
      setVerificationsCount((prev) => prev + 1);
      setStatus("success");
    } catch (err: unknown) {
      console.error("Verification failed:", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("ProofOutputInvalid")) {
        setFailReason("Income is below the requested threshold");
      } else if (msg.includes("InvalidProof")) {
        setFailReason("ZK proof is cryptographically invalid");
      } else {
        setFailReason(msg.length > 150 ? msg.slice(0, 150) + "..." : msg);
      }
      setStatus("failed");
    }
  };

  const handleVerificationComplete = (_success: boolean) => {
    // No-op: we handle status in handleVerify directly
  };

  const handleReset = () => {
    setStatus("idle");
    setThreshold(undefined);
    setTxHash(undefined);
    setFailReason(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          VERIFIER PORTAL
        </h1>
        <p className="mt-1 text-black/50">
          Verify income credentials without learning salary or employer details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Verifications"
          value={String(verificationsCount)}
          subtitle="This session"
          icon="VRF"
          delay={0}
        />
        <DashboardCard
          title="Protocol"
          value="Groth16"
          subtitle="BN128 curve"
          icon="ZKP"
          delay={0.1}
        />
        <DashboardCard
          title="Data Revealed"
          value="ZERO"
          subtitle="Salary & employer hidden"
          icon="////"
          delay={0.2}
        />
      </div>

      {!isConnected && (
        <div className="border-4 border-yellow-500 bg-yellow-50 p-4 text-center text-sm font-bold">
          Connect wallet to verify proofs on-chain
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProofUploader
          onVerify={(json) => void handleVerify(json)}
          isVerifying={status === "verifying"}
        />
        {status !== "idle" && (
          <VerificationResult
            status={status}
            threshold={threshold}
            onReset={handleReset}
            onComplete={handleVerificationComplete}
            txHash={txHash}
            failReason={failReason}
          />
        )}
      </div>
    </div>
  );
}
