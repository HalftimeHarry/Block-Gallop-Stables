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

  console.log(`Minting 3 horses...\n`);
  for (let i = 0; i < 3; i++) {
    const transaction = await raceHorse.connect(seller).mintHorse(
      "My horse name",
      3,
      "Thoroughbred",
      "Raced in 5 competitions, won 2",
      "https://mytokenuri.com/123",
      "https://myimageurl.com/123",
      SaleType.Auction, // Use the SaleType enum value here
      ethers.utils.parseUnits("100", "ether")
    );
    await transaction.wait();
  }

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
  console.log(`Listing 3 horses...\n`);
  

  const deadlineDuration = 60 * 60 * 24 * 7; // 7 days in seconds
  const currentBlock = await hre.ethers.provider.getBlock('latest');
  const currentTimestamp = currentBlock.timestamp;

  let transaction;
  for (let i = 0; i < 3; i++) {
    transaction = await raceHorse.connect(seller).approve(horseEscrow.address, i + 1);
    await transaction.wait();
  }

if (await horseEscrow.hasRole(seller.address)) {
  // Listing horses...
  transaction = await horseEscrow.connect(seller).list(1, buyer.address, tokens(20), tokens(0), currentTimestamp + deadlineDuration, seller.address, {
    gasLimit: ethers.utils.hexlify(1500000), // Increase the gas limit to 1.5 million
  });
  await transaction.wait();
  console.log('list 1');

  transaction = await horseEscrow.connect(seller).list(2, buyer.address, tokens(20), tokens(0), currentTimestamp + deadlineDuration, seller.address, {
    gasLimit: ethers.utils.hexlify(1500000), // Increase the gas limit to 1.5 million
  });
  await transaction.wait();
  console.log('list 2');

  transaction = await horseEscrow.connect(seller).list(3, buyer.address, tokens(20), tokens(0), currentTimestamp + deadlineDuration, seller.address, {
    gasLimit: ethers.utils.hexlify(1500000), // Increase the gas limit to 1.5 million
  });
  await transaction.wait();
  console.log('list 3');

  console.log(`Finished.`);
} else {
  console.log('Seller does not have the SELLER_ROLE');
}

} // This is the corrected location of the closing curly brace

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});