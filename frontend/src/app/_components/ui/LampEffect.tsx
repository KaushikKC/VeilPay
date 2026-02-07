"use client";

import { motion } from "framer-motion";

interface LampEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function LampEffect({ children, className = "" }: LampEffectProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Lamp beam */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ opacity: 0, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-8 h-24 rounded-full bg-green-500/20 blur-[60px]"
        />
        <motion.div
          initial={{ opacity: 0, width: "4rem" }}
          whileInView={{ opacity: 1, width: "12rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="absolute -top-4 h-12 rounded-full bg-green-400/30 blur-[40px]"
        />
        {/* Thin light line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-0 h-px w-48 bg-gradient-to-r from-transparent via-green-400/80 to-transparent"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
