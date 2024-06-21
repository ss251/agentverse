import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { Chain } from "viem";

export const projectId = `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "nero",
  description: "Web3Modal Example",
  url: "https://agentverse.vercel.app/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

let mainnet: Chain = {
  id: 696969,
  name: "Galadriel",
  nativeCurrency: {
    name: "Galadriel",
    symbol: "GAL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.galadriel.com/"],
      webSocket: [],
    },
  },
  blockExplorers: {
    default: {
      name: "Galadriel Explorer",
      url: "https://explorer.galadriel.com",
    },
  },
};

export const walletConfig = defaultWagmiConfig({
  chains: [mainnet],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
