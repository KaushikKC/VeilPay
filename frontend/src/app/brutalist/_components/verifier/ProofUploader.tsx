"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProofUploaderProps {
  onVerify: (proofJson: string) => void;
  isVerifying: boolean;
}

export function ProofUploader({ onVerify, isVerifying }: ProofUploaderProps) {
  const [proofText, setProofText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<unknown>(null);

  const stopScanner = useCallback(async () => {
    try {
      const scanner = html5QrCodeRef.current as {
        isScanning?: boolean;
        stop: () => Promise<void>;
        clear: () => void;
      } | null;
      if (scanner?.isScanning) {
        await scanner.stop();
      }
      scanner?.clear();
    } catch {
      // ignore cleanup errors
    }
    html5QrCodeRef.current = null;
    setScanning(false);
  }, []);

  const startScanner = async () => {
    setScanError("");
    setScanning(true);

    try {
      // Dynamic import — html5-qrcode is heavy, only load when needed
      const { Html5Qrcode } = await import("html5-qrcode");

      // Small delay to let the DOM element render
      await new Promise((r) => setTimeout(r, 100));

      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          setProofText(decodedText.trim());
          void stopScanner();
        },
        () => {
          // ignore scan failures (no QR in frame yet)
        },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Camera access denied";
      setScanError(msg.includes("NotAllowed") ? "Camera permission denied. Allow camera access and try again." : msg);
      setScanning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

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
        Paste, drop, or scan a ZK proof to verify an income credential on-chain.
      </p>

      {/* Input method buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => void handlePasteFromClipboard()}
          className="flex-1 border-2 border-black/20 bg-white px-3 py-2 text-xs font-bold uppercase transition-colors hover:border-black"
        >
          Paste
        </button>
        <button
          onClick={() => void (scanning ? stopScanner() : startScanner())}
          className={`flex-1 border-2 px-3 py-2 text-xs font-bold uppercase transition-colors ${
            scanning
              ? "border-red-400 bg-red-50 text-red-600 hover:border-red-600"
              : "border-black/20 bg-white hover:border-black"
          }`}
        >
          {scanning ? "Stop Camera" : "Scan QR"}
        </button>
      </div>

      {/* QR Scanner */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="border-4 border-[#00d6bd] bg-black p-1">
              <div id="qr-reader" ref={scannerRef} style={{ width: "100%" }} />
            </div>
            <p className="mt-1 text-center text-xs text-black/40">
              Point camera at the QR code from the Employee portal
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {scanError && (
        <div className="mt-2 border-2 border-red-300 bg-red-50 p-2 text-center text-xs font-bold text-red-600">
          {scanError}
        </div>
      )}

      {/* Textarea with drag-and-drop */}
      <div className="mt-3">
        <label className="text-xs font-bold uppercase tracking-wider text-black/40">
          Proof Data
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative mt-1 transition-colors ${dragActive ? "ring-4 ring-[#00d6bd]" : ""}`}
        >
          <textarea
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder="Paste the base64 proof string, drop a file, or scan a QR code..."
            rows={8}
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
