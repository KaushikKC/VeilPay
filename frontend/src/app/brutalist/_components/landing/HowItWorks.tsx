"use client";

import { motion } from "framer-motion";

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
      'Employee generates a zero-knowledge proof: "My income exceeds $50k/year" — without revealing the exact salary or employer.',
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
    <section id="how-it-works" className="border-b-4 border-black px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-black uppercase tracking-tighter sm:text-6xl">
            HOW IT WORKS
          </h2>
          <p className="mt-4 text-lg text-black/50">
            Three steps from private payroll to verifiable credentials.
          </p>
        </motion.div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex border-4 border-black"
              style={{ marginTop: i > 0 ? "-4px" : 0 }}
            >
              {/* Number badge */}
              <div className="flex w-24 shrink-0 items-center justify-center border-r-4 border-black bg-black text-white">
                <span
                  className="text-3xl font-black"
                  style={{
                    fontFamily: "var(--font-neo-mono), monospace",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-black/60">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
