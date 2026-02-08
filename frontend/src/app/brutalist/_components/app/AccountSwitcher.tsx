"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import { ChevronDown, Copy, Check } from "lucide-react";
import { useUSDTBalance } from "~/lib/hooks/usePaymentExecutor";

export function AccountSwitcher() {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: usdtBalance } = useUSDTBalance(address);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedBalance = usdtBalance != null
    ? Number(formatUnits(usdtBalance as bigint, 6)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  const handleCopyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    // Clear user role on logout
    localStorage.removeItem("veilpay_user_role");
    router.push("/");
    setIsOpen(false);
  };

  if (!address) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-4 border-black bg-gray-100 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px]"
        style={{ fontFamily: "var(--font-neo-mono), monospace" }}
      >
        {formattedBalance != null && (
          <span className="text-[#00d6bd]">${formattedBalance}</span>
        )}
        <span className="hidden sm:inline">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <span className="inline sm:hidden">
          {address.slice(0, 4)}...{address.slice(-2)}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[280px] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black bg-gray-100 px-4 py-2">
              <p className="text-xs font-black uppercase tracking-wider text-black/60">
                Account Options
              </p>
            </div>

            {/* USDT Balance */}
            <div className="flex items-center justify-between border-b-4 border-black px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider">
                USDT Balance
              </p>
              <p
                className="text-sm font-bold text-[#00d6bd]"
                style={{ fontFamily: "var(--font-neo-mono), monospace" }}
              >
                {formattedBalance != null ? `$${formattedBalance}` : "--"}
              </p>
            </div>

            {/* Copy Address Button */}
            <button
              onClick={handleCopyAddress}
              className="flex w-full items-center justify-between border-b-4 border-black bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  Copy Address
                </p>
                <p
                  className="mt-0.5 text-xs text-black/60"
                  style={{ fontFamily: "var(--font-neo-mono), monospace" }}
                >
                  {address}
                </p>
              </div>
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-black/60" />
              )}
            </button>

            {/* Disconnect Button */}
            <div className="bg-gray-50 px-4 py-3">
              <button
                onClick={handleDisconnect}
                className="w-full border-2 border-red-500 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 transition-all hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px]"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
