const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("HorseEscrow", function () {
  let buyer, seller, veterinarian, dao;
  let raceHorse, bgstToken, horseEscrow, gbgstToken;

  before(async () => {
    // Setup accounts
    [buyer, seller, veterinarian, dao] = await ethers.getSigners();

    console.log("Deploying RaceHorse");
    // Deploy Race Horse
    const RaceHorse = await ethers.getContractFactory("RaceHorse");
    raceHorse = await RaceHorse.deploy();

    console.log("Deploying GBGSToken");
    // Deploy a new ERC20 Governance token contract
    const GBGSToken = await ethers.getContractFactory("GBGSToken");
    gbgstToken = await GBGSToken.deploy(seller.address);

    // Grant minter role to the buyer account
    const MINTER_ROLE = await gbgstToken.MINTER_ROLE();
    await gbgstToken.grantRole(MINTER_ROLE, buyer.address);

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

    const nftAddress = raceHorse.address;

    console.log("Deploying BGSToken");
    // Deploy a new ERC20 coin token contract
    const BGSToken = await ethers.getContractFactory("BGSToken");
    bgstToken = await BGSToken.deploy(tokens(1000000).toString()); // Convert BigNumber to string

    console.log("Deploying HorseEscrow");
    // Deploy HorseEscrow
    const HorseEscrow = await ethers.getContractFactory("HorseEscrow");
    horseEscrow = await HorseEscrow.deploy(
      nftAddress,
      bgstToken.address,
      seller.address,
      veterinarian.address,
      dao.address,
      gbgstToken.address // Ensure this is a valid Ethereum address
    );

    // Get the address of the deployed contract
    const address = horseEscrow.address;
  });

  it("mints 1000000 GBGSToken's", async () => {
  const mintAmount = tokens(1000000);
  await gbgstToken.mint(buyer.address, mintAmount);
  const buyerGBGSTokenBalance = await gbgstToken.balanceOf(buyer.address);
  expect(buyerGBGSTokenBalance).to.equal(mintAmount);
  });
  
it("initializes seller and buyer BGSToken balances correctly", async () => {
  const buyerBalance = await bgstToken.balanceOf(buyer.address);
  expect(buyerBalance).to.equal(tokens(1000000));
});

  it("saves the addresses", async () => {
    // Get the address of the deployed contract
    const address = horseEscrow.address;
    expect(address).to.not.equal(0);
  });
});
