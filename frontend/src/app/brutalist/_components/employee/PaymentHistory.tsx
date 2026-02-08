"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "~/app/brutalist/_components/app/StatusBadge";

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "success" | "pending";
  txHash: string;
  commitment?: string; // Optional commitment hash
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
      className="neo-card p-0"
    >
      <div className="flex items-center justify-between border-b-4 border-black px-6 py-4">
        <h3 className="text-lg font-black uppercase tracking-wider">
          PAYMENT HISTORY
        </h3>
        <span
          className="text-sm font-bold text-black/40"
          style={{ fontFamily: "var(--font-neo-mono), monospace" }}
        >
          {payments.length} payments
        </span>
      </div>

      <div className="divide-y-2 divide-black/10">
        {payments.map((payment, i) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-[#00d6bd]/10 text-lg">
                $
              </div>
              <div>
                <p className="text-sm font-bold">{payment.date}</p>
                <p
                  className="text-xs text-black/40"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  {payment.commitment ? (
                    <>commitment: {payment.commitment.slice(0, 10)}...{payment.commitment.slice(-6)}</>
                  ) : (
                    <>tx: {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-6)}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={payment.status} />
              <span
                className="text-sm font-bold text-[#00d6bd]"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {payment.commitment ? (
                  <span className="text-black/40">PRIVATE</span>
                ) : (
                  `+$${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-black/30">
          No payments received yet.
        </div>
      )}
    </motion.div>
  );
}
