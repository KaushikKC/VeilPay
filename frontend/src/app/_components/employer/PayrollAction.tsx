"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MultiStepLoader } from "~/app/_components/ui/MultiStepLoader";
import { Sparkles } from "~/app/_components/ui/Sparkles";

interface PayrollActionProps {
  employeeCount: number;
  totalPayroll: number;
  onProcess: () => void;
}

const payrollSteps = [
  { label: "Generating salary commitments..." },
  { label: "Creating Poseidon hashes..." },
  { label: "Submitting to PayrollRegistry..." },
  { label: "Executing USDC transfers..." },
  { label: "Confirming on-chain..." },
];

export function PayrollAction({ employeeCount, totalPayroll, onProcess }: PayrollActionProps) {
  const [state, setState] = useState<"idle" | "confirming" | "processing" | "success">("idle");

  const handleProcess = () => {
    setState("processing");
  };

  const handleLoaderComplete = () => {
    onProcess();
    setState("success");
    setTimeout(() => setState("idle"), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="font-display text-lg tracking-wider text-white">PROCESS PAYROLL</h3>
      <p className="mt-2 text-sm text-white/50">
        Pay {employeeCount} employees with ZK commitments.
      </p>

      <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Employees</span>
          <span className="text-white">{employeeCount}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-white/40">Total Monthly</span>
          <span className="font-mono text-green-400">
            ${(totalPayroll / 12).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-white/40">Network</span>
          <span className="text-white/60">Plasma (testnet)</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <button
              onClick={() => setState("confirming")}
              disabled={employeeCount === 0}
              className="w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-green-950 transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Process Payroll
            </button>
          </motion.div>
        )}

        {state === "confirming" && (
          <motion.div
            key="confirming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-2"
          >
            <p className="text-center text-sm text-yellow-400">
              Confirm payroll for {employeeCount} employees?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setState("idle")}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleProcess}
                className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-semibold text-green-950 transition-all hover:bg-green-400"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <MultiStepLoader
              steps={payrollSteps}
              loading={true}
              onComplete={handleLoaderComplete}
              stepDuration={500}
            />
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <Sparkles trigger={true} count={16}>
              <div className="flex flex-col items-center rounded-xl bg-green-500/10 py-4">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-3xl"
                >
                  ✅
                </motion.span>
                <p className="mt-2 text-sm font-medium text-green-400">
                  Payroll processed successfully!
                </p>
                <p className="text-xs text-white/40">
                  {employeeCount} ZK commitments created on-chain
                </p>
              </div>
            </Sparkles>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
