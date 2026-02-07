"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VerificationResultProps {
  status: "idle" | "verifying" | "success" | "failed";
  threshold?: number;
  onReset: () => void;
  onComplete?: (success: boolean) => void;
  txHash?: string;
  failReason?: string;
}

export function VerificationResult({
  status,
  threshold,
  onReset,
  onComplete: _onComplete,
  txHash,
  failReason,
}: VerificationResultProps) {
  return (
    <AnimatePresence mode="wait">
      {status === "verifying" && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="neo-card"
        >
          <div className="flex flex-col items-center">
            <p className="text-lg font-black uppercase tracking-wider">
              VERIFYING
            </p>
            <div className="mt-4 w-full space-y-2">
              <div
                className="neo-step-active"
                style={{
                  fontFamily: "var(--font-neo-mono), monospace",
                  fontSize: "0.75rem",
                }}
              >
                {">"} Submitting proof to CredentialVerifier...
              </div>
              <div
                className="neo-step-pending"
                style={{
                  fontFamily: "var(--font-neo-mono), monospace",
                  fontSize: "0.75rem",
                }}
              >
                {"  "}Awaiting on-chain confirmation...
              </div>
            </div>
            <p className="mt-4 text-xs text-black/40">
              Confirm the transaction in your wallet
            </p>
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
          <div className="neo-card border-[#00d6bd]">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                }}
                className="flex h-16 w-16 items-center justify-center border-4 border-[#00d6bd] bg-[#00d6bd]/20 text-3xl font-black"
              >
                &#x2713;
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-2xl font-black uppercase tracking-wider text-[#00d6bd]"
              >
                VERIFIED
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-2 text-black/60"
              >
                Credential verified on-chain
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 w-full border-4 border-black bg-gray-50 p-4"
              >
                <p className="text-xs font-bold text-black/40">
                  Confirmed Statement
                </p>
                <p className="mt-1 text-sm font-bold">
                  Applicant earns &gt; ${threshold?.toLocaleString()}/year
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 w-full space-y-2"
              >
                {[
                  { label: "Protocol", value: "Groth16", accent: true },
                  { label: "Curve", value: "BN128", accent: false },
                  { label: "Salary Revealed", value: "No", accent: false },
                  { label: "Employer Revealed", value: "No", accent: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between border-2 border-black/10 bg-gray-50 px-4 py-2 text-xs"
                  >
                    <span className="font-bold text-black/40">
                      {row.label}
                    </span>
                    <span
                      className={`font-bold ${row.accent ? "text-[#00d6bd]" : "text-black/60"}`}
                      style={{
                        fontFamily: "var(--font-neo-mono), monospace",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                {txHash && (
                  <div className="flex justify-between border-2 border-black/10 bg-gray-50 px-4 py-2 text-xs">
                    <span className="font-bold text-black/40">Tx Hash</span>
                    <span
                      className="font-bold text-black/60"
                      style={{
                        fontFamily: "var(--font-neo-mono), monospace",
                      }}
                    >
                      {txHash.slice(0, 8)}...{txHash.slice(-6)}
                    </span>
                  </div>
                )}
              </motion.div>

              <button
                onClick={onReset}
                className="mt-6 text-sm font-bold text-[#00d6bd] underline underline-offset-2 transition-colors hover:text-[#008a7a]"
              >
                Verify another proof
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          key="failed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="neo-card border-[#ff4444]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center border-4 border-[#ff4444] bg-[#ff4444]/20 text-3xl font-black text-[#ff4444]">
                X
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-wider text-[#ff4444]">
                INVALID
              </h3>
              <p className="mt-2 text-sm text-black/50">
                {failReason ?? "The proof could not be verified on-chain."}
              </p>
              <button
                onClick={onReset}
                className="mt-6 text-sm font-bold text-[#ff4444] underline underline-offset-2 transition-colors hover:text-[#cc0000]"
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
