"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "~/app/_components/app/StatusBadge";

export interface Employee {
  id: string;
  name: string;
  walletAddress: string;
  salary: number;
  status: "active" | "inactive";
  lastPaid?: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onRemove: (id: string) => void;
}

export function EmployeeTable({ employees, onRemove }: EmployeeTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h3 className="font-display text-lg tracking-wider text-white">EMPLOYEES</h3>
        <span className="text-sm text-white/40">{employees.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Wallet</th>
              <th className="px-6 py-3">Salary</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Paid</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                className="border-b border-white/5 transition-colors hover:bg-white/5"
              >
                <td className="px-6 py-4 text-sm font-medium text-white">{emp.name}</td>
                <td className="px-6 py-4 font-mono text-sm text-white/60">
                  {emp.walletAddress.slice(0, 6)}...{emp.walletAddress.slice(-4)}
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">
                    ******
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="px-6 py-4 text-sm text-white/40">{emp.lastPaid ?? "Never"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onRemove(emp.id)}
                    className="text-xs text-red-400/60 transition-colors hover:text-red-400"
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-white/30">
          No employees added yet. Click &ldquo;Add Employee&rdquo; to get started.
        </div>
      )}
    </motion.div>
  );
}
