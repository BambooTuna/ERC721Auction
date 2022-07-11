import {ColorModeScript, ChakraProvider} from "@chakra-ui/react";

import theme from "../theme";
import {AppProps} from "next/app";
import {DappProvider} from "../components/wallet/Provider";
import {ConnectorType} from "../components/wallet/types";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider resetCSS theme={theme}>
        <DappProvider connectorTypes={[ConnectorType.MetaMask, ConnectorType.WalletConnect]} allowedChainIds={[4, 137]}>
          <Component {...pageProps} />
        </DappProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
