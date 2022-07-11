import {Flex, Heading} from "@chakra-ui/react";

export const Hero = ({title}: { title: string }) => (
  <Flex
    justifyContent="center"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
    pt={100}
    pb={100}
  >
    <Heading fontSize="4vw">{title}</Heading>
  </Flex>
);

