"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qrcode-logo";

interface CredentialCardProps {
  threshold: number;
  /** Short retrieval URL (e.g. http://…/api/proofs/retrieve/<uuid>) */
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

  const handleShare = () => {
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
              <p className="text-xs font-bold text-black/40">Proof ID</p>
              <p
                className="mt-1 truncate text-xs text-black/60"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {proofData.split("/").pop() ?? proofData.slice(0, 48)}
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
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <button
              onClick={handleShare}
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
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-[#00d6bd]">
                  <span className="text-sm font-black">QR</span>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider">
                    SHARE PROOF
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                    Zero-Knowledge Credential
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-black/50">
                Scan this QR code to receive the ZK proof. No salary or employer data is revealed.
              </p>

              {/* QR Code with corner accents */}
              <div className="relative mt-4">
                <div className="absolute -left-1 -top-1 h-4 w-4 border-l-4 border-t-4 border-[#00d6bd]" />
                <div className="absolute -right-1 -top-1 h-4 w-4 border-r-4 border-t-4 border-[#00d6bd]" />
                <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-[#00d6bd]" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-[#00d6bd]" />

                <div className="flex justify-center border-4 border-black bg-white p-3">
                  <div className="scan-lines relative">
                    <QRCode
                      value={proofData}
                      size={240}
                      ecLevel="H"
                      bgColor="#ffffff"
                      fgColor="#0a0a0a"
                      qrStyle="dots"
                      eyeRadius={[
                        [12, 12, 0, 12],
                        [12, 12, 12, 0],
                        [12, 0, 12, 12],
                      ]}
                      eyeColor="#00d6bd"
                      logoImage="/logo.png"
                      logoWidth={48}
                      logoHeight={48}
                      removeQrCodeBehindLogo
                      logoPadding={4}
                      logoPaddingStyle="circle"
                      quietZone={4}
                    />
                  </div>
                </div>

                {/* Accent stripe bar */}
                <div className="danger-stripes-thin h-2" />
              </div>

              {/* Proof info */}
              <div className="mt-3 border-2 border-black bg-gray-50 p-3 text-center">
                <p
                  className="text-sm font-black uppercase tracking-wider text-[#00d6bd]"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  Income &gt; ${threshold.toLocaleString()}/year
                </p>
                <p
                  className="mt-1 text-xs font-bold uppercase tracking-wider text-black/40"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  Groth16 / BN128 &mdash; ZK Verified
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => void handleCopy()}
                  className="neo-button flex-1 text-xs"
                >
                  {copied ? "Copied!" : "Copy URL"}
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
