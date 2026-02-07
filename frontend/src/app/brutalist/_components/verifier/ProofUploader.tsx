"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ProofUploaderProps {
  onVerify: (proofJson: string) => void;
  isVerifying: boolean;
}

export function ProofUploader({ onVerify, isVerifying }: ProofUploaderProps) {
  const [proofText, setProofText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) setProofText(text.trim());
    } catch {
      // Clipboard permission denied — ignore
    }
  };

  const handleSubmit = () => {
    if (!proofText.trim()) return;
    onVerify(proofText);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") setProofText(text.trim());
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="neo-card"
    >
      <h3 className="text-lg font-black uppercase tracking-wider">
        VERIFY PROOF
      </h3>
      <p className="mt-2 text-sm text-black/50">
        Paste or drop a ZK proof to verify an income credential on-chain.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-black/40">
            Proof Data
          </label>
          <button
            onClick={() => void handlePasteFromClipboard()}
            className="text-xs font-bold text-[#00d6bd] transition-colors hover:text-[#008a7a]"
          >
            Paste from Clipboard
          </button>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative mt-2 transition-colors ${dragActive ? "ring-4 ring-[#00d6bd]" : ""}`}
        >
          <textarea
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder="Paste the base64 proof string copied from the Employee portal, or drop a proof file here..."
            rows={10}
            className="neo-textarea w-full"
            style={{ fontFamily: "var(--font-neo-mono), monospace" }}
          />
          {dragActive && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-dashed border-[#00d6bd] bg-[#00d6bd]/10">
              <p className="text-sm font-bold text-[#008a7a]">Drop proof file here</p>
            </div>
          )}
        </div>
        {proofText && (
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-black/30">
              {proofText.length.toLocaleString()} characters
            </p>
            <button
              onClick={() => setProofText("")}
              className="text-xs font-bold text-black/30 hover:text-red-500"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!proofText.trim() || isVerifying}
        className="neo-button mt-4 w-full text-xs"
      >
        {isVerifying ? "Verifying..." : "Verify Credential"}
      </button>
    </motion.div>
  );
}
