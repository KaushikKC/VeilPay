"use client";

import { motion } from "framer-motion";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/10 px-8 py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-display text-lg tracking-wider text-white/60">
          <DecryptedText text="VEILPAY" speed={50} />
        </span>
        <p className="text-sm text-white/30">
          &copy; {new Date().getFullYear()} VeilPay. Privacy is a right, not a
          feature.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-white/40 transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-sm text-white/40 transition-colors hover:text-white"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-sm text-white/40 transition-colors hover:text-white"
          >
            Twitter
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
