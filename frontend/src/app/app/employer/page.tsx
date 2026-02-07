"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
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

interface EmployeeData {
  name: string;
  salary: number;
}

export default function EmployerPage() {
  const { address, isConnected } = useAccount();
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
  } = useRegisterEmployee();

  const { removeEmployee: removeEmployeeOnChain } = useRemoveEmployee();

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

  const handleAddEmployee = useCallback(
    (data: { name: string; walletAddress: string; salary: number }) => {
      const addr = data.walletAddress.toLowerCase();
      setEmployeeNames((prev) => ({
        ...prev,
        [addr]: { name: data.name, salary: data.salary },
      }));
      registerEmployee(data.walletAddress as `0x${string}`);
      setTimeout(() => void refetchEmployees(), 3000);
    },
    [registerEmployee, refetchEmployees],
  );

  const handleRemoveEmployee = useCallback(
    (id: string) => {
      const emp = employees.find((e) => e.id === id);
      if (!emp) return;
      removeEmployeeOnChain(emp.walletAddress as `0x${string}`);
      setTimeout(() => void refetchEmployees(), 3000);
    },
    [employees, removeEmployeeOnChain, refetchEmployees],
  );

  const handleProcessPayroll = useCallback(() => {
    setPaymentCount((prev) => prev + 1);
    setTimeout(() => void refetchEmployees(), 3000);
  }, [refetchEmployees]);

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
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          EMPLOYER DASHBOARD
        </h1>
        <p className="mt-1 text-black/50">
          Manage payroll and employee commitments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Total Employees"
          value={String(employees.length)}
          subtitle={`${activeEmployees.length} active`}
          icon="USR"
          delay={0}
        />
        <DashboardCard
          title="Monthly Payroll"
          value={`$${(totalPayroll / 12).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          subtitle="Active employees"
          icon="$$$"
          delay={0.1}
        />
        <DashboardCard
          title="Payments This Month"
          value={String(paymentCount)}
          subtitle="ZK commitments"
          icon="TXN"
          delay={0.2}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="neo-button text-xs"
        >
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeTable
            employees={employees}
            onRemove={handleRemoveEmployee}
          />
        </div>
        <div>
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
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmployee}
        isPending={isRegistering || isRegConfirming}
      />
    </div>
  );
}
