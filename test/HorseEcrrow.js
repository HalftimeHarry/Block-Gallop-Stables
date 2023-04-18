const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("HorseEscrow", function () {
    let buyer, seller
    let raceHorse
  
    it('saves the addresses', async () => {
        
        // Setup accounts
        [buyer, seller] = await ethers.getSigners()

        // Deploy Race Horse
        const RaceHorse = await ethers.getContractFactory('RaceHorse')
        raceHorse = await RaceHorse.deploy()

        //Mint
        let transaction = await raceHorse.connect(seller).mintHorse('https://dulligans.mypinata.cloud/ipfs/QmZBa6eGpSN9STrNUg67fHtW7N9jq86eKvzxk6i7sTotD8/1.json')
        await transaction.wait()

    })
})