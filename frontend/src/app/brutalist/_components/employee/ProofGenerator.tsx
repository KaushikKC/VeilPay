"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProofGeneratorProps {
  onProofGenerated: (proof: { threshold: number; proofData: string }) => void;
}

const thresholds = [
  { value: 50000, label: "$50,000", description: "Rental qualification" },
  { value: 100000, label: "$100,000", description: "Premium services" },
  { value: 200000, label: "$200,000", description: "Accredited investor" },
];

const proofSteps = [
  "Fetching payroll commitments...",
  "Computing witness from inputs...",
  "Generating Groth16 proof...",
  "Verifying proof locally...",
  "Packaging credential...",
];

export function ProofGenerator({ onProofGenerated }: ProofGeneratorProps) {
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerate = () => {
    if (selectedThreshold === null) return;
    setState("generating");
    setCurrentStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= proofSteps.length) {
        clearInterval(interval);
        setState("done");

        const mockProof = btoa(
          JSON.stringify({
            pi_a: ["0x1a2b3c...", "0x4d5e6f..."],
            pi_b: [["0x7a8b9c...", "0x0d1e2f..."], ["0x3a4b5c...", "0x6d7e8f..."]],
            pi_c: ["0x9a0b1c...", "0x2d3e4f..."],
            publicSignals: [String(selectedThreshold), "0xnullifier..."],
            protocol: "groth16",
            curve: "bn128",
          })
        );

        onProofGenerated({ threshold: selectedThreshold, proofData: mockProof });
      } else {
        setCurrentStep(step);
      }
    }, 500);
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
                setState("idle");
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
            onClick={handleGenerate}
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
                style={{ fontFamily: "var(--font-neo-mono), monospace", fontSize: "0.75rem" }}
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
      </AnimatePresence>
    </motion.div>
  );
}
