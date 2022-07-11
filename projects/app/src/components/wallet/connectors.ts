import {initializeConnector, Web3ReactHooks} from "@web3-react/core";
import {MetaMask} from "@web3-react/metamask";
import {WalletConnect} from "@web3-react/walletconnect";
import {Connector} from "@web3-react/types";
import {ConnectorType, IConnector} from "./types";
import {URLS} from "./chains";

const createMetaMaskConnector = (allowedChainIds?: number[]): [Connector, Web3ReactHooks] => {
  const [conn, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask(actions), allowedChainIds);
  return [conn, hooks];
};

const createWalletConnectConnector = (allowedChainIds?: number[]): [Connector, Web3ReactHooks] => {
  const [conn, hooks] = initializeConnector<WalletConnect>((actions) => new WalletConnect(actions, {rpc: URLS}), allowedChainIds);
  return [conn, hooks];
};


export class Connectors {
  private conns: Array<{ connectorType: ConnectorType, connector: [Connector, Web3ReactHooks] }> = [];

  public initConnector(connectorTypes: ConnectorType[], allowedChainIds?: number[]) {
    this.conns = connectorTypes.map((arg) => {
      switch (arg) {
        case ConnectorType.MetaMask:
          return {connectorType: arg, connector: createMetaMaskConnector(allowedChainIds)};
        case ConnectorType.WalletConnect:
          return {connectorType: arg, connector: createWalletConnectConnector(allowedChainIds)};
      }
    });
  }

  public getConnector(connectorType: ConnectorType): IConnector | null {
    const conn = this.conns.find((a) => a.connectorType === connectorType);
    if (!conn) return null;
    const [c, _] = conn.connector;
    return c;
  }

  public getConnectors(): [Connector, Web3ReactHooks][] {
    return this.conns.map((a) => a.connector);
  }
}

export const connectors = new Connectors();

