"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "~/app/_components/ui/SpotlightCard";
import { CountUp } from "~/app/_components/ui/CountUp";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  delay?: number;
  numericValue?: number;
  prefix?: string;
  decimals?: number;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  delay = 0,
  numericValue,
  prefix,
  decimals,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <SpotlightCard className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/50">{title}</p>
            <p className="font-display mt-2 text-3xl tracking-wider text-white">
              {numericValue !== undefined ? (
                <CountUp
                  target={numericValue}
                  prefix={prefix}
                  decimals={decimals ?? 0}
                />
              ) : (
                value
              )}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-green-400">{subtitle}</p>
            )}
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
