"use client";

import { motion } from "framer-motion";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isComplete
                    ? "#1bcc80"
                    : isCurrent
                      ? "rgba(27, 204, 128, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  borderColor: isComplete || isCurrent
                    ? "rgba(27, 204, 128, 0.5)"
                    : "rgba(255, 255, 255, 0.1)",
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium"
              >
                {isComplete ? (
                  <svg className="h-4 w-4 text-green-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={isCurrent ? "text-green-400" : "text-white/40"}>
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`mt-1.5 text-[10px] tracking-wide ${
                  isComplete
                    ? "text-green-400"
                    : isCurrent
                      ? "text-white"
                      : "text-white/30"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mb-4 w-8">
                <motion.div
                  className="h-px"
                  animate={{
                    backgroundColor: isComplete
                      ? "rgba(27, 204, 128, 0.5)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
