"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: { name: string; walletAddress: string; salary: number }) => void;
  isPending?: boolean;
  error?: string;
}

export function AddEmployeeModal({ isOpen, onClose, onAdd, isPending, error }: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [salary, setSalary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !walletAddress || !salary) return;
    if (isPending) return; // Prevent double submission

    onAdd({
      name,
      walletAddress,
      salary: Number(salary),
    });

    // Clear form but don't close yet (will close on success via parent)
    setName("");
    setWalletAddress("");
    setSalary("");
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
            onClick={() => !isPending && onClose()}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="neo-card relative w-full max-w-md"
          >
            <h2 className="text-2xl font-black uppercase tracking-wider">
              ADD EMPLOYEE
            </h2>
            <p className="mt-2 text-sm text-black/50">
              Add a new employee to your payroll.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/60">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alice Johnson"
                  className="neo-input"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/60">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x1234...abcd"
                  className="neo-input"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/60">
                  Annual Salary (USD)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="75000"
                  className="neo-input"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                />
              </div>

              {error && (
                <div className="mt-4 border-2 border-red-400 bg-red-100 p-3 text-center">
                  <p className="text-sm font-bold text-red-700">
                    Registration Failed
                  </p>
                  <p className="mt-1 text-xs text-black/60">
                    {error.length > 150 ? error.slice(0, 150) + "..." : error}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="neo-button-secondary flex-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="neo-button flex-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Registering..." : "Add Employee"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
