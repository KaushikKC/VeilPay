"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { plasmaTestnet } from "~/lib/wagmi";

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chain?.id !== plasmaTestnet.id;

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0]! })}
        className="border-4 border-black bg-[#00d6bd] px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-[#00c4ad] active:translate-x-[2px] active:translate-y-[2px]"
      >
        Connect Wallet
      </button>
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
