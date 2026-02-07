"use client";

import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  delay?: number;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="neo-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">
            {title}
          </p>
          <p
            className="mt-1 text-3xl font-black"
            style={{ fontFamily: "var(--font-neo-mono), monospace" }}
          >
            {value}
          </p>
          <p className="mt-1 text-sm text-black/50">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-gray-100 text-xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
