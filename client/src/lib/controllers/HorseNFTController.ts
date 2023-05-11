import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";
import { ethers } from "ethers";

export class HorseNFTController {
  ethersProvider: EthersProvider;
  horseNFTContract: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
  }

  async init() {
    this.horseNFTContract = await this.ethersProvider.getHorseNFTContract();
    console.log(await this.horseNFTContract.totalSupply());
  }

  async ownerOf(tokenId: number): Promise<string> {
    try {
      const owner = await this.horseNFTContract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      console.error("Error getting NFT owner: ", error);
      throw error;
    }
  }
  async mint(tokenURI: string) {
    try {
      console.log(tokenURI);
      const transaction = await this.horseNFTContract.mintHorse(tokenURI);
      const receipt = await transaction.wait();
      console.log("Minted horse with token ID", receipt.events[0].args[2].toString());
    } catch (error) {
      console.error("Error minting horse: ", error);
      throw error;
    }
  }
  async listHorseForSale(
    tokenId: number,
    saleType: number,
    price: number,
    deadline: number,
    account: number
  ) {
    console.log(
      "Calling listHorseForSale",
      `tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}, account: ${account}`
    );

    try {
      const result = await this.horseNFTContract.listHorseForSale(
        tokenId,
        saleType,
        price,
        deadline,
        account
      );
      console.log("List horse for sale result: ", result);
      return result;
    } catch (error) {
      console.error("Error listing horse for sale: ", error);
      throw error;
    }
  }

  async getTokenURI() {
    const nfts = [];
    const totalSupply = await this.horseNFTContract.totalSupply();
    for (let i = 1; i <= totalSupply; i++) {
      const uri = await this.horseNFTContract.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      nfts.push(metadata);
    }
    return nfts;
  }

  async totalSupply() {
    try {
      const totalSupply = await this.horseNFTContract.totalSupply();
      return totalSupply;
    } catch (error) {
      console.error("Error getting total supply: ", error);
      throw error;
    }
  }
}

export default HorseNFTController;
