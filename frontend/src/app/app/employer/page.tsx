"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import {
  EmployeeTable,
  type Employee,
} from "~/app/brutalist/_components/employer/EmployeeTable";
import { AddEmployeeModal } from "~/app/brutalist/_components/employer/AddEmployeeModal";
import { PayrollAction } from "~/app/brutalist/_components/employer/PayrollAction";
import {
  useGetEmployees,
  useRegisterEmployee,
  useRemoveEmployee,
} from "~/lib/hooks/usePayrollRegistry";
import { useUSDTBalance } from "~/lib/hooks/usePaymentExecutor";
import { CONTRACTS, PayrollRegistryABI } from "~/lib/contracts";

interface EmployeeData {
  name: string;
  salary: number;
}

export default function EmployerPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeNames, setEmployeeNames] = useState<
    Record<string, EmployeeData>
  >(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("veilpay_employees");
      return stored ? (JSON.parse(stored) as Record<string, EmployeeData>) : {};
    } catch {
      return {};
    }
  });
  const [paymentCount, setPaymentCount] = useState(0);
  const [balanceError, setBalanceError] = useState<string | undefined>();

  const { data: usdtBalance } = useUSDTBalance(address);

  // Persist employee data to localStorage
  useEffect(() => {
    localStorage.setItem("veilpay_employees", JSON.stringify(employeeNames));
  }, [employeeNames]);

  const { data: onChainEmployees, refetch: refetchEmployees } =
    useGetEmployees(address);

  const {
    registerEmployee,
    isPending: isRegistering,
    isConfirming: isRegConfirming,
    isSuccess: isRegSuccess,
    error: regError,
  } = useRegisterEmployee();

  const { removeEmployee: removeEmployeeOnChain, isSuccess: isRemoveSuccess } = useRemoveEmployee();

  // Close modal on successful employee registration
  useEffect(() => {
    if (isRegSuccess) {
      setIsModalOpen(false);
    }
  }, [isRegSuccess]);

  // Auto-refetch employee list when register/remove tx confirms
  useEffect(() => {
    if (isRegSuccess || isRemoveSuccess) {
      void refetchEmployees();
    }
  }, [isRegSuccess, isRemoveSuccess, refetchEmployees]);

  // Build employee list from on-chain addresses + local name/salary store
  const employees: Employee[] = (onChainEmployees ?? []).map((addr, i) => {
    const lower = addr.toLowerCase();
    const data = employeeNames[lower];
    return {
      id: String(i),
      name: data?.name ?? `Employee ${i + 1}`,
      walletAddress: addr,
      salary: data?.salary ?? 0,
      status: "active" as const,
    };
  });

  const activeEmployees = employees.filter((e) => e.status === "active");
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);

  // Fetch payment count from on-chain commitments for each employee
  const fetchPaymentCount = useCallback(async () => {
    if (!publicClient || !address || !onChainEmployees?.length) {
      setPaymentCount(0);
      return;
    }

    try {
      let total = 0;
      for (const empAddr of onChainEmployees) {
        const result = await publicClient.readContract({
          address: CONTRACTS.PayrollRegistry as `0x${string}`,
          abi: PayrollRegistryABI,
          functionName: "getEmployeeCommitments",
          args: [empAddr],
        });
        const commitmentList = result as Array<{
          commitment: string;
          timestamp: bigint;
          employer: string;
        }>;
        // Count commitments where employer matches current user
        total += commitmentList.filter(
          (c) => c.employer.toLowerCase() === address.toLowerCase(),
        ).length;
      }
      setPaymentCount(total);
    } catch (err) {
      console.warn("Failed to fetch payment count:", err);
    }
  }, [publicClient, address, onChainEmployees]);

  useEffect(() => {
    void fetchPaymentCount();
  }, [fetchPaymentCount]);

  const handleAddEmployee = useCallback(
    (data: { name: string; walletAddress: string; salary: number }) => {
      // Check if adding this employee would exceed USDT balance
      if (usdtBalance != null) {
        const balance = Number(formatUnits(usdtBalance as bigint, 6));
        const newMonthlyTotal = (totalPayroll + data.salary) / 12;
        if (newMonthlyTotal > balance) {
          setBalanceError(
            `Insufficient USDT balance. Monthly payroll would be $${newMonthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} but your balance is only $${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`
          );
          return;
        }
      }
      setBalanceError(undefined);
      const addr = data.walletAddress.toLowerCase();
      setEmployeeNames((prev) => ({
        ...prev,
        [addr]: { name: data.name, salary: data.salary },
      }));
      registerEmployee(data.walletAddress as `0x${string}`);
    },
    [registerEmployee, usdtBalance, totalPayroll],
  );

  const handleRemoveEmployee = useCallback(
    (id: string) => {
      const emp = employees.find((e) => e.id === id);
      if (!emp) return;
      removeEmployeeOnChain(emp.walletAddress as `0x${string}`);
    },
    [employees, removeEmployeeOnChain],
  );

  const handleProcessPayroll = useCallback(() => {
    void refetchEmployees();
    // Re-fetch payment count from on-chain after payroll completes
    setTimeout(() => void fetchPaymentCount(), 2000);
  }, [refetchEmployees, fetchPaymentCount]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="neo-card max-w-md text-center">
          <h2 className="text-2xl font-black uppercase tracking-wider">
            CONNECT WALLET
          </h2>
          <p className="mt-2 text-sm text-black/50">
            Connect your wallet to manage payroll and employees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            EMPLOYER DASHBOARD
          </h1>
          <p className="mt-1 text-black/50">
            Manage payroll and employee commitments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="neo-button w-full cursor-pointer text-xs sm:w-auto"
        >
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="USDT Balance"
          value={usdtBalance != null ? `$${Number(formatUnits(usdtBalance as bigint, 6)).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "--"}
          subtitle="Available funds"
          icon="$$$"
          delay={0}
        />
        <DashboardCard
          title="Total Employees"
          value={String(employees.length)}
          subtitle={`${activeEmployees.length} active`}
          icon="USR"
          delay={0.1}
        />
        <DashboardCard
          title="Monthly Payroll"
          value={`$${(totalPayroll / 12).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          subtitle="Active employees"
          icon="$$$"
          delay={0.2}
        />
        <DashboardCard
          title="Payments This Month"
          value={String(paymentCount)}
          subtitle="ZK commitments"
          icon="TXN"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeTable
            employees={employees}
            onRemove={handleRemoveEmployee}
          />
        </div>
        <div className="lg:col-span-1">
          <PayrollAction
            employeeCount={activeEmployees.length}
            totalPayroll={totalPayroll}
            onProcess={handleProcessPayroll}
            employees={activeEmployees}
            employerAddress={address}
          />
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setBalanceError(undefined); }}
        onAdd={handleAddEmployee}
        isPending={isRegistering || isRegConfirming}
        error={balanceError ?? regError?.message}
      />
    </div>
  );
}
