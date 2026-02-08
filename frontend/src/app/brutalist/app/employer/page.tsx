"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import { EmployeeTable, type Employee } from "~/app/brutalist/_components/employer/EmployeeTable";
import { AddEmployeeModal } from "~/app/brutalist/_components/employer/AddEmployeeModal";
import { PayrollAction } from "~/app/brutalist/_components/employer/PayrollAction";
import { useRegisterEmployee, useGetEmployees } from "~/lib/hooks/usePayrollRegistry";

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    walletAddress: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    salary: 95000,
    status: "active",
    lastPaid: "Jan 31, 2025",
  },
  {
    id: "2",
    name: "Bob Martinez",
    walletAddress: "0x9876543210fEdCbA0987654321FeDcBa09876543",
    salary: 72000,
    status: "active",
    lastPaid: "Jan 31, 2025",
  },
  {
    id: "3",
    name: "Carol Chen",
    walletAddress: "0xAbCdEf1234567890aBcDeF12345678901a2B3c4D",
    salary: 115000,
    status: "active",
    lastPaid: "Jan 31, 2025",
  },
  {
    id: "4",
    name: "David Park",
    walletAddress: "0xFeDcBa09876543210fEdCbA09876543219876543",
    salary: 68000,
    status: "inactive",
  },
];

export default function BrutalistEmployerPage() {
  const { address } = useAccount();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentsThisMonth, setPaymentsThisMonth] = useState(3);

  const { registerEmployee, isPending, isConfirming, isSuccess, error } = useRegisterEmployee();
  const { data: onChainEmployees } = useGetEmployees(address);

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
    }
  }, [isSuccess]);

  // Sync on-chain employees with local state
  useEffect(() => {
    if (onChainEmployees && Array.isArray(onChainEmployees)) {
      console.log("On-chain employees:", onChainEmployees);
      // TODO: Merge with local employees or fetch metadata
    }
  }, [onChainEmployees]);

  const activeEmployees = employees.filter((e) => e.status === "active");
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);

  const handleAddEmployee = (data: { name: string; walletAddress: string; salary: number }) => {
    // Register employee on-chain (async)
    registerEmployee(data.walletAddress as `0x${string}`);

    // Add to local state immediately for UI feedback
    const newEmployee: Employee = {
      id: String(Date.now()),
      name: data.name,
      walletAddress: data.walletAddress,
      salary: data.salary,
      status: "active",
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleProcessPayroll = () => {
    setPaymentsThisMonth((prev) => prev + 1);
    setEmployees((prev) =>
      prev.map((e) =>
        e.status === "active"
          ? {
              ...e,
              lastPaid: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : e
      )
    );
  };

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          value={String(paymentsThisMonth)}
          subtitle="ZK commitments"
          icon="TXN"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeTable employees={employees} onRemove={handleRemoveEmployee} />
        </div>
        <div className="lg:col-span-1">
          <PayrollAction
            employeeCount={activeEmployees.length}
            totalPayroll={totalPayroll}
            onProcess={handleProcessPayroll}
          />
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmployee}
        isPending={isPending || isConfirming}
        error={error?.message}
      />
    </div>
  );
}
