"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MultiStepLoader } from "~/app/_components/ui/MultiStepLoader";
import { Sparkles } from "~/app/_components/ui/Sparkles";
import { StarBorder } from "~/app/_components/ui/StarBorder";

interface VerificationResultProps {
  status: "idle" | "verifying" | "success" | "failed";
  threshold?: number;
  onReset: () => void;
  onComplete?: (success: boolean) => void;
}

const verificationSteps = [
  { label: "Parsing proof structure..." },
  { label: "Validating Groth16 parameters..." },
  { label: "Checking public signals..." },
  { label: "Verifying on BN128 curve..." },
  { label: "On-chain verification..." },
];

export function VerificationResult({ status, threshold, onReset, onComplete }: VerificationResultProps) {
  const handleLoaderComplete = () => {
    // Randomly succeed (90%) or fail (10%) for demo variety
    const success = Math.random() > 0.1;
    onComplete?.(success);
  };

  return (
    <AnimatePresence mode="wait">
      {status === "verifying" && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8"
        >
          <div className="flex flex-col items-center">
            <p className="font-display text-lg tracking-wider text-white">VERIFYING</p>
            <div className="mt-4 w-full">
              <MultiStepLoader
                steps={verificationSteps}
                loading={true}
                onComplete={handleLoaderComplete}
                stepDuration={450}
              />
            </div>
          </div>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Sparkles trigger={true} count={20}>
            <StarBorder>
              <div className="rounded-2xl bg-green-500/5 p-8">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
                  >
                    <span className="text-4xl">✅</span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-display mt-4 text-2xl tracking-wider text-green-400"
                  >
                    VERIFIED
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-2 text-white/60"
                  >
                    Credential is valid
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 w-full rounded-xl bg-white/5 p-4"
                  >
                    <p className="text-xs text-white/40">Confirmed Statement</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      Applicant earns &gt; ${threshold?.toLocaleString()}/year
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 w-full space-y-2"
                  >
                    <div className="flex justify-between rounded-lg bg-white/5 px-4 py-2 text-xs">
                      <span className="text-white/40">Protocol</span>
                      <span className="font-mono text-green-400">Groth16</span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-white/5 px-4 py-2 text-xs">
                      <span className="text-white/40">Curve</span>
                      <span className="font-mono text-white/60">BN128</span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-white/5 px-4 py-2 text-xs">
                      <span className="text-white/40">Salary Revealed</span>
                      <span className="font-mono text-white/60">No</span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-white/5 px-4 py-2 text-xs">
                      <span className="text-white/40">Employer Revealed</span>
                      <span className="font-mono text-white/60">No</span>
                    </div>
                  </motion.div>

                  <button
                    onClick={onReset}
                    className="mt-6 text-sm text-green-400 underline underline-offset-2 transition-colors hover:text-green-300"
                  >
                    Verify another proof
                  </button>
                </div>
              </div>
            </StarBorder>
          </Sparkles>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          key="failed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <span className="text-4xl">❌</span>
            </div>
            <h3 className="font-display mt-4 text-2xl tracking-wider text-red-400">INVALID</h3>
            <p className="mt-2 text-sm text-white/50">
              The proof could not be verified. It may be malformed or the income threshold is not met.
            </p>
            <button
              onClick={onReset}
              className="mt-6 text-sm text-red-400 underline underline-offset-2 transition-colors hover:text-red-300"
            >
              Try again
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
