import {Connector} from "@web3-react/types";

export enum ConnectorType {
  MetaMask,
  WalletConnect
}

export type IConnector = Connector

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: 18;
}
export interface Chain {
  chainId: number;
  chainName: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}
