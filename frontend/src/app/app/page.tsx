"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";
import { SpotlightCard } from "~/app/_components/ui/SpotlightCard";

const roles = [
  {
    title: "EMPLOYER",
    description: "Process payroll privately. Add employees, set salaries, and pay with ZK commitments.",
    icon: "🏢",
    href: "/app/employer",
  },
  {
    title: "EMPLOYEE",
    description: "View payment history and generate zero-knowledge income proofs for landlords or lenders.",
    icon: "👤",
    href: "/app/employee",
  },
  {
    title: "VERIFIER",
    description: "Verify income credentials on-chain. Confirm an applicant earns above a threshold — without seeing their salary.",
    icon: "🔍",
    href: "/app/verifier",
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

export default function AppPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="font-display text-5xl tracking-wider text-white sm:text-6xl">
          <DecryptedText text="SELECT YOUR " speed={35} delay={200} />
          <span className="text-green-400">
            <DecryptedText text="ROLE" speed={35} delay={600} />
          </span>
        </h1>
        <p className="mt-4 text-lg text-white/50">
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
            <SpotlightCard className="h-full">
              <Link
                href={role.href}
                className="group flex h-full flex-col items-center p-8 text-center"
              >
                <span className="text-5xl">{role.icon}</span>
                <h2 className="font-display mt-5 text-2xl tracking-wider text-white">
                  {role.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {role.description}
                </p>
                <span className="mt-6 inline-block rounded-full bg-green-500/10 px-5 py-2 text-sm font-medium text-green-400 transition-all group-hover:bg-green-500 group-hover:text-green-950">
                  Enter Portal
                </span>
              </Link>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
