const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BigNumber } = ethers;

describe("CensorableToken", function () {
  
  async function deployCensorableTokenFixture() {
    const initialSupply = BigNumber.from("1000");
    const validatorSupply = BigNumber.from("10");

    const [owner, validator, addr1, addr2] = await ethers.getSigners();

    const CensorableToken = await ethers.getContractFactory("CensorableToken");
    const censorableToken = await CensorableToken.deploy("Censorable", "CENS", initialSupply, owner.address);

    return { censorableToken, owner, validator, addr1, addr2 };
  }

  describe("Minting Tokens", function () {
    it("should mint more than 10 tokens for the contract owner", async function () {
      const { censorableToken, owner } = await loadFixture(deployCensorableTokenFixture);
      const ownerBalance = await censorableToken.balanceOf(owner.address);

      expect(ownerBalance).to.equal(BigNumber.from("1000"));
    });

    it("should mint 10 tokens for the validator", async function () {
      const { censorableToken, validator } = await loadFixture(deployCensorableTokenFixture);
      const validatorBalance = await censorableToken.balanceOf(validator.address);

      expect(validatorBalance).to.equal(BigNumber.from("10"));
    });
  });

  describe("Allowances", function () {
    it("should set the validator's allowance equal to the owner's balance", async function () {
      const { censorableToken, owner } = await loadFixture(deployCensorableTokenFixture);
      const ownerBalance = await censorableToken.balanceOf(owner.address);

      await censorableToken.connect(owner).approve(owner.address, ownerBalance);

      const allowance = await censorableToken.allowance(owner.address, owner.address);
      expect(allowance).to.equal(ownerBalance);
    });
  });

  // You can add more describe blocks for other tests as needed
});
