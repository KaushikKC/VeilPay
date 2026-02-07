"use client";

import { motion } from "framer-motion";
import { LampEffect } from "~/app/_components/ui/LampEffect";
import { SpotlightCard } from "~/app/_components/ui/SpotlightCard";
import { ThreeDCard } from "~/app/_components/ui/ThreeDCard";

const features = [
  {
    icon: "🛡️",
    title: "ZK PRIVACY",
    description:
      "Salaries are committed on-chain as hashes. Zero-knowledge proofs let employees prove income without revealing the exact amount.",
  },
  {
    icon: "⚡",
    title: "FAST PAYROLL",
    description:
      "Process bulk payroll in a single transaction. Employees receive funds instantly with privacy-preserving commitments.",
  },
  {
    icon: "🔗",
    title: "ON-CHAIN COMPLIANCE",
    description:
      "Prove accredited investor status, tax residency, or income thresholds — all without exposing financial data.",
  },
  {
    icon: "🔐",
    title: "CREDENTIAL PROOFS",
    description:
      "Generate portable ZK credentials: \"I earn > $50k\" for landlords, \"I earn > $200k\" for DeFi protocols. No salary leaked.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <LampEffect className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl tracking-wider text-white sm:text-6xl">
              WHY VEILPAY
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Private payroll with verifiable credentials, built on zero-knowledge proofs.
            </p>
          </motion.div>
        </LampEffect>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <ThreeDCard>
                <SpotlightCard className="p-8 transition-colors hover:border-green-500/30">
                  <span className="text-4xl">{feature.icon}</span>
                  <h3 className="font-display mt-5 text-xl tracking-wider text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </ThreeDCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
