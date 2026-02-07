"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";

export function Hero() {
  const [glitchHovered, setGlitchHovered] = useState(false);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);

  const handleGlitchEnter = useCallback(() => {
    setGlitchHovered(true);
    setScrambleTrigger((prev) => prev + 1);
  }, []);

  const handleGlitchLeave = useCallback(() => {
    setGlitchHovered(false);
  }, []);

  return (
    <section className="grid-overlay relative overflow-hidden border-b-4 border-black bg-white px-6 py-32">
      {/* Danger stripes accent bar */}
      <div className="danger-stripes-thin absolute top-0 left-0 h-2 w-full" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -40, scaleY: 1.4 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="neo-pill mb-8 inline-block border-[#00d6bd] bg-[#00d6bd]/10 text-black">
            ZK-Credentials // Private Payroll // On-Chain
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl leading-none font-black tracking-tighter uppercase sm:text-8xl md:text-9xl"
        >
          PRIVATE
          <br />
          <span className="text-[#00d6bd]">PAYROLL</span>
          <br />
          <span
            className="relative"
            onMouseEnter={handleGlitchEnter}
            onMouseLeave={handleGlitchLeave}
          >
            ZK CREDENTIALS
            {/* Red glitch overlay */}
            <span
              className={`absolute inset-0 whitespace-nowrap text-[#ff0000] transition-opacity duration-150 ${
                glitchHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{ animation: "glitch-1 0.3s linear" }}
              aria-hidden
            >
              ZK CREDEN
              <DecryptedText
                text="TIALS"
                speed={80}
                autoStart={false}
                trigger={scrambleTrigger}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
              />
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-black/60"
        >
          Pay employees privately on-chain. They prove income without revealing
          salary. Verifiers confirm credentials with zero-knowledge proofs — no
          data exposed, ever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link href="/app" className="neo-button">
            Launch App
          </Link>
          <a href="#features" className="neo-button-secondary">
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="danger-stripes-thin absolute bottom-0 left-0 h-2 w-full" />
    </section>
  );
}
