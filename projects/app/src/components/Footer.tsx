import {Box, Flex, FlexProps, Heading, Spacer, Text} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export const Footer = (props: FlexProps) => (
  <Flex
    width="full"
    bg="#434343"
    as="footer"
    px="4rem"
    py="2rem" {...props}
  >
    <Flex
      direction={["column", "row"]}
      width="full"
      alignItems="start"
      justifyContent="space-between"
    >
      <Heading fontSize="2vw">Web3 Template</Heading>
      <Spacer/>

      <Flex
        direction="column"
        alignItems="start"
        justifyContent="start"
        px="1rem"
      >
        <Heading fontSize="1vw">PRODUCT</Heading>
        <Box h={10}/>
        <Link href={{pathname: "/"}}>
          <Text fontSize="sm">Summary</Text>
        </Link>
      </Flex>

      <Flex
        direction="column"
        alignItems="start"
        justifyContent="start"
        px="1rem"
      >
        <Heading fontSize="1vw">GET INVOLVED</Heading>
        <Box h={10}/>
        <Link href={{pathname: "/twitter"}}>
          <Text fontSize="sm">Twitter</Text>
        </Link>
        <Link href={{pathname: "/discord"}}>
          <Text fontSize="sm">Discord</Text>
        </Link>
      </Flex>

      <Flex
        direction="column"
        alignItems="start"
        justifyContent="start"
        px="1rem"
      >
        <Heading fontSize="1vw">COMPANY</Heading>
        <Box h={10}/>
        <Link href={{pathname: "/"}}>
          <Text fontSize="sm">About</Text>
        </Link>
        <Link href={{pathname: "/"}}>
          <Text fontSize="sm">Jobs</Text>
        </Link>
      </Flex>
    </Flex>
  </Flex>
);
