"use client";

import { motion } from "framer-motion";

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export function StarBorder({
  children,
  className = "",
  color = "#1bcc80",
  duration = 4,
}: StarBorderProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-px ${className}`}>
      {/* Orbiting dot 1 */}
      <motion.div
        className="absolute h-2 w-2 rounded-full blur-[1px]"
        style={{ backgroundColor: color, boxShadow: `0 0 8px 2px ${color}` }}
        animate={{
          top: ["0%", "0%", "100%", "100%", "0%"],
          left: ["0%", "100%", "100%", "0%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />
      {/* Orbiting dot 2 (offset) */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full blur-[1px]"
        style={{ backgroundColor: color, boxShadow: `0 0 6px 1px ${color}`, opacity: 0.6 }}
        animate={{
          top: ["100%", "100%", "0%", "0%", "100%"],
          left: ["100%", "0%", "0%", "100%", "100%"],
        }}
        transition={{
          duration: duration * 0.8,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* Border glow trail */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* Content */}
      <div className="relative rounded-2xl bg-green-950">{children}</div>
    </div>
  );
}
