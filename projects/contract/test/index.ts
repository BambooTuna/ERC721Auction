import { expect } from "chai";
import { ethers } from "hardhat";

describe("Deploy", async function () {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let sampleNFT: any;
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("owner address is", owner.address);
    console.log("addr1 is user, address is", addr1.address);
    console.log("addr2 is user, address is", addr2.address);

    const SampleNFT = await ethers.getContractFactory("SampleNFT");
    sampleNFT = await SampleNFT.deploy("SampleNFT", "SNFT");
    await sampleNFT.deployed();
    console.log("SampleNFT address is", sampleNFT.address);
  });

  describe("Deploy", async function () {
    it("mint success", async function () {
      await sampleNFT.mint(addr1.address);
      expect(await sampleNFT.ownerOf(0)).to.equal(addr1.address);
    });
  });
});
