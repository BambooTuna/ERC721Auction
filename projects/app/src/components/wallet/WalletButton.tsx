import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, useDisclosure,
  VStack,
  Text, Flex, Link,
} from "@chakra-ui/react";
import {connectors} from "./connectors";
import {ConnectorType} from "./types";
import {BigNumber} from "@ethersproject/bignumber";
import {formatEther} from "@ethersproject/units";
import {Identicon} from "./Identicon";
import {CopyIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {CHAINS} from "./chains";
import {MetaMask} from "@web3-react/metamask";
import {WalletConnect} from "@web3-react/walletconnect";

export const WalletButton: React.FC<{
  desiredChainId: number
}> = ({desiredChainId}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {connector, chainId, isActivating, isActive, error} = useWeb3React();

  useEffect(() => {
    connector.connectEagerly();
  }, []);

  if (error) {
    return (
      <>
        <Button
          width="full"
          borderRadius="xl"
          bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
          onClick={() => connector.deactivate()}
        >
          {error.message}
        </Button>
      </>
    );
  } else if (isActivating) {
    return (
      <>
        <Button
          width="full"
          borderRadius="xl"
          bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
          isLoading={true}
        >
            🟡 Connecting
        </Button>
      </>
    );
  } else if (isActive) {
    if (desiredChainId !== chainId) {
      return (
        <>
          <Button
            width="full"
            borderRadius="xl"
            bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
            onClick={() => connector.activate(desiredChainId)}
          >
              🔴 Switch to Chain
          </Button>
        </>
      );
    }
    return (
      <>
        <AccountButton
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </>
    );
  } else {
    return (
      <>
        <ConnectButton
          desiredChainId={desiredChainId}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </>
    );
  }
};

const ConnectButton: React.FC<{
  desiredChainId: number,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
}> = ({desiredChainId, isOpen, onOpen, onClose}) => {
  return (
    <>
      <ConnectModal
        desiredChainId={desiredChainId}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Button
        width="full"
        borderRadius="xl"
        bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
        onClick={() => onOpen()}
      >
          ⚪️ Connect
      </Button>
    </>
  );
};

const ConnectModal: React.FC<{
  desiredChainId: number,
  isOpen: boolean,
  onClose: () => void
}> = ({desiredChainId, isOpen, onClose}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Button
                width="100%"
                onClick={async () => {
                  await connectors.getConnector(ConnectorType.MetaMask)?.activate(CHAINS[desiredChainId]);
                  onClose();
                }}
              >
                  MetaMask
              </Button>
              <Button
                width="100%"
                onClick={async () => {
                  await connectors.getConnector(ConnectorType.WalletConnect)?.activate(desiredChainId);
                  onClose();
                }}
              >
                  WalletConnect
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export const AccountButton: React.FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
}> = ({isOpen, onOpen, onClose}) => {
  const {connector, chainId, account, provider} = useWeb3React();
  const [balance, setBalance] = useState<BigNumber | null>(null);

  useEffect(() => {
    (async () => {
      if (provider && account) {
        setBalance(await provider.getBalance(account));

        const chain = CHAINS[chainId];
        // const p = new ethers.providers.EtherscanProvider(chain.chainId);
        // const histories = await p.getHistory(account, p.blockNumber - 2);
        // setTransactions(histories.map(a => {
        //   return {
        //     hash: a.hash,
        //     wait: (): Promise<any> => a.wait && a.wait(),
        //     timestamp: a.timestamp,
        //   }
        // }));
      } else {
        setBalance(null);
      }
    })();
  }, [provider, account]);

  return (
    <>
      <AccountModal
        isOpen={isOpen}
        onClose={onClose}
        deactivate={() => connector.deactivate()}
      />
      <Box
        display="flex"
        alignItems="center"
        background="gray.700"
        borderRadius="xl"
        py="0"
      >
        <Box px="3">
          <Text color="white" fontSize="md">
            {
              (balance && parseFloat(formatEther(balance)).toFixed(3)) ?? "???"
            } {CHAINS[chainId].nativeCurrency.symbol}
          </Text>
        </Box>
        <Button
          onClick={() => onOpen()}
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          height="38px"
        >
          <Text
            color="white"
            fontSize="md"
            fontWeight="medium"
            mr="2"
          >
            {account &&
                  `${account.slice(0, 6)}...${account.slice(
                      account.length - 4,
                      account.length
                  )}`}
          </Text>
          {account && (<Identicon account={account}/>)}
          <Box width="5px"/>
        </Button>
      </Box>
    </>
  );
};

export const AccountModal: React.FC<{
  isOpen: boolean,
  onClose: () => void
  deactivate: () => void
}> = ({isOpen, onClose, deactivate}) => {
  const {connector, chainId, account} = useWeb3React();
  const explorerUrl = CHAINS[chainId].blockExplorerUrls[0];

  function connectorName() {
    if (connector instanceof MetaMask) return "MetaMask";
    if (connector instanceof WalletConnect) return "WalletConnect";
    return "Unknown";
  }

  function handleDeactivateAccount() {
    deactivate();
    onClose();
  }

  function displayTime(unixTime) {
    const seconds = Date.now() / 1000 - unixTime;
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " y ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " m ago";
    }
    return Math.floor(seconds) + " s ago";
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent
          background="gray.900"
          border="1px"
          borderStyle="solid"
          borderColor="gray.700"
          borderRadius="3xl"
        >
          <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
              Account
          </ModalHeader>
          <ModalCloseButton
            color="white"
            fontSize="sm"
            _hover={{
              color: "whiteAlpha.700",
            }}
          />
          <ModalBody pt={0} px={4}>
            <Box
              borderRadius="3xl"
              border="1px"
              borderStyle="solid"
              borderColor="gray.600"
              px={5}
              pt={4}
              pb={2}
              mb={3}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                    Connected with {connectorName()}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  borderColor="blue.800"
                  borderRadius="3xl"
                  color="blue.500"
                  fontSize="13px"
                  fontWeight="normal"
                  px={2}
                  height="26px"
                  _hover={{
                    background: "none",
                    borderColor: "blue.300",
                    textDecoration: "underline",
                  }}
                  onClick={handleDeactivateAccount}
                >
                    Change
                </Button>
              </Flex>
              <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
                <Identicon account={account}/>
                <Text
                  color="white"
                  fontSize="xl"
                  fontWeight="semibold"
                  ml="2"
                  lineHeight="1.1"
                >
                  {account &&
                        `${account.slice(0, 6)}...${account.slice(
                            account.length - 4,
                            account.length
                        )}`}
                </Text>
              </Flex>
              <Flex alignContent="center" m={3}>
                <Button
                  variant="link"
                  color="gray.400"
                  fontWeight="normal"
                  fontSize="sm"
                  _hover={{
                    textDecoration: "none",
                    color: "whiteAlpha.800",
                  }}
                >
                  <CopyIcon mr={1} />
                    Copy Address
                </Button>
                <Link
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  href={`${explorerUrl}/address/${account}`}
                  isExternal
                  color="gray.400"
                  ml={6}
                  _hover={{
                    color: "whiteAlpha.800",
                    textDecoration: "underline",
                  }}
                >
                  <ExternalLinkIcon mr={1} />
                    View on Explorer
                </Link>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter
            justifyContent="start"
            background="gray.700"
            borderBottomLeftRadius="3xl"
            borderBottomRightRadius="3xl"
            p={6}
          >
            <Text
              color="white"
              textAlign="left"
              fontWeight="medium"
              fontSize="md"
            >
                Your recent transactions
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
