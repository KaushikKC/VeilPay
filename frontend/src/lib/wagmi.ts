import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const plasmaTestnet = defineChain({
  id: 9746,
  name: "Plasma Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.plasma.to"] },
  },
  blockExplorers: {
    default: {
      name: "Plasma Explorer",
      url: "https://testnet-explorer.plasma.to",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [plasmaTestnet],
  connectors: [injected()],
  transports: {
    [plasmaTestnet.id]: http(),
  },
  ssr: true,
});
