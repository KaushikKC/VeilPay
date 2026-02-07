"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUnits } from "viem";
import { useWriteContract, usePublicClient } from "wagmi";
import { type Employee } from "./EmployeeTable";
import { CONTRACTS, ERC20ABI, PaymentExecutorABI } from "~/lib/contracts";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

interface PayrollActionProps {
  employeeCount: number;
  totalPayroll: number;
  onProcess: () => void;
  employees?: Employee[];
  employerAddress?: `0x${string}`;
}

const payrollSteps = [
  "Generating salary commitments...",
  "Creating Poseidon hashes...",
  "Approving USDT spend...",
  "Executing batch payment...",
  "Confirming on-chain...",
];

export function PayrollAction({
  employeeCount,
  totalPayroll,
  onProcess,
  employees = [],
  employerAddress,
}: PayrollActionProps) {
  const [state, setState] = useState<
    "idle" | "confirming" | "processing" | "success" | "error"
  >("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState<string | undefined>();

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const handleProcess = async () => {
    if (!employerAddress || employees.length === 0) return;

    setState("processing");
    setCurrentStep(0);
    setErrorMsg("");

    try {
      // Step 0 & 1: Generate commitments via backend
      const commitmentResults = [];
      for (const emp of employees) {
        const res = await fetch(`${BACKEND_URL}/api/commitments/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeAddress: emp.walletAddress,
            salary: emp.salary,
          }),
        });
        if (!res.ok) throw new Error(`Failed to create commitment for ${emp.walletAddress}`);
        commitmentResults.push(await res.json() as {
          commitment: string;
          nonce: string;
        });
      }
      setCurrentStep(1);

      // Prepare batch arrays
      const addresses = employees.map(
        (e) => e.walletAddress as `0x${string}`,
      );
      const amounts = employees.map((e) =>
        parseUnits(String(Math.round(e.salary / 12)), 6),
      );
      const commitments = commitmentResults.map(
        (c) => c.commitment as `0x${string}`,
      );
      const totalAmount = amounts.reduce((sum, a) => sum + a, 0n);

      setCurrentStep(2);

      // Step 2: Approve USDT and wait for confirmation
      const approveHash = await writeContractAsync({
        address: CONTRACTS.USDT as `0x${string}`,
        abi: ERC20ABI,
        functionName: "approve",
        args: [CONTRACTS.PaymentExecutor as `0x${string}`, totalAmount],
      });

      // Wait for approve tx to be mined before calling batchPay
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      setCurrentStep(3);

      // Step 3: Batch pay
      const payHash = await writeContractAsync({
        address: CONTRACTS.PaymentExecutor as `0x${string}`,
        abi: PaymentExecutorABI,
        functionName: "batchPayEmployees",
        args: [addresses, amounts, commitments],
      });

      setTxHash(payHash);
      setCurrentStep(4);

      // Wait a moment for confirmation visibility
      await new Promise((r) => setTimeout(r, 1500));

      onProcess();
      setState("success");
      setTimeout(() => setState("idle"), 4000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      setErrorMsg(message);
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="neo-card"
    >
      <h3 className="text-lg font-black uppercase tracking-wider">
        PROCESS PAYROLL
      </h3>
      <p className="mt-2 text-sm text-black/50">
        Pay {employeeCount} employees with ZK commitments.
      </p>

      <div className="mt-4 border-4 border-black bg-gray-50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-black/40">Employees</span>
          <span className="font-bold">{employeeCount}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-black/40">Total Monthly</span>
          <span
            className="font-bold text-[#00d6bd]"
            style={{ fontFamily: "var(--font-neo-mono), monospace" }}
          >
            $
            {(totalPayroll / 12).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-black/40">Network</span>
          <span className="text-black/60">Plasma (testnet)</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <button
              onClick={() => setState("confirming")}
              disabled={employeeCount === 0}
              className="neo-button w-full text-xs"
            >
              Process Payroll
            </button>
          </motion.div>
        )}

        {state === "confirming" && (
          <motion.div
            key="confirming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-3"
          >
            <div className="border-4 border-yellow-500 bg-yellow-50 p-3 text-center text-sm font-bold">
              Confirm payroll for {employeeCount} employees?
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setState("idle")}
                className="neo-button-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleProcess()}
                className="neo-button flex-1 text-xs"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-2"
          >
            {payrollSteps.map((step, i) => (
              <div
                key={step}
                className={
                  i < currentStep
                    ? "neo-step-done"
                    : i === currentStep
                      ? "neo-step-active"
                      : "neo-step-pending"
                }
                style={{
                  fontFamily: "var(--font-neo-mono), monospace",
                  fontSize: "0.75rem",
                }}
              >
                {i < currentStep ? "// " : i === currentStep ? "> " : "  "}
                {step}
              </div>
            ))}
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <div className="border-4 border-[#00d6bd] bg-[#00d6bd]/10 p-4 text-center">
              <span className="text-3xl">&#x2713;</span>
              <p className="mt-2 text-sm font-bold text-[#008a7a]">
                Payroll processed successfully!
              </p>
              <p className="text-xs text-black/40">
                {employeeCount} ZK commitments created on-chain
              </p>
              {txHash && (
                <p
                  className="mt-1 text-xs text-black/30"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  tx: {txHash.slice(0, 10)}...{txHash.slice(-6)}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <div className="border-4 border-red-400 bg-red-50 p-4 text-center">
              <span className="text-3xl text-red-500">X</span>
              <p className="mt-2 text-sm font-bold text-red-600">
                Payroll failed
              </p>
              <p className="mt-1 text-xs text-black/40">
                {errorMsg.length > 100
                  ? errorMsg.slice(0, 100) + "..."
                  : errorMsg}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
