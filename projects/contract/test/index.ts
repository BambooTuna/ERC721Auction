import { expect } from "chai";
import { ethers } from "hardhat";
import { increaseTime } from "./utils";

describe("Deploy", async function () {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let sampleNFT: any;
  let auction: any;
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("owner is token owner, address is", owner.address);
    console.log("addr1 is bidder1, address is", addr1.address);
    console.log("addr2 is bidder2, address is", addr2.address);

    const SampleNFT = await ethers.getContractFactory("SampleNFT");
    sampleNFT = await SampleNFT.deploy("SampleNFT", "SNFT");
    await sampleNFT.deployed();
    console.log("SampleNFT address is", sampleNFT.address);

    const AuctionMarket = await ethers.getContractFactory("AuctionMarket");
    auction = await AuctionMarket.deploy(
      "AuctionMarket",
      "AM",
      sampleNFT.address
    );
    await auction.deployed();
    console.log("auction address is", auction.address);
  });

  describe("Deploy", async function () {
    it("mint success", async function () {
      await sampleNFT.mint(addr1.address);
      expect(await sampleNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("depositToken", async function () {
      await sampleNFT.mint(owner.address);

      const blockNumAfter = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumAfter);
      const now = block.timestamp;

      await sampleNFT.approve(auction.address, 0);
      await auction.depositToken(0, now + 100, 60 * 60, 5);

      expect(await sampleNFT.ownerOf(0)).to.equal(auction.address);
    });

    it("getTurn", async function () {
      await sampleNFT.mint(owner.address);

      const blockNumAfter = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumAfter);
      const now = block.timestamp;

      await sampleNFT.approve(auction.address, 0);
      await auction.depositToken(0, now + 100, 60 * 60, 3);
      await increaseTime(200);
      expect((await auction.getTurn(0)).toNumber()).to.equal(1);
      await increaseTime(60 * 60);
      expect((await auction.getTurn(0)).toNumber()).to.equal(2);
      await increaseTime(60 * 60);
      expect((await auction.getTurn(0)).toNumber()).to.equal(3);
      await increaseTime(60 * 60);
      // expect(await auction.getTurn(0)).to.throw();
    });
  });
});
