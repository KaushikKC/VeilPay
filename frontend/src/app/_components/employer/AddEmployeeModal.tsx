"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: { name: string; walletAddress: string; salary: number }) => void;
}

export function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [salary, setSalary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !walletAddress || !salary) return;

    onAdd({
      name,
      walletAddress,
      salary: Number(salary),
    });

    setName("");
    setWalletAddress("");
    setSalary("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-green-950 p-8"
          >
            <h2 className="font-display text-2xl tracking-wider text-white">ADD EMPLOYEE</h2>
            <p className="mt-2 text-sm text-white/50">
              Add a new employee to your payroll.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alice Johnson"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-white/60">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x1234...abcd"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-white/60">Annual Salary (USD)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="75000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-green-500/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-green-950 transition-all hover:bg-green-400"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
