const { ethers } = require("hardhat");
const { formatEther } = require("@ethersproject/units");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Access the provider from the signer
  const provider = deployer.provider;
  
  // Get the balance using the provider
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", formatEther(balance));

  // Load the contract factory
  const Token = await ethers.getContractFactory("CensorableToken");
  
  // Deploy the contract
  const token = await Token.deploy("TokenName", "TKN", ethers.parseUnits("1000010", 18), deployer.address);
  
  console.log("Token deployed to:", token.target);

  // Set the validator's allowance
  await token.setValidatorAllowance();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
