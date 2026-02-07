"use client";

import { useState } from "react";
import { DashboardCard } from "~/app/_components/app/DashboardCard";
import { EmployeeTable, type Employee } from "~/app/_components/employer/EmployeeTable";
import { AddEmployeeModal } from "~/app/_components/employer/AddEmployeeModal";
import { PayrollAction } from "~/app/_components/employer/PayrollAction";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";

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

export default function EmployerPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentsThisMonth, setPaymentsThisMonth] = useState(3);

  const activeEmployees = employees.filter((e) => e.status === "active");
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0);

  const handleAddEmployee = (data: { name: string; walletAddress: string; salary: number }) => {
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
          ? { ...e, lastPaid: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
          : e
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider text-white">
          <DecryptedText text="EMPLOYER DASHBOARD" speed={30} delay={100} />
        </h1>
        <p className="mt-1 text-white/50">Manage payroll and employee commitments.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Total Employees"
          value={String(employees.length)}
          numericValue={employees.length}
          subtitle={`${activeEmployees.length} active`}
          icon="👥"
          delay={0}
        />
        <DashboardCard
          title="Monthly Payroll"
          value={`$${(totalPayroll / 12).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          numericValue={Math.round(totalPayroll / 12)}
          prefix="$"
          subtitle="Active employees"
          icon="💰"
          delay={0.1}
        />
        <DashboardCard
          title="Payments This Month"
          value={String(paymentsThisMonth)}
          numericValue={paymentsThisMonth}
          subtitle="ZK commitments"
          icon="📊"
          delay={0.2}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-green-500 px-6 py-2.5 text-sm font-semibold text-green-950 transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25"
        >
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeTable employees={employees} onRemove={handleRemoveEmployee} />
        </div>
        <div>
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
      />
    </div>
  );
}
