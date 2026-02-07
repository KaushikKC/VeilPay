"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "~/app/_components/ui/Stepper";
import { MultiStepLoader } from "~/app/_components/ui/MultiStepLoader";
import { Sparkles } from "~/app/_components/ui/Sparkles";

interface ProofGeneratorProps {
  onProofGenerated: (proof: { threshold: number; proofData: string }) => void;
}

const thresholds = [
  { value: 50000, label: "$50,000", description: "Rental qualification" },
  { value: 100000, label: "$100,000", description: "Premium services" },
  { value: 200000, label: "$200,000", description: "Accredited investor" },
];

const proofSteps = [
  { label: "Fetching payroll commitments..." },
  { label: "Computing witness from inputs..." },
  { label: "Generating Groth16 proof..." },
  { label: "Verifying proof locally..." },
  { label: "Packaging credential..." },
];

const stepperLabels = ["Select", "Generate", "Done"];

export function ProofGenerator({ onProofGenerated }: ProofGeneratorProps) {
  const [selectedThreshold, setSelectedThreshold] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");

  const currentStep = state === "idle" ? (selectedThreshold ? 1 : 0) : state === "generating" ? 1 : 2;

  const handleGenerate = () => {
    if (selectedThreshold === null) return;
    setState("generating");
  };

  const handleLoaderComplete = () => {
    if (selectedThreshold === null) return;
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="font-display text-lg tracking-wider text-white">GENERATE PROOF</h3>
      <p className="mt-2 text-sm text-white/50">
        Prove your income exceeds a threshold without revealing exact salary.
      </p>

      <div className="mt-4 flex justify-center">
        <Stepper steps={stepperLabels} currentStep={currentStep} />
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-xs uppercase tracking-wider text-white/40">
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
              className={`rounded-xl border p-3 text-left transition-all ${
                selectedThreshold === t.value
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <p className="font-mono text-sm font-medium text-white">{t.label}</p>
              <p className="text-xs text-white/40">{t.description}</p>
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
            className="mt-6 w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-green-950 transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-30"
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
            className="mt-6"
          >
            <MultiStepLoader
              steps={proofSteps}
              loading={true}
              onComplete={handleLoaderComplete}
              stepDuration={500}
            />
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
            <Sparkles trigger={true} count={16}>
              <div className="rounded-xl bg-green-500/10 p-4 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-3xl"
                >
                  ✅
                </motion.span>
                <p className="mt-2 text-sm font-medium text-green-400">
                  Proof generated successfully!
                </p>
                <p className="text-xs text-white/40">
                  Income &gt; ${selectedThreshold?.toLocaleString()} verified
                </p>
                <button
                  onClick={() => {
                    setSelectedThreshold(null);
                    setState("idle");
                  }}
                  className="mt-3 text-xs text-green-400 underline underline-offset-2 hover:text-green-300"
                >
                  Generate another proof
                </button>
              </div>
            </Sparkles>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
