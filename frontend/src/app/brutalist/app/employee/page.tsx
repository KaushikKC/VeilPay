"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import { PaymentHistory, type Payment } from "~/app/brutalist/_components/employee/PaymentHistory";
import { ProofGenerator } from "~/app/brutalist/_components/employee/ProofGenerator";
import { CredentialCard } from "~/app/brutalist/_components/employee/CredentialCard";
import { useGetEmployeeCommitments } from "~/lib/hooks/usePayrollRegistry";

interface Credential {
  threshold: number;
  proofData: string;
  generatedAt: string;
}

export default function BrutalistEmployeePage() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch employee commitments from blockchain
  const { data: commitments, isLoading } = useGetEmployeeCommitments(address as `0x${string}`);

  // Convert blockchain commitments to payment history
  useEffect(() => {
    if (commitments && Array.isArray(commitments)) {
      console.log("Employee commitments:", commitments);

      // Map commitments to payments
      const mappedPayments: Payment[] = commitments.map((commitment: any, index: number) => ({
        id: String(index + 1),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        amount: 0, // Amount is hidden in the commitment
        status: "success" as const,
        txHash: commitment.toString().slice(0, 66), // Use commitment hash as pseudo-txHash
        commitment: commitment.toString(),
      }));

      setPayments(mappedPayments);
    }
  }, [commitments]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="neo-card max-w-md text-center">
          <div className="mb-4 inline-block border-4 border-black bg-blue-100 px-4 py-2">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider">
            Loading...
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-black/60">
            Fetching your on-chain data.
          </p>
        </div>
      </div>
    );
  }

  const totalEarned = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          EMPLOYEE PORTAL
        </h1>
        <p className="mt-1 text-black/50">
          View payments and generate income credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Payment Commitments"
          value={String(payments.length)}
          subtitle="On-chain verified"
          icon="TXN"
          delay={0}
        />
        <DashboardCard
          title="Credentials Generated"
          value={String(credentials.length)}
          subtitle="ZK proofs"
          icon="ZKP"
          delay={0.1}
        />
        <DashboardCard
          title="Registration Status"
          value="ACTIVE"
          subtitle="Employer verified"
          icon="USR"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <ProofGenerator onProofGenerated={handleProofGenerated} />
          {credentials.map((cred, i) => (
            <CredentialCard
              key={`${cred.threshold}-${i}`}
              threshold={cred.threshold}
              proofData={cred.proofData}
              generatedAt={cred.generatedAt}
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </div>
  );
}
