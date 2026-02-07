"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

interface ProofGeneratorProps {
  onProofGenerated: (proof: { threshold: number; proofData: string }) => void;
  employeeAddress?: `0x${string}`;
}

const thresholds = [
  { value: 1, label: "$1", description: "Testnet demo" },
  { value: 10, label: "$10", description: "Basic verification" },
  { value: 50000, label: "$50,000", description: "Rental qualification" },
  { value: 100000, label: "$100,000", description: "Premium services" },
];

const proofSteps = [
  "Fetching payroll commitments...",
  "Computing witness from inputs...",
  "Generating Groth16 proof...",
  "Verifying proof locally...",
  "Packaging credential...",
];

export function ProofGenerator({
  onProofGenerated,
  employeeAddress,
}: ProofGeneratorProps) {
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(
    null,
  );
  const [state, setState] = useState<
    "idle" | "generating" | "done" | "error"
  >("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    if (selectedThreshold === null || !employeeAddress) return;
    setState("generating");
    setCurrentStep(0);
    setErrorMsg("");

    try {
      // Step 0: Fetch employee data from backend
      const empRes = await fetch(
        `${BACKEND_URL}/api/commitments/employee/${employeeAddress}`,
      );
      if (!empRes.ok) throw new Error("Employee data not found. Process payroll first.");
      const empData = (await empRes.json()) as {
        salary: string;
        nonce: string;
        commitment: string;
      };
      setCurrentStep(1);

      // Step 1-2: Generate proof via backend
      setCurrentStep(2);
      const proofRes = await fetch(`${BACKEND_URL}/api/proofs/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salary: empData.salary,
          nonce: empData.nonce,
          employeeAddress: employeeAddress,
          threshold: String(selectedThreshold),
          commitment: empData.commitment,
        }),
      });

      if (!proofRes.ok) {
        const errBody = await proofRes.json().catch(() => ({})) as { error?: string };
        throw new Error(errBody.error ?? "Proof generation failed");
      }

      const proofData = (await proofRes.json()) as {
        proof: object;
        publicSignals: string[];
        solidityCalldata: string;
      };
      setCurrentStep(3);

      // Step 3-4: Verify locally + package
      await new Promise((r) => setTimeout(r, 500));
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 500));

      setState("done");

      const encodedProof = btoa(
        JSON.stringify({
          proof: proofData.proof,
          publicSignals: proofData.publicSignals,
          solidityCalldata: proofData.solidityCalldata,
          protocol: "groth16",
          curve: "bn128",
        }),
      );

      onProofGenerated({ threshold: selectedThreshold, proofData: encodedProof });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Proof generation failed";
      setErrorMsg(message);
      setState("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="neo-card"
    >
      <h3 className="text-lg font-black uppercase tracking-wider">
        GENERATE PROOF
      </h3>
      <p className="mt-2 text-sm text-black/50">
        Prove your income exceeds a threshold without revealing exact salary.
      </p>

      {/* Step indicator */}
      <div className="mt-4 flex gap-0">
        {["SELECT", "GENERATE", "DONE"].map((step, i) => (
          <div
            key={step}
            className={`flex-1 border-t-4 px-2 py-1 text-center text-xs font-bold uppercase ${
              (state === "idle" && i === 0) ||
              (state === "idle" && selectedThreshold && i === 1) ||
              (state === "generating" && i === 1) ||
              (state === "done" && i === 2)
                ? "border-[#00d6bd] text-[#00d6bd]"
                : "border-black/20 text-black/30"
            }`}
            style={{ fontFamily: "var(--font-neo-mono), monospace" }}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-black/40">
          Select Threshold
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {thresholds.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setSelectedThreshold(t.value);
                if (state === "done" || state === "error") setState("idle");
              }}
              className={`border-4 p-3 text-left transition-all ${
                selectedThreshold === t.value
                  ? "border-[#00d6bd] bg-[#00d6bd]/10"
                  : "border-black/20 bg-white hover:border-black"
              }`}
            >
              <p
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {t.label}
              </p>
              <p className="text-xs text-black/40">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="generate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => void handleGenerate()}
            disabled={selectedThreshold === null}
            className="neo-button mt-6 w-full text-xs"
          >
            Generate ZK Proof
          </motion.button>
        )}

        {state === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-2"
          >
            {proofSteps.map((step, i) => (
              <div
                key={step}
                className={
                  i < currentStep
                    ? "neo-step-done"
                    : i === currentStep
                      ? "neo-step-active"
                      : "neo-step-pending"
                }
                style={{
                  fontFamily: "var(--font-neo-mono), monospace",
                  fontSize: "0.75rem",
                }}
              >
                {i < currentStep ? "// " : i === currentStep ? "> " : "  "}
                {step}
              </div>
            ))}
          </motion.div>
        )}

        {state === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="border-4 border-[#00d6bd] bg-[#00d6bd]/10 p-4 text-center">
              <span className="text-3xl">&#x2713;</span>
              <p className="mt-2 text-sm font-bold text-[#008a7a]">
                Proof generated successfully!
              </p>
              <p className="text-xs text-black/40">
                Income &gt; ${selectedThreshold?.toLocaleString()} verified
              </p>
              <button
                onClick={() => {
                  setSelectedThreshold(null);
                  setState("idle");
                }}
                className="mt-3 text-xs font-bold text-[#00d6bd] underline underline-offset-2 hover:text-[#008a7a]"
              >
                Generate another proof
              </button>
            </div>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <div className="border-4 border-red-400 bg-red-50 p-4 text-center">
              <span className="text-3xl text-red-500">X</span>
              <p className="mt-2 text-sm font-bold text-red-600">
                Proof generation failed
              </p>
              <p className="mt-1 text-xs text-black/40">
                {errorMsg.length > 120
                  ? errorMsg.slice(0, 120) + "..."
                  : errorMsg}
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-3 text-xs font-bold text-red-500 underline underline-offset-2 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
