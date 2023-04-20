const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("HorseMarket", function () {
    let seller, buyer, veterinarian, dao, trainer;
    let raceHorse, horseClaim, horseMarket, bgstToken, gbgstToken;

  beforeEach(async function () {
      [deployer, seller, buyer, veterinarian, dao, trainer] = await ethers.getSigners();
      
    // Deploy Race Horse
    const RaceHorse = await ethers.getContractFactory("RaceHorse");
    raceHorse = await RaceHorse.deploy();

    const HorseClaim = await ethers.getContractFactory("HorseClaim");
    horseClaim = await HorseClaim.deploy(dao.address, trainer.address);

    console.log("Deploying BGSToken");
    // Deploy a new ERC20 coin token contract
    const BGSToken = await ethers.getContractFactory("BGSToken");
    bgstToken = await BGSToken.deploy(tokens(1000000).toString()); // Convert BigNumber to string

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

    // Mint 1000000 GBGSTokens
    const mintAmount = ethers.utils.parseEther("1000000");
    await gbgstToken.connect(buyer).mint(buyer.address, mintAmount);
  });

  describe("buyHorse", function () {
    it("Should transfer the correct amount of BGSTokens to the seller and the correct amount of GBGSTokens to the buyer", async function () {
      // Setup
      await raceHorse.connect(seller).mintHorse(
        "Test Horse",
        3, // age
        "Breed Name", // breed
        "Racing Stats", // racingStats
        "Token URI", // tokenURI
        "Image URL", // imageURL
        1, // PrivateSale (index 1 in the SaleType enum)
        ethers.utils.parseEther("1") // price
      );
      
      const tokenId = 1;

      // List horse for private sale
      const saleType = 1; // PrivateSale
      const price = ethers.utils.parseEther("1");
      const goalAmount = ethers.utils.parseEther("10");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      // Approve the horseMarket contract to handle the horse token (NFT) on behalf of the seller
      await raceHorse.connect(seller).approve(horseMarket.address, tokenId);

      // List the horse for sale
      await horseMarket
        .connect(seller)
        .listHorseForSale(tokenId, saleType, price, goalAmount, deadline, buyer.address);

      // Approve and fund BGSToken
      await bgstToken.connect(buyer).mint(buyer.address, ethers.utils.parseEther("100"));
      await bgstToken.connect(buyer).approve(horseMarket.address, price);

      // Check initial balances
      const initialSellerBalance = await bgstToken.balanceOf(seller.address);
      const initialBuyerGBGSTBalance = await gbgstToken.balanceOf(buyer.address);

      // Buy horse
      await horseMarket.connect(buyer).buyHorse(tokenId);

      // Check final balances
      const finalSellerBalance = await bgstToken.balanceOf(seller.address);
      const finalBuyerGBGSTBalance = await gbgstToken.balanceOf(buyer.address);

      // Verify results
      expect(finalSellerBalance.sub(initialSellerBalance)).to.equal(price);

      // Implement your logic to calculate the expected GBGSToken amount for the buyer.
      // For example, let's assume the buyer should receive 10% of the price in GBGSTokens.
      const expectedGBGSTAmount = price.mul(10).div(100);

      expect(finalBuyerGBGSTBalance.sub(initialBuyerGBGSTBalance)).to.equal(expectedGBGSTAmount);
    });
  });
});
