import {Web3ReactProvider} from "@web3-react/core";
import React from "react";
import {connectors} from "./connectors";
import {ConnectorType} from "./types";

export const DappProvider: React.FC<{
  children?: React.ReactNode;
  connectorTypes: ConnectorType[];
  allowedChainIds?: number[];
}> = ({children, connectorTypes, allowedChainIds}) => {
  connectors.initConnector(connectorTypes, allowedChainIds);
  return (
    <Web3ReactProvider connectors={connectors.getConnectors()}>
      {children}
    </Web3ReactProvider>
  );
};
