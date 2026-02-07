"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "~/app/brutalist/_components/app/StatusBadge";

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
      className="neo-card p-0"
    >
      <div className="flex items-center justify-between border-b-4 border-black px-6 py-4">
        <h3 className="text-lg font-black uppercase tracking-wider">
          EMPLOYEES
        </h3>
        <span
          className="text-sm font-bold text-black/40"
          style={{ fontFamily: "var(--font-neo-mono), monospace" }}
        >
          {employees.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-4 border-black text-left text-xs font-black uppercase tracking-wider text-black/40">
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
                className="border-b-2 border-black/10 transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-bold">{emp.name}</td>
                <td
                  className="px-6 py-4 text-sm text-black/60"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  {emp.walletAddress.slice(0, 6)}...
                  {emp.walletAddress.slice(-4)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="border-2 border-black bg-gray-100 px-2 py-0.5 text-xs font-bold"
                    style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                  >
                    ******
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="px-6 py-4 text-sm text-black/40">
                  {emp.lastPaid ?? "Never"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onRemove(emp.id)}
                    className="text-xs font-bold uppercase text-red-500/60 transition-colors hover:text-red-600"
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
        <div className="px-6 py-12 text-center text-sm text-black/30">
          No employees added yet. Click &ldquo;Add Employee&rdquo; to get
          started.
        </div>
      )}
    </motion.div>
  );
}
