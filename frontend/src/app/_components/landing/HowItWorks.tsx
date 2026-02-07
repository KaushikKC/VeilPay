"use client";

import { motion } from "framer-motion";
import { LampEffect } from "~/app/_components/ui/LampEffect";
import { Timeline } from "~/app/_components/ui/Timeline";

const steps = [
  {
    number: "01",
    title: "EMPLOYER PAYS",
    description:
      "Company processes payroll on-chain. Salary amounts are committed as hashes — funds transfer privately with ZK commitments.",
  },
  {
    number: "02",
    title: "EMPLOYEE PROVES",
    description:
      "Employee generates a zero-knowledge proof: \"My income exceeds $50k/year\" — without revealing the exact salary or employer.",
  },
  {
    number: "03",
    title: "VERIFIER CONFIRMS",
    description:
      "Landlord, lender, or protocol verifies the proof on-chain. They learn the credential is valid — nothing more.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <LampEffect className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl tracking-wider text-white sm:text-6xl">
              HOW IT WORKS
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Three steps from private payroll to verifiable credentials.
            </p>
          </motion.div>
        </LampEffect>

        <Timeline items={steps} />
      </div>
    </section>
  );
}
