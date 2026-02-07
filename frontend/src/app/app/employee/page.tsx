"use client";

import { useState } from "react";
import { DashboardCard } from "~/app/_components/app/DashboardCard";
import { PaymentHistory, type Payment } from "~/app/_components/employee/PaymentHistory";
import { ProofGenerator } from "~/app/_components/employee/ProofGenerator";
import { CredentialCard } from "~/app/_components/employee/CredentialCard";
import { DecryptedText } from "~/app/_components/ui/DecryptedText";

const mockPayments: Payment[] = [
  {
    id: "1",
    date: "Jan 31, 2025",
    amount: 6250.0,
    status: "success",
    txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  },
  {
    id: "2",
    date: "Dec 31, 2024",
    amount: 6250.0,
    status: "success",
    txHash: "0xf1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2",
  },
  {
    id: "3",
    date: "Nov 30, 2024",
    amount: 6250.0,
    status: "success",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "4",
    date: "Oct 31, 2024",
    amount: 6250.0,
    status: "success",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "5",
    date: "Sep 30, 2024",
    amount: 6250.0,
    status: "success",
    txHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
  },
];

interface Credential {
  threshold: number;
  proofData: string;
  generatedAt: string;
}

export default function EmployeePage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const totalEarned = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleProofGenerated = (proof: { threshold: number; proofData: string }) => {
    setCredentials((prev) => [
      {
        ...proof,
        generatedAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider text-white">
          <DecryptedText text="EMPLOYEE PORTAL" speed={30} delay={100} />
        </h1>
        <p className="mt-1 text-white/50">View payments and generate income credentials.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Total Earned"
          value={`$${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          numericValue={totalEarned}
          prefix="$"
          decimals={2}
          subtitle="All time"
          icon="💰"
          delay={0}
        />
        <DashboardCard
          title="Payments Received"
          value={String(mockPayments.length)}
          numericValue={mockPayments.length}
          subtitle="On-chain verified"
          icon="📋"
          delay={0.1}
        />
        <DashboardCard
          title="Credentials Generated"
          value={String(credentials.length)}
          numericValue={credentials.length}
          subtitle="ZK proofs"
          icon="🔐"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentHistory payments={mockPayments} />
        </div>
        <div>
          <ProofGenerator onProofGenerated={handleProofGenerated} />
        </div>
      </div>

      {credentials.length > 0 && (
        <div>
          <h2 className="font-display mb-4 text-xl tracking-wider text-white">
            YOUR CREDENTIALS
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((cred, i) => (
              <CredentialCard
                key={`${cred.threshold}-${i}`}
                threshold={cred.threshold}
                proofData={cred.proofData}
                generatedAt={cred.generatedAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
