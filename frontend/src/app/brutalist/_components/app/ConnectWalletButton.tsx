"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { plasmaTestnet } from "~/lib/wagmi";

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, status, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [userRejected, setUserRejected] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== plasmaTestnet.id;
  const isConnecting = status === "pending";

  useEffect(() => {
    if (error) {
      const isRejection =
        error.message.toLowerCase().includes("user rejected") ||
        error.message.toLowerCase().includes("user denied") ||
        error.name === "UserRejectedRequestError";

      if (isRejection) {
        setUserRejected(true);
        const timer = setTimeout(() => {
          setUserRejected(false);
          reset();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [error, reset]);

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setUserRejected(false);
            connect({ connector: connectors[0]! });
          }}
          disabled={isConnecting}
          className={`border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition-all active:translate-x-[2px] active:translate-y-[2px] ${
            isConnecting
              ? "cursor-wait bg-gray-300"
              : userRejected
                ? "bg-red-300 hover:bg-red-200"
                : "bg-[#00d6bd] hover:bg-[#00c4ad]"
          }`}
        >
          {isConnecting
            ? "Connecting..."
            : userRejected
              ? "Rejected — Retry?"
              : "Connect Wallet"}
        </button>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: plasmaTestnet.id })}
        className="border-4 border-black bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-yellow-300"
      >
        Switch to Plasma
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="border-4 border-black bg-gray-100 px-3 py-2 text-xs font-bold"
        style={{ fontFamily: "var(--font-neo-mono), monospace" }}
      >
        {address!.slice(0, 6)}...{address!.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="border-4 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-black/60 transition-all hover:bg-red-50 hover:text-red-500"
      >
        X
      </button>
    </div>
  );
}
