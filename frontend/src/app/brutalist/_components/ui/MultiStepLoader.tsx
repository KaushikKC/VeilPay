"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  label: string;
}

interface MultiStepLoaderProps {
  steps: Step[];
  loading: boolean;
  onComplete?: () => void;
  stepDuration?: number;
}

export function MultiStepLoader({
  steps,
  loading,
  onComplete,
  stepDuration = 600,
}: MultiStepLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [loading, steps.length, stepDuration, onComplete]);

  if (!loading) return null;

  return (
    <div className="space-y-3 py-2">
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500"
                  >
                    <svg className="h-3.5 w-3.5 text-green-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    key="loading"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-green-500/30 border-t-green-500"
                  />
                ) : (
                  <motion.div
                    key="pending"
                    className="h-2 w-2 rounded-full bg-white/20"
                  />
                )}
              </AnimatePresence>
            </div>
            <span
              className={`text-sm transition-colors ${
                isComplete
                  ? "text-green-400"
                  : isCurrent
                    ? "text-white"
                    : "text-white/30"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
