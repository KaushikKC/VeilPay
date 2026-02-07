"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const roles = [
  {
    title: "EMPLOYER",
    description:
      "Process payroll privately. Add employees, set salaries, and pay with ZK commitments.",
    icon: "EMP",
    href: "/brutalist/app/employer",
    accent: "#00d6bd",
  },
  {
    title: "EMPLOYEE",
    description:
      "View payment history and generate zero-knowledge income proofs for landlords or lenders.",
    icon: "USR",
    href: "/brutalist/app/employee",
    accent: "#7b61ff",
  },
  {
    title: "VERIFIER",
    description:
      "Verify income credentials on-chain. Confirm an applicant earns above a threshold — without seeing their salary.",
    icon: "VRF",
    href: "/brutalist/app/verifier",
    accent: "#ff6b35",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function BrutalistAppPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-6xl">
          SELECT YOUR{" "}
          <span className="text-[#00d6bd]">ROLE</span>
        </h1>
        <p className="mt-4 text-lg text-black/50">
          Choose a portal to explore the VeilPay demo.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {roles.map((role) => (
          <motion.div key={role.title} variants={cardVariants}>
            <Link
              href={role.href}
              className="neo-card-interactive group flex h-full flex-col items-center p-8 text-center"
            >
              {/* Accent bar */}
              <div
                className="mb-4 h-2 w-16"
                style={{ backgroundColor: role.accent }}
              />
              <div
                className="flex h-14 w-14 items-center justify-center border-4 border-black text-lg font-black"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {role.icon}
              </div>
              <h2 className="mt-5 text-2xl font-black uppercase tracking-tight">
                {role.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/50">
                {role.description}
              </p>
              <span className="neo-pill mt-6 border-[#00d6bd] bg-[#00d6bd]/10 text-[#008a7a] transition-all group-hover:bg-[#00d6bd] group-hover:text-white">
                Enter Portal
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
