"use client";

import { motion } from "framer-motion";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className = "" }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-green-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 40, -60, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-green-500/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 40, -60, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-green-400/10 blur-[100px]"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
