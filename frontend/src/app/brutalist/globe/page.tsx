"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

const Globe = dynamic(
  () => import("../_components/landing/Globe").then((m) => m.Globe),
  { ssr: false },
);

export default function GlobePage() {
  return (
    <section className="relative min-h-screen overflow-hidden border-b-4 border-black bg-white">
      {/* Top accent bar */}
      <div className="danger-stripes-thin absolute top-0 left-0 z-20 h-2 w-full" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-14 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 text-center"
        >
          <span className="neo-pill inline-block border-[#00d6bd] bg-[#00d6bd]/10 text-black">
            Global // Private // Borderless
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-5xl leading-none font-black tracking-tighter text-black uppercase sm:text-7xl md:text-8xl"
        >
          PAY ANYONE
          <br />
          <span className="text-[#00d6bd]">ANYWHERE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-3 max-w-xl text-center text-base leading-relaxed text-black/60"
        >
          Zero-knowledge payroll across borders. Employees prove credentials
          without exposing salary data — verified on-chain, private by default.
        </motion.p>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-4"
        >
          <Globe />

          {/* Fade overlay at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative z-20 -mt-14 grid grid-cols-3 gap-4"
        >
          {[
            { label: "COUNTRIES", value: "190+" },
            { label: "PROOFS GENERATED", value: "∞" },
            { label: "DATA EXPOSED", value: "ZERO" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-4 border-black bg-white p-3 text-center shadow-[4px_4px_0_#000]"
            >
              <div
                className="text-2xl font-black text-[#00d6bd] sm:text-3xl"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-bold tracking-wider text-black/50 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-6 flex justify-center gap-4"
        >
          <Link href="/app" className="neo-button">
            Launch App
          </Link>
          <Link href="/brutalist" className="neo-button-secondary">
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Bottom accent bar */}
      <div className="danger-stripes-thin absolute bottom-0 left-0 z-20 h-2 w-full" />
    </section>
  );
}
