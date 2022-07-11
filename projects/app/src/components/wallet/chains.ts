import {Chain, NativeCurrency} from "./types";


const ETH: NativeCurrency = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC: NativeCurrency = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const ASTR: NativeCurrency = {
  name: "astar",
  symbol: "astr",
  decimals: 18,
};

export const CHAINS: { [chainId: number]: Chain } = {
  1: {
    chainId: 1,
    chainName: "Mainnet",
    nativeCurrency: ETH,
    rpcUrls: [
      process.env.infuraKey ? `https://mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
      process.env.alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyKey}` : undefined,
      "https://cloudflare-eth.com",
    ].filter((url) => url !== undefined) as string[],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  4: {
    chainId: 4,
    chainName: "Rinkeby",
    nativeCurrency: ETH,
    rpcUrls: [process.env.infuraKey ? `https://rinkeby.infura.io/v3/${process.env.infuraKey}` : undefined].filter(
        (url) => url !== undefined
    ) as string[],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
  },
  137: {
    chainId: 137,
    chainName: "Polygon Mainnet",
    nativeCurrency: MATIC,
    rpcUrls: [
      process.env.infuraKey ? `https://polygon-mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
      "https://polygon-rpc.com",
    ].filter((url) => url !== undefined) as string[],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  592: {
    chainId: 592,
    chainName: "Astar Network",
    nativeCurrency: ASTR,
    rpcUrls: [
      "https://evm.astar.network",
    ],
    blockExplorerUrls: ["https://blockscout.com/astar"],
  },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
    (accumulator, chainId) => {
      const validURLs: string[] = CHAINS[Number(chainId)].rpcUrls;

      if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs;
      }

      return accumulator;
    },
    {}
);
