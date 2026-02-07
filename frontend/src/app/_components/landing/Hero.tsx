"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "~/app/_components/ui/AuroraBackground";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";
import { GradientText } from "~/app/_components/ui/GradientText";
import { MovingBorder } from "~/app/_components/ui/MovingBorder";

const PAUSE_BETWEEN_MS = 800;
const DECRYPT_SPEED = 80;

export function Hero() {
  const [triggers, setTriggers] = useState([0, 0, 0]);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const advanceTo = useCallback((index: number) => {
    timeoutRef.current = setTimeout(() => {
      setTriggers((t) => {
        const copy = [...t];
        copy[index] = (copy[index] ?? 0) + 1;
        return copy;
      });
    }, PAUSE_BETWEEN_MS);
  }, []);

  const handleComplete = useCallback(
    (index: number) => {
      const next = (index + 1) % 3;
      advanceTo(next);
    },
    [advanceTo],
  );

  return (
    <AuroraBackground className="flex min-h-screen flex-col items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm tracking-wide text-green-400"
        >
          ZK-Credentials &bull; Private Payroll &bull; On-Chain Compliance
        </motion.span>

        <h1 className="font-display max-w-4xl text-6xl leading-tight tracking-wider text-white sm:text-7xl md:text-8xl">
          <DecryptedText
            text="PRIVATE"
            speed={DECRYPT_SPEED}
            delay={300}
            trigger={triggers[0]}
            onComplete={() => handleComplete(0)}
          />
          <br />
          <GradientText>
            <DecryptedText
              text="PAYROLL"
              speed={DECRYPT_SPEED}
              autoStart={false}
              trigger={triggers[1]}
              onComplete={() => handleComplete(1)}
            />
          </GradientText>
          <br />
          <DecryptedText
            text="ZK CREDENTIALS"
            speed={DECRYPT_SPEED}
            autoStart={false}
            trigger={triggers[2]}
            onComplete={() => handleComplete(2)}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/60"
        >
          Pay employees privately on-chain. They prove income without revealing
          salary. Verifiers confirm credentials with zero-knowledge proofs —
          no data exposed, ever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <MovingBorder
            as="a"
            href="/app"
            className="px-8 py-3.5 font-semibold text-green-400"
          >
            Launch App
          </MovingBorder>
          <a
            href="#features"
            className="rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border-2 border-white/30 p-1"
        >
          <div className="h-2 w-full rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
