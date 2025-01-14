require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts", // Ensures Hardhat looks for contracts in /contracts/contracts
    tests: "./test",
  },
  networks: {
    hardhat: {}, // Default Hardhat network
  },
};