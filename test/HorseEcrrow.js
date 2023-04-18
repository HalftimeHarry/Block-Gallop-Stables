const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("HorseEscrow", function () {
  let buyer, seller;
  let raceHorse;

  it("saves the addresses", async () => {
    // Setup accounts
    [buyer, seller] = await ethers.getSigners();
    // Deploy Race Horse
    const RaceHorse = await ethers.getContractFactory("Racehorse");
    raceHorse = await RaceHorse.deploy();

    // Mint
    let transaction = await raceHorse
    .connect(seller)
    .mintHorse(
        "Thunderbolt",
        4,
        "Thoroughbred",
        "3 wins, 2 losses",
        "https://dulligans.mypinata.cloud/ipfs/QmadzUnPSfgNCBK8M9AEvJRsABRuB2z62XiRjpREasmBaz/1.json",
        "https://example.com/image/1",
        0, // Assuming 0 corresponds to private_sale in the SaleType enum
        tokens(3) // Price in Ether (3 ETH)
    );
    await transaction.wait();
    });
});
