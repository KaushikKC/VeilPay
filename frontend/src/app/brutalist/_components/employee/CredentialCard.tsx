"use client";

import { motion } from "framer-motion";

interface CredentialCardProps {
  threshold: number;
  proofData: string;
  generatedAt?: string;
}

export function CredentialCard({ threshold, proofData, generatedAt }: CredentialCardProps) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(proofData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
    >
      <div className="neo-card-interactive">
        <div className="flex items-start justify-between">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider text-[#00d6bd]"
              style={{ fontFamily: "var(--font-neo-mono), monospace" }}
            >
              ZK Credential
            </span>
            <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
              INCOME PROOF
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-[#00d6bd]/10 text-lg">
            ZK
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="border-2 border-black/10 bg-gray-50 p-3">
            <p className="text-xs font-bold text-black/40">Statement</p>
            <p className="mt-1 text-sm font-bold">
              Annual income exceeds ${threshold.toLocaleString()}
            </p>
          </div>

          <div className="border-2 border-black/10 bg-gray-50 p-3">
            <p className="text-xs font-bold text-black/40">Protocol</p>
            <p
              className="mt-1 text-xs font-bold text-[#00d6bd]"
              style={{ fontFamily: "var(--font-neo-mono), monospace" }}
            >
              Groth16 / BN128
            </p>
          </div>

          <div className="border-2 border-black/10 bg-gray-50 p-3">
            <p className="text-xs font-bold text-black/40">Proof Hash</p>
            <p
              className="mt-1 truncate text-xs text-black/60"
              style={{ fontFamily: "var(--font-neo-mono), monospace" }}
            >
              {proofData.slice(0, 48)}...
            </p>
          </div>

          {generatedAt && (
            <div className="border-2 border-black/10 bg-gray-50 p-3">
              <p className="text-xs font-bold text-black/40">Generated</p>
              <p className="mt-1 text-xs text-black/60">{generatedAt}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="neo-button flex-1 text-xs"
          >
            Copy Proof
          </button>
          <button className="neo-button-secondary flex-1 text-xs">
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
