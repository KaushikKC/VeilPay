"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PayrollActionProps {
  employeeCount: number;
  totalPayroll: number;
  onProcess: () => void;
}

const payrollSteps = [
  "Generating salary commitments...",
  "Creating Poseidon hashes...",
  "Submitting to PayrollRegistry...",
  "Executing USDC transfers...",
  "Confirming on-chain...",
];

export function PayrollAction({ employeeCount, totalPayroll, onProcess }: PayrollActionProps) {
  const [state, setState] = useState<"idle" | "confirming" | "processing" | "success">("idle");
  const [currentStep, setCurrentStep] = useState(0);

  const handleProcess = () => {
    setState("processing");
    setCurrentStep(0);

    // Simulate steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= payrollSteps.length) {
        clearInterval(interval);
        onProcess();
        setState("success");
        setTimeout(() => setState("idle"), 3000);
      } else {
        setCurrentStep(step);
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="neo-card"
    >
      <h3 className="text-lg font-black uppercase tracking-wider">
        PROCESS PAYROLL
      </h3>
      <p className="mt-2 text-sm text-black/50">
        Pay {employeeCount} employees with ZK commitments.
      </p>

      <div className="mt-4 border-4 border-black bg-gray-50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-black/40">Employees</span>
          <span className="font-bold">{employeeCount}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-black/40">Total Monthly</span>
          <span
            className="font-bold text-[#00d6bd]"
            style={{ fontFamily: "var(--font-neo-mono), monospace" }}
          >
            ${(totalPayroll / 12).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-black/40">Network</span>
          <span className="text-black/60">Plasma (testnet)</span>
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
              className="neo-button w-full text-xs"
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
            className="mt-4 space-y-3"
          >
            <div className="border-4 border-yellow-500 bg-yellow-50 p-3 text-center text-sm font-bold">
              Confirm payroll for {employeeCount} employees?
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setState("idle")}
                className="neo-button-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProcess}
                className="neo-button flex-1 text-xs"
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
            className="mt-4 space-y-2"
          >
            {payrollSteps.map((step, i) => (
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

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <div className="border-4 border-[#00d6bd] bg-[#00d6bd]/10 p-4 text-center">
              <span className="text-3xl">&#x2713;</span>
              <p className="mt-2 text-sm font-bold text-[#008a7a]">
                Payroll processed successfully!
              </p>
              <p className="text-xs text-black/40">
                {employeeCount} ZK commitments created on-chain
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
