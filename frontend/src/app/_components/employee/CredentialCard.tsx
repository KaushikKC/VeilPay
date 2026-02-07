"use client";

import { motion } from "framer-motion";
import { StarBorder } from "~/app/_components/ui/StarBorder";
import { SpotlightCard } from "~/app/_components/ui/SpotlightCard";

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
      <StarBorder>
        <SpotlightCard className="p-6" spotlightColor="rgba(27, 204, 128, 0.2)">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-green-400/60">ZK Credential</span>
              <h3 className="font-display mt-1 text-xl tracking-wider text-white">
                INCOME PROOF
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <span className="text-lg">🔐</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/40">Statement</p>
              <p className="mt-1 text-sm font-medium text-white">
                Annual income exceeds ${threshold.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/40">Protocol</p>
              <p className="mt-1 font-mono text-xs text-green-400">Groth16 / BN128</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/40">Proof Hash</p>
              <p className="mt-1 truncate font-mono text-xs text-white/60">
                {proofData.slice(0, 48)}...
              </p>
            </div>

            {generatedAt && (
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/40">Generated</p>
                <p className="mt-1 text-xs text-white/60">{generatedAt}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-xl border border-green-500/20 bg-green-500/10 py-2.5 text-xs font-medium text-green-400 transition-all hover:bg-green-500/20"
            >
              Copy Proof
            </button>
            <button className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white/60 transition-all hover:bg-white/5">
              Share
            </button>
          </div>
        </SpotlightCard>
      </StarBorder>
    </motion.div>
  );
}
