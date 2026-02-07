"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "~/app/_components/app/StatusBadge";
import { AnimatedList } from "~/app/_components/ui/AnimatedList";

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "success" | "pending";
  txHash: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h3 className="font-display text-lg tracking-wider text-white">PAYMENT HISTORY</h3>
        <span className="text-sm text-white/40">{payments.length} payments</span>
      </div>

      <AnimatedList staggerDelay={0.08} className="divide-y divide-white/5">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{payment.date}</p>
                <p className="font-mono text-xs text-white/40">
                  tx: {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-6)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={payment.status} />
              <span className="font-mono text-sm text-green-400">
                +${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </AnimatedList>

      {payments.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-white/30">
          No payments received yet.
        </div>
      )}
    </motion.div>
  );
}
