"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import { PaymentHistory, type Payment } from "~/app/brutalist/_components/employee/PaymentHistory";
import { ProofGenerator } from "~/app/brutalist/_components/employee/ProofGenerator";
import { ShareProofModal } from "~/app/brutalist/_components/employee/ShareProofModal";
import { useGetEmployeeCommitments } from "~/lib/hooks/usePayrollRegistry";

interface Credential {
  threshold: number;
  proofData: string;
  generatedAt: string;
}

type CommitmentItem = {
  commitment: `0x${string}`;
  timestamp: bigint;
  employer: `0x${string}`;
};

export default function BrutalistEmployeePage() {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    if (typeof window === "undefined" || !address) return [];
    try {
      const stored = localStorage.getItem(`veilpay_proofs_${address.toLowerCase()}`);
      return stored ? (JSON.parse(stored) as Credential[]) : [];
    } catch {
      return [];
    }
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    threshold: number;
    proofUrl: string;
  }>({ isOpen: false, threshold: 0, proofUrl: "" });
  const [showProofHistory, setShowProofHistory] = useState(false);

  // Fetch employee commitments from blockchain
  const { data: commitments, isLoading } = useGetEmployeeCommitments(address);

  // Load credentials from localStorage when wallet changes
  useEffect(() => {
    if (!address) {
      setCredentials([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`veilpay_proofs_${address.toLowerCase()}`);
      setCredentials(stored ? (JSON.parse(stored) as Credential[]) : []);
    } catch {
      setCredentials([]);
    }
  }, [address]);

  // Persist credentials to localStorage whenever they change
  useEffect(() => {
    if (!address || credentials.length === 0) return;
    localStorage.setItem(
      `veilpay_proofs_${address.toLowerCase()}`,
      JSON.stringify(credentials),
    );
  }, [credentials, address]);

  // Convert blockchain commitments to payment history
  useEffect(() => {
    if (commitments && Array.isArray(commitments)) {
      console.log("Employee commitments:", commitments);

      const list = commitments as CommitmentItem[];
      const mappedPayments: Payment[] = list.map((item: CommitmentItem, index: number) => {
        const hash = typeof item.commitment === "string" ? item.commitment : String(item.commitment);
        return {
          id: String(index + 1),
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          amount: 0, // Amount is hidden in the commitment
          status: "success" as const,
          txHash: hash.slice(0, 66), // Use commitment hash as pseudo-txHash
          commitment: hash,
        };
      });

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
    setShareModal({
      isOpen: true,
      threshold: proof.threshold,
      proofUrl: proof.proofData,
    });
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div>
          <ProofGenerator onProofGenerated={handleProofGenerated} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <PaymentHistory payments={payments} />

          {credentials.length > 0 && (
            <div>
              <button
                onClick={() => setShowProofHistory(!showProofHistory)}
                className="neo-button-secondary w-full text-xs"
              >
                {showProofHistory
                  ? "HIDE PROOF HISTORY"
                  : `PROOF HISTORY (${credentials.length})`}
              </button>

              {showProofHistory && (
                <div className="mt-3 space-y-2">
                  {credentials.map((cred, i) => (
                    <div
                      key={`${cred.threshold}-${i}`}
                      className="flex items-center justify-between border-4 border-black/20 bg-white px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          Income &gt; ${cred.threshold.toLocaleString()}
                        </p>
                        <p
                          className="text-xs text-black/40"
                          style={{
                            fontFamily: "var(--font-neo-mono), monospace",
                          }}
                        >
                          {cred.generatedAt} &mdash; Groth16 / BN128
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setShareModal({
                            isOpen: true,
                            threshold: cred.threshold,
                            proofUrl: cred.proofData,
                          })
                        }
                        className="neo-button cursor-pointer text-xs"
                      >
                        Share
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ShareProofModal
        isOpen={shareModal.isOpen}
        onClose={() =>
          setShareModal((prev) => ({ ...prev, isOpen: false }))
        }
        threshold={shareModal.threshold}
        proofUrl={shareModal.proofUrl}
      />
    </div>
  );
}
