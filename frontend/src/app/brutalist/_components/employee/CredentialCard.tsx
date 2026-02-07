"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface CredentialCardProps {
  threshold: number;
  proofData: string;
  generatedAt?: string;
}

export function CredentialCard({ threshold, proofData, generatedAt }: CredentialCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proofData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    // Try native Web Share API first (mobile / supported browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ZK Income Proof (> $${threshold.toLocaleString()})`,
          text: proofData,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to QR
      }
    }
    // Toggle QR code modal for desktop
    setShowQR(true);
  };

  return (
    <>
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

            <div className="border-2 border-black/10 bg-gray-50 p-3">
              <p className="text-xs font-bold text-black/40">Privacy</p>
              <p className="mt-1 text-xs text-black/60">
                Salary: HIDDEN | Employer: HIDDEN | Only proves: income &gt; ${threshold.toLocaleString()}
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
              onClick={() => void handleCopy()}
              className="neo-button flex-1 text-xs"
            >
              {copied ? "Copied!" : "Copy Proof"}
            </button>
            <button
              onClick={() => void handleShare()}
              className="neo-button-secondary flex-1 text-xs"
            >
              Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="neo-card relative w-full max-w-sm"
            >
              <h2 className="text-xl font-black uppercase tracking-wider">
                SHARE PROOF
              </h2>
              <p className="mt-1 text-xs text-black/50">
                Scan this QR code to receive the ZK proof. No salary or employer data is revealed.
              </p>

              <div className="mt-4 flex justify-center border-4 border-black bg-white p-6">
                <QRCodeSVG
                  value={proofData}
                  size={200}
                  level="L"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="mt-3 border-2 border-black/10 bg-gray-50 p-2 text-center">
                <p className="text-xs font-bold text-[#00d6bd]">
                  Income &gt; ${threshold.toLocaleString()}/year
                </p>
                <p className="text-xs text-black/40">Groth16 / BN128</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => void handleCopy()}
                  className="neo-button flex-1 text-xs"
                >
                  {copied ? "Copied!" : "Copy Proof"}
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="neo-button-secondary flex-1 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
