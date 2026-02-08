"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectWalletButton } from "~/app/brutalist/_components/app/ConnectWalletButton";
import { VerificationResult } from "~/app/brutalist/_components/verifier/VerificationResult";
import { CONTRACTS, CredentialVerifierABI } from "~/lib/contracts";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

interface ProofRecord {
  proof: { pi_a?: string[]; pi_b?: string[][]; pi_c?: string[] };
  publicSignals: string[];
  solidityCalldata: string;
  threshold: string;
  employeeAddress: string;
}

type PageState = "loading" | "ready" | "verifying" | "success" | "failed" | "error";

function parseSolidityCalldata(calldata: string) {
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

export default function VerifyProofPage() {
  const params = useParams<{ proofId: string }>();
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [state, setState] = useState<PageState>("loading");
  const [proofRecord, setProofRecord] = useState<ProofRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [failReason, setFailReason] = useState<string | undefined>();

  const threshold = proofRecord ? Number(proofRecord.threshold) : undefined;

  // Fetch proof on mount
  useEffect(() => {
    const fetchProof = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/proofs/retrieve/${params.proofId}`,
        );
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? "Proof not found");
        }
        const data = (await res.json()) as ProofRecord;
        setProofRecord(data);
        setState("ready");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load proof");
        setState("error");
      }
    };

    void fetchProof();
  }, [params.proofId]);

  const handleVerify = async () => {
    if (!proofRecord) return;
    setState("verifying");
    setFailReason(undefined);

    try {
      let pA: [bigint, bigint];
      let pB: [[bigint, bigint], [bigint, bigint]];
      let pC: [bigint, bigint];
      let pubSignals: [bigint, bigint, bigint];

      if (proofRecord.solidityCalldata) {
        const result = parseSolidityCalldata(proofRecord.solidityCalldata);
        pA = result.pA;
        pB = result.pB;
        pC = result.pC;
        pubSignals = result.pubSignals;
      } else if (proofRecord.proof) {
        const proof = proofRecord.proof;
        const signals = proofRecord.publicSignals ?? [];
        pA = [
          BigInt(proof.pi_a?.[0] ?? "0"),
          BigInt(proof.pi_a?.[1] ?? "0"),
        ];
        pB = [
          [BigInt(proof.pi_b?.[0]?.[0] ?? "0"), BigInt(proof.pi_b?.[0]?.[1] ?? "0")],
          [BigInt(proof.pi_b?.[1]?.[0] ?? "0"), BigInt(proof.pi_b?.[1]?.[1] ?? "0")],
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
        throw new Error("No proof data found");
      }

      // Check valid signal locally before sending tx
      if (pubSignals[0] !== 1n) {
        setFailReason("Income is below the requested threshold (valid signal = 0)");
        setState("failed");
        return;
      }

      const hash = await writeContractAsync({
        address: CONTRACTS.CredentialVerifier as `0x${string}`,
        abi: CredentialVerifierABI,
        functionName: "verifyIncomeProof",
        args: [pA, pB, pC, pubSignals],
      });

      setTxHash(hash);
      setState("success");
    } catch (err: unknown) {
      console.error("Verification failed:", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("ProofOutputInvalid")) {
        setFailReason("Income is below the requested threshold");
      } else if (msg.includes("InvalidProof")) {
        setFailReason("ZK proof is cryptographically invalid");
      } else if (msg.includes("User rejected") || msg.includes("user rejected")) {
        setFailReason("Transaction was rejected in wallet");
      } else {
        setFailReason(msg.length > 150 ? msg.slice(0, 150) + "..." : msg);
      }
      setState("failed");
    }
  };

  const handleReset = () => {
    setState("ready");
    setTxHash(undefined);
    setFailReason(undefined);
  };

  return (
    <div className="flex min-h-[60vh] items-start justify-center pt-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header / Branding */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center border-4 border-black bg-[#00d6bd]">
            <span className="text-sm font-black">VP</span>
          </div>
          <h1 className="mt-3 text-2xl font-black uppercase tracking-tighter">
            VERIFY CREDENTIAL
          </h1>
          <p className="mt-1 text-sm text-black/50">
            Someone shared a ZK income credential with you
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="neo-card text-center"
            >
              <p
                className="text-sm font-bold text-black/50"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                Loading proof...
              </p>
            </motion.div>
          )}

          {/* Error (fetch failed / not found) */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="neo-card border-[#ff4444]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center border-4 border-[#ff4444] bg-[#ff4444]/20 text-2xl font-black text-[#ff4444]">
                    !
                  </div>
                  <h3 className="mt-3 text-lg font-black uppercase tracking-wider text-[#ff4444]">
                    PROOF NOT FOUND
                  </h3>
                  <p className="mt-2 text-sm text-black/50">
                    {errorMsg || "This proof link may have expired or is invalid."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ready — show proof summary + connect/verify */}
          {(state === "ready" || state === "verifying") && proofRecord && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Proof summary card */}
              <div className="neo-card">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider text-[#00d6bd]"
                      style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                    >
                      ZK Credential
                    </span>
                    <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
                      INCOME PROOF
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-[#00d6bd]/10 text-lg font-black">
                    ZK
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="border-2 border-black/10 bg-gray-50 p-3">
                    <p className="text-xs font-bold text-black/40">Statement</p>
                    <p className="mt-1 text-sm font-bold">
                      Annual income exceeds ${threshold?.toLocaleString()}
                    </p>
                  </div>

                  <div className="border-2 border-black/10 bg-gray-50 p-3">
                    <p className="text-xs font-bold text-black/40">Protocol</p>
                    <p
                      className="mt-1 text-xs font-bold text-[#00d6bd]"
                      style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                    >
                      Groth16 / BN128
                    </p>
                  </div>

                  <div className="border-2 border-black/10 bg-gray-50 p-3">
                    <p className="text-xs font-bold text-black/40">Privacy</p>
                    <p className="mt-1 text-xs text-black/60">
                      Salary: HIDDEN | Employer: HIDDEN | Only proves: income &gt; ${threshold?.toLocaleString()}
                    </p>
                  </div>

                  <div className="border-2 border-black/10 bg-gray-50 p-3">
                    <p className="text-xs font-bold text-black/40">Proof ID</p>
                    <p
                      className="mt-1 truncate text-xs text-black/60"
                      style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                    >
                      {params.proofId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action area */}
              {!isConnected ? (
                <div className="neo-card flex flex-col items-center gap-4 text-center">
                  <p className="text-sm font-bold text-black/60">
                    Connect your wallet to verify this credential on-chain
                  </p>
                  <ConnectWalletButton />
                </div>
              ) : (
                <button
                  onClick={() => void handleVerify()}
                  disabled={state === "verifying"}
                  className="neo-button w-full text-xs"
                >
                  {state === "verifying" ? "Verifying..." : "Verify On-Chain"}
                </button>
              )}
            </motion.div>
          )}

          {/* Success / Failed — reuse VerificationResult */}
          {(state === "success" || state === "failed") && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <VerificationResult
                status={state}
                threshold={threshold}
                onReset={handleReset}
                txHash={txHash}
                failReason={failReason}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
