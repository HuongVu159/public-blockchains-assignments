require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    uniMa: {
      url: "http://134.155.50.136:8506", // RPC Node 1
      chainId: 1337, 
      accounts: [
        "0411081da7ab472e6334169396c27b95f5231992a305a8fc326e29a0c214da08",
        "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
        ], // Add your accounts here if needed
    },
  },
};