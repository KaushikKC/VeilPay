"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import {
  PaymentHistory,
  type Payment,
} from "~/app/brutalist/_components/employee/PaymentHistory";
import { ProofGenerator } from "~/app/brutalist/_components/employee/ProofGenerator";
import { ShareProofModal } from "~/app/brutalist/_components/employee/ShareProofModal";
import { CONTRACTS } from "~/lib/contracts";
import { useGetEmployeeCommitments } from "~/lib/hooks/usePayrollRegistry";

interface Credential {
  threshold: number;
  proofData: string;
  generatedAt: string;
}

export default function EmployeePage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
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
  const [isLoading, setIsLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    threshold: number;
    proofUrl: string;
  }>({ isOpen: false, threshold: 0, proofUrl: "" });
  const [showProofHistory, setShowProofHistory] = useState(false);

  // Primary data source: on-chain commitments (no block range limit)
  const { data: commitments, isLoading: commitmentsLoading } =
    useGetEmployeeCommitments(address);

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

  // Build payment list from commitments + try to enrich with event amounts
  useEffect(() => {
    if (commitmentsLoading) return;

    const buildPayments = async () => {
      setIsLoading(true);

      // Map on-chain commitments to payments
      const commitmentList = (commitments as Array<{
        commitment: string;
        timestamp: bigint;
        employer: string;
      }>) ?? [];

      const basePayments: Payment[] = commitmentList.map((c, i) => {
        const timestamp = Number(c.timestamp ?? 0n);
        const date = timestamp > 0
          ? new Date(timestamp * 1000)
          : new Date();

        return {
          id: String(i),
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          amount: 0,
          status: "success" as const,
          txHash: "0x",
          commitment: c.commitment?.toString() ?? "",
        };
      });

      // Try to enrich with PaymentExecuted event data for amounts/txHashes
      if (publicClient && address && commitmentList.length > 0) {
        try {
          const currentBlock = await publicClient.getBlockNumber();
          // Scan in 9000-block chunks, up to ~50k blocks back
          const maxScan = 50000n;
          const startBlock = currentBlock > maxScan ? currentBlock - maxScan : 1n;
          const chunkSize = 9000n;

          const allLogs: Array<{
            args: { amount?: bigint; commitment?: string; timestamp?: bigint };
            transactionHash?: string;
          }> = [];

          for (let to = currentBlock; to > startBlock; to -= chunkSize) {
            const from = to - chunkSize + 1n > startBlock ? to - chunkSize + 1n : startBlock;
            const logs = await publicClient.getLogs({
              address: CONTRACTS.PaymentExecutor as `0x${string}`,
              event: {
                type: "event",
                name: "PaymentExecuted",
                inputs: [
                  { name: "employer", type: "address", indexed: true },
                  { name: "employee", type: "address", indexed: true },
                  { name: "amount", type: "uint256", indexed: false },
                  { name: "commitment", type: "bytes32", indexed: false },
                  { name: "timestamp", type: "uint256", indexed: false },
                ],
              },
              args: { employee: address },
              fromBlock: from,
              toBlock: to,
            });
            allLogs.push(...logs);
            if (from <= startBlock) break;
          }

          // Build a lookup by commitment hash
          const eventsByCommitment = new Map<string, {
            amount: bigint;
            txHash: string;
            timestamp: bigint;
          }>();
          for (const log of allLogs) {
            const commitHash = log.args.commitment?.toString() ?? "";
            if (commitHash) {
              eventsByCommitment.set(commitHash, {
                amount: log.args.amount ?? 0n,
                txHash: log.transactionHash ?? "0x",
                timestamp: log.args.timestamp ?? 0n,
              });
            }
          }

          // Enrich base payments with event data
          for (const payment of basePayments) {
            const eventData = eventsByCommitment.get(payment.commitment ?? "");
            if (eventData) {
              payment.amount = Number(formatUnits(eventData.amount, 6));
              payment.txHash = eventData.txHash;
              // Use event timestamp if commitment timestamp was 0
              if (payment.date === new Date(0).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })) {
                const ts = Number(eventData.timestamp);
                if (ts > 0) {
                  payment.date = new Date(ts * 1000).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }
              }
            }
          }
        } catch (err) {
          // Event enrichment failed - payments will show as PRIVATE
          console.warn("Event enrichment failed:", err);
        }
      }

      setPayments(basePayments.reverse());
      setIsLoading(false);
    };

    void buildPayments();
  }, [commitments, commitmentsLoading, address, publicClient]);

  const totalEarned = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleProofGenerated = (proof: {
    threshold: number;
    proofData: string;
  }) => {
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
    // Auto-open the share modal
    setShareModal({
      isOpen: true,
      threshold: proof.threshold,
      proofUrl: proof.proofData,
    });
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="neo-card max-w-md text-center">
          <h2 className="text-2xl font-black uppercase tracking-wider">
            CONNECT WALLET
          </h2>
          <p className="mt-2 text-sm text-black/50">
            Connect your wallet to view payments and generate proofs.
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
          title="Total Earned"
          value={`$${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtitle="All time"
          icon="$$$"
          delay={0}
        />
        <DashboardCard
          title="Payments Received"
          value={String(payments.length)}
          subtitle="On-chain verified"
          icon="TXN"
          delay={0.1}
        />
        <DashboardCard
          title="Credentials Generated"
          value={String(credentials.length)}
          subtitle="ZK proofs"
          icon="ZKP"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
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
        <div>
          <ProofGenerator
            onProofGenerated={handleProofGenerated}
            employeeAddress={address}
          />
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
