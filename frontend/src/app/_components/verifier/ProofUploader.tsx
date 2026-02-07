"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ProofUploaderProps {
  onVerify: (proofJson: string) => void;
  isVerifying: boolean;
}

const sampleProof = JSON.stringify(
  {
    pi_a: ["0x1a2b3c4d5e6f7890...", "0x4d5e6f7a8b9c0d1e..."],
    pi_b: [
      ["0x7a8b9c0d1e2f3a4b...", "0x0d1e2f3a4b5c6d7e..."],
      ["0x3a4b5c6d7e8f9a0b...", "0x6d7e8f9a0b1c2d3e..."],
    ],
    pi_c: ["0x9a0b1c2d3e4f5a6b...", "0x2d3e4f5a6b7c8d9e..."],
    publicSignals: ["50000", "0xnullifier_abc123..."],
    protocol: "groth16",
    curve: "bn128",
  },
  null,
  2
);

export function ProofUploader({ onVerify, isVerifying }: ProofUploaderProps) {
  const [proofText, setProofText] = useState("");

  const handlePasteSample = () => {
    setProofText(sampleProof);
  };

  const handleSubmit = () => {
    if (!proofText.trim()) return;
    onVerify(proofText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="font-display text-lg tracking-wider text-white">VERIFY PROOF</h3>
      <p className="mt-2 text-sm text-white/50">
        Paste a ZK proof JSON to verify an income credential on-chain.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-white/40">
            Proof JSON
          </label>
          <button
            onClick={handlePasteSample}
            className="text-xs text-green-400 transition-colors hover:text-green-300"
          >
            Paste Sample
          </button>
        </div>
        <textarea
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          placeholder='{"pi_a": [...], "pi_b": [...], "pi_c": [...], "publicSignals": [...]}'
          rows={10}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs text-white/80 placeholder-white/20 outline-none transition-colors focus:border-green-500/50"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!proofText.trim() || isVerifying}
        className="mt-4 w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-green-950 transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {isVerifying ? "Verifying..." : "Verify Credential"}
      </button>
    </motion.div>
  );
}
