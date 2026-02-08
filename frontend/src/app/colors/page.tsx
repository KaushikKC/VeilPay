"use client";

import { useState } from "react";

const schemes = [
  {
    name: "Cyan / Electric Teal",
    primary: "#06D6A0",
    primaryLight: "#0AFFCE",
    bg: "#0A0F1A",
    bgCard: "rgba(6, 214, 160, 0.05)",
    bgCardHover: "rgba(6, 214, 160, 0.12)",
    border: "rgba(6, 214, 160, 0.2)",
    borderHover: "rgba(6, 214, 160, 0.4)",
    glow: "rgba(6, 214, 160, 0.15)",
    tag: "Fintech / Web3",
  },
  {
    name: "Lime / Acid Green",
    primary: "#BEFF00",
    primaryLight: "#D4FF4F",
    bg: "#0C0C0C",
    bgCard: "rgba(190, 255, 0, 0.04)",
    bgCardHover: "rgba(190, 255, 0, 0.10)",
    border: "rgba(190, 255, 0, 0.15)",
    borderHover: "rgba(190, 255, 0, 0.35)",
    glow: "rgba(190, 255, 0, 0.12)",
    tag: "Bold / Hacker",
  },
  {
    name: "Blue-Violet / Indigo",
    primary: "#6366F1",
    primaryLight: "#818CF8",
    bg: "#09090B",
    bgCard: "rgba(99, 102, 241, 0.05)",
    bgCardHover: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.2)",
    borderHover: "rgba(99, 102, 241, 0.4)",
    glow: "rgba(99, 102, 241, 0.15)",
    tag: "Clean SaaS",
  },
  {
    name: "Warm Amber / Gold",
    primary: "#F59E0B",
    primaryLight: "#FBBF24",
    bg: "#0F0D09",
    bgCard: "rgba(245, 158, 11, 0.05)",
    bgCardHover: "rgba(245, 158, 11, 0.10)",
    border: "rgba(245, 158, 11, 0.2)",
    borderHover: "rgba(245, 158, 11, 0.4)",
    glow: "rgba(245, 158, 11, 0.15)",
    tag: "Premium / Finance",
  },
  {
    name: "Rose / Coral",
    primary: "#FB7185",
    primaryLight: "#FDA4AF",
    bg: "#0C0A0B",
    bgCard: "rgba(251, 113, 133, 0.05)",
    bgCardHover: "rgba(251, 113, 133, 0.10)",
    border: "rgba(251, 113, 133, 0.2)",
    borderHover: "rgba(251, 113, 133, 0.4)",
    glow: "rgba(251, 113, 133, 0.15)",
    tag: "Modern / Distinctive",
  },
];

function SchemePreview({
  scheme,
  isExpanded: _isExpanded,
  onToggle,
}: {
  scheme: (typeof schemes)[number];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{ backgroundColor: scheme.bg }}
      className="overflow-hidden rounded-2xl border transition-all duration-300"
      onClick={onToggle}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${scheme.border}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: scheme.primary }}
          />
          <span className="font-display text-lg tracking-wider text-white">
            {scheme.name}
          </span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: scheme.bgCard,
            border: `1px solid ${scheme.border}`,
            color: scheme.primary,
          }}
        >
          {scheme.tag}
        </span>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        {/* Nav preview */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            backgroundColor: scheme.bgCard,
            border: `1px solid ${scheme.border}`,
          }}
        >
          <span className="font-display text-sm tracking-wider text-white">
            VEILPAY
          </span>
          <div className="flex items-center gap-3">
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Features
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              How It Works
            </span>
            <span
              className="rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: scheme.primary, color: scheme.bg }}
            >
              Launch App
            </span>
          </div>
        </div>

        {/* Hero text preview */}
        <div className="mt-6 text-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs"
            style={{
              backgroundColor: scheme.bgCard,
              border: `1px solid ${scheme.border}`,
              color: scheme.primary,
            }}
          >
            ZK-Credentials &bull; Private Payroll
          </span>
          <h2 className="font-display mt-4 text-3xl tracking-wider text-white">
            PRIVATE <span style={{ color: scheme.primary }}>PAYROLL</span>
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Pay employees privately on-chain. Prove income with ZK proofs.
          </p>
        </div>

        {/* Cards row */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Employees", value: "12", icon: "👥" },
            { label: "Monthly", value: "$48k", icon: "💰" },
            { label: "Proofs", value: "7", icon: "🔐" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-3"
              style={{
                backgroundColor: scheme.bgCard,
                border: `1px solid ${scheme.border}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {card.label}
                  </p>
                  <p className="font-display mt-1 text-xl tracking-wider text-white">
                    {card.value}
                  </p>
                </div>
                <span className="text-lg">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table preview */}
        <div
          className="mt-4 overflow-hidden rounded-xl"
          style={{ border: `1px solid ${scheme.border}` }}
        >
          <div
            className="px-4 py-2"
            style={{ borderBottom: `1px solid ${scheme.border}` }}
          >
            <span className="font-display text-xs tracking-wider text-white">
              EMPLOYEES
            </span>
          </div>
          {["Alice Johnson", "Bob Martinez", "Carol Chen"].map((name, i) => (
            <div
              key={name}
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom:
                  i < 2 ? `1px solid rgba(255,255,255,0.05)` : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white">{name}</span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  0x1a2b...ef12
                </span>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: scheme.bgCard,
                  border: `1px solid ${scheme.border}`,
                  color: scheme.primary,
                }}
              >
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: scheme.primary }}
                />
                Active
              </span>
            </div>
          ))}
        </div>

        {/* Buttons row */}
        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all"
            style={{ backgroundColor: scheme.primary, color: scheme.bg }}
          >
            Process Payroll
          </button>
          <button
            className="flex-1 rounded-xl py-2.5 text-xs font-medium text-white transition-all"
            style={{
              border: `1px solid ${scheme.border}`,
              backgroundColor: "transparent",
            }}
          >
            Generate Proof
          </button>
        </div>

        {/* Credential card preview */}
        <div
          className="relative mt-4 overflow-hidden rounded-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${scheme.bgCardHover}, ${scheme.bg})`,
            border: `1px solid ${scheme.borderHover}`,
          }}
        >
          <div
            className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full blur-[40px]"
            style={{ backgroundColor: scheme.glow }}
          />
          <div className="flex items-start justify-between">
            <div>
              <span
                className="text-[10px] tracking-wider uppercase"
                style={{ color: `${scheme.primary}99` }}
              >
                ZK Credential
              </span>
              <p className="font-display mt-0.5 text-sm tracking-wider text-white">
                INCOME PROOF
              </p>
            </div>
            <span className="text-lg">🔐</span>
          </div>
          <div
            className="mt-3 rounded-lg p-2"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <p
              className="text-[10px]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Statement
            </p>
            <p className="text-xs font-medium text-white">
              Annual income exceeds $50,000
            </p>
          </div>
          <div className="mt-2 flex gap-2">
            <span
              className="rounded-lg px-2 py-1 text-[10px] font-medium"
              style={{ backgroundColor: scheme.bgCard, color: scheme.primary }}
            >
              Groth16
            </span>
            <span
              className="rounded-lg px-2 py-1 text-[10px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              BN128
            </span>
          </div>
        </div>

        {/* Verification result preview */}
        <div
          className="mt-4 rounded-xl p-4 text-center"
          style={{
            backgroundColor: scheme.bgCard,
            border: `1px solid ${scheme.border}`,
          }}
        >
          <span className="text-2xl">✅</span>
          <p
            className="font-display mt-1 text-sm tracking-wider"
            style={{ color: scheme.primary }}
          >
            VERIFIED
          </p>
          <p
            className="mt-1 text-[10px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Applicant earns &gt; $50,000/year
          </p>
        </div>

        {/* Color swatches */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: scheme.primary }}
            title="Primary"
          />
          <div
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: scheme.primaryLight }}
            title="Primary Light"
          />
          <div
            className="h-6 w-6 rounded-full"
            style={{
              backgroundColor: scheme.bg,
              border: `1px solid ${scheme.border}`,
            }}
            title="Background"
          />
          <div
            className="ml-auto flex gap-2 font-mono text-[10px]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <span>{scheme.primary}</span>
            <span>{scheme.primaryLight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ColorsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-center text-4xl tracking-wider text-white">
          COLOR SCHEME COMPARISON
        </h1>
        <p className="mt-3 text-center text-white/50">
          Click any scheme to focus. Each preview shows the full VeilPay UI
          palette.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {schemes.map((scheme, i) => (
            <SchemePreview
              key={scheme.name}
              scheme={scheme}
              isExpanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
