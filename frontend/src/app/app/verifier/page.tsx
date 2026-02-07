"use client";

import { useState } from "react";
import { DashboardCard } from "~/app/brutalist/_components/app/DashboardCard";
import { ProofUploader } from "~/app/brutalist/_components/verifier/ProofUploader";
import { VerificationResult } from "~/app/brutalist/_components/verifier/VerificationResult";

export default function VerifierPage() {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [threshold, setThreshold] = useState<number | undefined>();
  const [verificationsCount, setVerificationsCount] = useState(0);

  const handleVerify = (proofJson: string) => {
    setStatus("verifying");

    try {
      const parsed = JSON.parse(proofJson) as { publicSignals?: string[] };
      const t = Number(parsed.publicSignals?.[0]);
      setThreshold(isNaN(t) ? 50000 : t);
    } catch {
      setThreshold(50000);
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setStatus(success ? "success" : "failed");
    if (success) setVerificationsCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setStatus("idle");
    setThreshold(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          VERIFIER PORTAL
        </h1>
        <p className="mt-1 text-black/50">
          Verify income credentials without learning salary or employer details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Verifications"
          value={String(verificationsCount)}
          subtitle="This session"
          icon="VRF"
          delay={0}
        />
        <DashboardCard
          title="Protocol"
          value="Groth16"
          subtitle="BN128 curve"
          icon="ZKP"
          delay={0.1}
        />
        <DashboardCard
          title="Data Revealed"
          value="ZERO"
          subtitle="Salary & employer hidden"
          icon="////"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProofUploader onVerify={handleVerify} isVerifying={status === "verifying"} />
        {status !== "idle" && (
          <VerificationResult
            status={status}
            threshold={threshold}
            onReset={handleReset}
            onComplete={handleVerificationComplete}
          />
        )}
      </div>
    </div>
  );
}
