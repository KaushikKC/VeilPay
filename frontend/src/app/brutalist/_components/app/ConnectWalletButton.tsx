"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useRouter } from "next/navigation";
import { plasmaTestnet } from "~/lib/wagmi";
import { AccountSwitcher } from "./AccountSwitcher";

export function ConnectWalletButton() {
  const router = useRouter();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, status, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [userRejected, setUserRejected] = useState(false);
  const [noWallet, setNoWallet] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const handleLogout = () => {
    disconnect();
    // Clear user role on logout
    localStorage.removeItem("veilpay_user_role");
    router.push("/");
  };

  const isWrongNetwork = isConnected && chain?.id !== plasmaTestnet.id;
  const isConnecting = status === "pending";

  const hasWalletExtension =
    typeof window !== "undefined" &&
    typeof (window as unknown as { ethereum?: unknown }).ethereum !== "undefined";
  // Auto-switch to Plasma if connected to wrong network
  useEffect(() => {
    if (isWrongNetwork && !isSwitchingNetwork) {
      setIsSwitchingNetwork(true);
      switchChain(
        { chainId: plasmaTestnet.id },
        {
          onSuccess: () => {
            setIsSwitchingNetwork(false);
          },
          onError: () => {
            setIsSwitchingNetwork(false);
          },
        }
      );
    }
  }, [isWrongNetwork, switchChain, isSwitchingNetwork]);

  useEffect(() => {
    if (error) {
      const msg = error.message.toLowerCase();
      const isRejection =
        msg.includes("user rejected") ||
        msg.includes("user denied") ||
        error.name === "UserRejectedRequestError";

      const isNoProvider =
        msg.includes("no provider") ||
        msg.includes("connector not found") ||
        msg.includes("provider not found") ||
        msg.includes("window.ethereum");

      if (isRejection) {
        setUserRejected(true);
        const timer = setTimeout(() => {
          setUserRejected(false);
          reset();
        }, 3000);
        return () => clearTimeout(timer);
      }

      if (isNoProvider) {
        setNoWallet(true);
      }
    }
  }, [error, reset]);

  if (!isConnected) {
    const handleConnect = () => {
      if (!hasWalletExtension) {
        setNoWallet(true);
        return;
      }
      setUserRejected(false);
      setNoWallet(false);
      connect({ connector: connectors[0]! });
    };

    return (
      <div className="relative flex items-center gap-2">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition-all active:translate-x-[2px] active:translate-y-[2px] ${
            isConnecting
              ? "cursor-wait bg-gray-300"
              : userRejected
                ? "bg-red-300 hover:bg-red-200"
                : noWallet
                  ? "bg-orange-300 hover:bg-orange-200"
                  : "bg-[#00d6bd] hover:bg-[#00c4ad]"
          }`}
        >
          {isConnecting
            ? "Connecting..."
            : userRejected
              ? "Rejected — Retry?"
              : noWallet
                ? "No Wallet Found"
                : "Connect Wallet"}
        </button>
        {noWallet && (
          <div className="absolute right-0 top-full z-50 mt-2 w-64 border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="mb-2 text-xs font-bold uppercase">
              No wallet detected
            </p>
            <p className="mb-2 text-xs text-black/70">
              Install a browser wallet extension to connect.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-black bg-orange-400 px-3 py-1.5 text-center text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-orange-300"
            >
              Get MetaMask
            </a>
            <button
              onClick={() => setNoWallet(false)}
              className="mt-2 w-full text-xs font-bold uppercase text-black/40 hover:text-black/70"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }

  // Auto-switching to Plasma - show loading state
  if (isWrongNetwork || isSwitchingNetwork) {
    return (
      <div className="flex items-center gap-2">
        <span className="border-4 border-black bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-black">
          Switching to Plasma...
        </span>
      </div>
    );
  }

  return <AccountSwitcher />;
}
