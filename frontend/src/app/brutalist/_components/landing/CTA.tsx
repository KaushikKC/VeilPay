"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section className="border-b-4 border-black px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="neo-card relative overflow-hidden text-center"
        >
          {/* Danger stripe top accent */}
          <div className="danger-stripes absolute left-0 top-0 h-3 w-full" />

          <div className="px-4 pt-8 sm:px-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl md:text-6xl">
              PRIVATE PAYROLL
              <br />
              <span className="text-[#00d6bd]">VERIFIED CREDENTIALS</span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-black/50">
              Pay employees privately. Let them prove income without revealing
              salary. VeilPay brings zero-knowledge credentials to payroll.
            </p>

            <div className="mt-10">
              <Link href="/brutalist/app" className="neo-button">
                Launch App
              </Link>
            </div>
          </div>

          {/* Danger stripe bottom accent */}
          <div className="danger-stripes mt-8 h-3 w-full" />
        </motion.div>
      </div>
    </section>
  );
}
