// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");

  const time_period = 10 * 24 * 60 * 60; // 10 DAYS
  const args = ["", ethers.constants.AddressZero.toString(), ethers.constants.AddressZero.toString(), time_period.toString()] // Initialize args -- 10 Days
  const nuclear_nerds = await nuclear_nerds_contract.deploy(...args);

  // Deployment Eth cost 0.201023293242139011
  await nuclear_nerds.deployed();


  console.log("nuclear_nerds deployed to:", nuclear_nerds.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
