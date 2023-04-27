/* eslint-disable no-undef */
import { ethers } from "hardhat";

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

const tokens = (n) => {
  // eslint-disable-next-line no-undef
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [owner, buyer, seller, veterinarian, dao] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", seller.address);

  // Deploy Race Horse
  const RaceHorse = await ethers.getContractFactory('RaceHorse');
  const raceHorse = await RaceHorse.deploy();
  await raceHorse.deployed();

  console.log(`Deployed RaceHorse Contract at: ${raceHorse.address}`);

  // Deploy GBGSToken
  const GBGSToken = await ethers.getContractFactory('GBGSToken');
  const governanceToken = await GBGSToken.deploy(buyer.address); // Pass the initialMinter address
  await governanceToken.deployed();
  console.log(`Deployed GBGSToken Contract at: ${governanceToken.address}`);

  // Deploy BGSToken
  const BGSToken = await ethers.getContractFactory('BGSToken');
  const valueToken = await BGSToken.deploy(owner.address); // Pass the initialMinter address
  await valueToken.deployed();
  console.log(`Deployed BGSToken Contract at: ${valueToken.address}`);

  // Deploy RoleManager
  const RoleManager = await ethers.getContractFactory('RoleManager');
  const roleManager = await RoleManager.deploy(); // Pass the required arguments
  await roleManager.deployed();
  console.log(`Deployed RoleManager Contract at: ${roleManager.address}`);
  
  const SaleType = {
    PrivateSale: 0,
    Claim: 1,
    Auction: 2,
  };

  // Deploy HorseEscrow
  // In your deploy.ts script
  const HorseEscrow = await ethers.getContractFactory("HorseEscrow");
  const horseEscrow = await HorseEscrow.deploy(
    raceHorse.address,
    governanceToken.address,
    seller.address,
    veterinarian.address,
    dao.address,
    valueToken.address // Add the missing argument here
  );
  await horseEscrow.deployed();

  console.log(`Deployed HorseEscrow Contract at: ${horseEscrow.address}`);

  const HorseMarket = await ethers.getContractFactory("HorseMarket");
  const horseMarket = await HorseMarket.deploy(
    raceHorse.address,
    governanceToken.address,
    seller.address,
    veterinarian.address,
    dao.address,
    valueToken.address // Add the missing argument here
  );
  await horseMarket.deployed();

  console.log(`Deployed HorseMarket Contract at: ${horseMarket.address}`);

} // This is the corrected location of the closing curly brace

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});