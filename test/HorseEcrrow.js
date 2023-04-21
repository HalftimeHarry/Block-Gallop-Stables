const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("HorseEscrow", function () {
  let buyer, seller, veterinarian, dao;
  let raceHorse, bgstToken, horseEscrow, horseMarket, gbgstToken;

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

    console.log("Deploying HorseMarket");
      const HorseMarket = await ethers.getContractFactory("HorseMarket");
      horseMarket = await HorseMarket.deploy(
        raceHorse.address,
        nftAddress,
        bgstToken.address,
        veterinarian.address,
        dao.address,
        gbgstToken.address
      );

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

      it("should list a horse for sale as a private sale", async function () {
      // Mint a new horse token
      await raceHorse.connect(seller).mintHorse(
        "Test Horse",
        3, // age
        "Breed Name", // breed
        "Racing Stats", // racingStats
        "Token URI", // tokenURI
        "Image URL", // imageURL
        1, // SaleType (PrivateSale as an example, use the correct index from your SaleType enum)
        ethers.utils.parseEther("1") // price
      );
      const tokenId = 1;

      // Approve the horseMarket contract to handle the horse token (NFT) on behalf of the seller
      await raceHorse.connect(seller).approve(horseMarket.address, tokenId);

      // List the horse for private sale
      const saleType = 1; // PrivateSale
      const price = ethers.utils.parseEther("20");
      const goalAmount = ethers.utils.parseEther("10");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await horseMarket
        .connect(seller)
        .listHorseForSale(tokenId, saleType, price, goalAmount, deadline, buyer.address);

      // Get the sale details
      const sale = await horseMarket.getHorseSale(tokenId);

      // Verify the sale details
      expect(sale.saleType).to.equal(saleType);
      expect(sale.seller).to.equal(seller.address);
      expect(sale.tokenId).to.equal(tokenId);
      expect(sale.price).to.equal(price);
    });
});
