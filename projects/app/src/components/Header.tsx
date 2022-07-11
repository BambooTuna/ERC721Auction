import React from "react";
import {
  Flex, Heading,
  Image,
  Spacer,
} from "@chakra-ui/react";
import {WalletButton} from "./wallet/WalletButton";
import {useRouter} from "next/router";
import Link from "next/link";

type HeaderProps = {
  logoSrc?: string
  title?: string
}

export const Header: React.FC<HeaderProps> = ({logoSrc, title}) => {
  const router = useRouter();
  const {chainId} = router.query;

  return (
    <>
      <Flex
        width="100%"
        height="107px"
        alignItems="center"
        gap="2"
        pl="5"
        pr="5"
      >
        <Flex
          alignItems="center"
          gap="20"
        >
          {
            logoSrc && (<Image src={logoSrc} height="80%"/>)
          }
          {
            title && (<Heading fontSize="2vw">{title}</Heading>)
          }
        </Flex>

        <Spacer />

        <Flex
          alignItems="center"
          gap="10"
        >
          <Link href={{pathname: "/"}}>
              Top
          </Link>
          <WalletButton desiredChainId={parseInt(chainId as string ?? "1")}/>
        </Flex>
      </Flex>
    </>
  );
};
