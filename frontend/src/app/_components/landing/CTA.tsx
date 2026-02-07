"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "~/app/_components/ui/AuroraBackground";
import { GradientText } from "~/app/_components/ui/GradientText";
import { MovingBorder } from "~/app/_components/ui/MovingBorder";
import { Sparkles } from "~/app/_components/ui/Sparkles";

export function CTA() {
  return (
    <section id="cta" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-green-500/20"
        >
          <AuroraBackground className="p-12 text-center sm:p-16">
            <Sparkles count={8} className="w-full">
              <h2 className="font-display relative z-10 text-4xl tracking-wider text-white sm:text-5xl md:text-6xl">
                PRIVATE PAYROLL
                <br />
                <GradientText>VERIFIED CREDENTIALS</GradientText>
              </h2>
            </Sparkles>

            <p className="relative z-10 mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/50">
              Pay employees privately. Let them prove income without revealing salary.
              VeilPay brings zero-knowledge credentials to payroll.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative z-10 mt-10"
            >
              <MovingBorder
                as="a"
                href="/app"
                className="px-10 py-4 text-lg font-semibold text-green-400"
              >
                Launch App
              </MovingBorder>
            </motion.div>
          </AuroraBackground>
        </motion.div>
      </div>
    </section>
  );
}
