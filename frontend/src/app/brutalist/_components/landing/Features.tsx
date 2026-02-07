"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "SHLD",
    accent: "#00d6bd",
    title: "ZK PRIVACY",
    description:
      "Salaries are committed on-chain as hashes. Zero-knowledge proofs let employees prove income without revealing the exact amount.",
  },
  {
    icon: "BOLT",
    accent: "#ff6b35",
    title: "FAST PAYROLL",
    description:
      "Process bulk payroll in a single transaction. Employees receive funds instantly with privacy-preserving commitments.",
  },
  {
    icon: "LINK",
    accent: "#7b61ff",
    title: "ON-CHAIN COMPLIANCE",
    description:
      "Prove accredited investor status, tax residency, or income thresholds — all without exposing financial data.",
  },
  {
    icon: "LOCK",
    accent: "#ff4444",
    title: "CREDENTIAL PROOFS",
    description:
      'Generate portable ZK credentials: "I earn > $50k" for landlords, "I earn > $200k" for DeFi protocols. No salary leaked.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Features() {
  return (
    <section id="features" className="border-b-4 border-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-black uppercase tracking-tighter sm:text-6xl">
            WHY VEILPAY
          </h2>
          <p className="mt-4 text-lg text-black/50">
            Private payroll with verifiable credentials, built on
            zero-knowledge proofs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <div className="neo-card group transition-colors hover:bg-gray-50">
                {/* Color accent bar */}
                <div
                  className="mb-4 h-2 w-16"
                  style={{ backgroundColor: feature.accent }}
                />
                <div
                  className="mb-4 inline-block border-4 border-black px-3 py-1 text-xs font-black tracking-widest"
                  style={{
                    fontFamily: "var(--font-neo-mono), monospace",
                  }}
                >
                  [{feature.icon}]
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-relaxed text-black/60">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
