import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const increaseTime = async (time: BigNumberish) => {
  await ethers.provider.send("evm_increaseTime", [
    BigNumber.from(time).toNumber(),
  ]);
  await ethers.provider.send("evm_mine", []);
};
export const getEventArgs = async (tx: any, event: string) => {
  return (await tx.wait()).events.find((e: any) => e.event === event).args;
};

export const nullAddress = "0x0000000000000000000000000000000000000000";
