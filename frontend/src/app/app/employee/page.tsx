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
import { CredentialCard } from "~/app/brutalist/_components/employee/CredentialCard";
import { CONTRACTS } from "~/lib/contracts";

interface Credential {
  threshold: number;
  proofData: string;
  generatedAt: string;
}

export default function EmployeePage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Reset credentials when wallet changes
  useEffect(() => {
    setCredentials([]);
  }, [address]);

  // Fetch payment events from on-chain logs
  useEffect(() => {
    if (!address || !publicClient) return;

    const fetchPayments = async () => {
      setFetchError(null);
      try {
        // Plasma RPC limits eth_getLogs to 10,000 blocks per query
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > 9999n ? currentBlock - 9999n : 1n;

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
          fromBlock,
          toBlock: "latest",
        });

        const parsed: Payment[] = logs.map((log, i) => {
          const amount = log.args.amount ?? 0n;
          const timestamp = log.args.timestamp ?? 0n;
          const date = new Date(Number(timestamp) * 1000);

          return {
            id: String(i),
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            amount: Number(formatUnits(amount, 6)),
            status: "success" as const,
            txHash: log.transactionHash ?? "0x",
          };
        });

        setPayments(parsed.reverse());
      } catch (err) {
        console.error("Failed to fetch payment logs:", err);
        setFetchError(
          err instanceof Error ? err.message : "Failed to fetch payments",
        );
        setPayments([]);
      }
    };

    void fetchPayments();
  }, [address, publicClient]);

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

      {fetchError && (
        <div className="border-4 border-yellow-500 bg-yellow-50 p-3 text-center text-xs font-bold text-yellow-700">
          Log query failed: {fetchError}
        </div>
      )}

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentHistory payments={payments} />
        </div>
        <div>
          <ProofGenerator
            onProofGenerated={handleProofGenerated}
            employeeAddress={address}
          />
        </div>
      </div>

      {credentials.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-black uppercase tracking-tighter">
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
