"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "EMPLOYER PAYS",
    description:
      "Companies process their payroll on-chain. Salary amounts are then committed as hashes, and funds are transferred privately.",
  },
  {
    number: "02",
    title: "EMPLOYEE PROVES",
    description:
      'Employees can then generate a zero-knowledge proof: e.g., "My income exceeds $50k/year" - without revealing their exact salary, or their employer.',
  },
  {
    number: "03",
    title: "VERIFIER CONFIRMS",
    description:
      "Landlords, lenders, protocols or other third-parties can verify their proof on-chain. All they can assess is the validity of the credential - not their salary or who their employer is.",
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
            VeilPay takes three steps to ensure verifiable credentials can happen from a private payroll.
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
