import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";
import RaceHorseController from "/path/to/RaceHorseController"; // Replace with the correct import path

export class HorseMarketController {
  ethersProvider: EthersProvider;
  horseMarketContract: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
  }

  async init() {
    this.horseMarketContract = this.ethersProvider.getHorseMarketContract();
    // Add any necessary event listeners or subscriptions here
  }

  async listHorseForSale(tokenId: number, saleType: number, price: number, deadline: Date, account: string) {
    const signer = await this.ethersProvider.getSignerAddress()
    console.log(`tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}, account: ${account}`);
    try {
      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
      const gasLimit = 1000000; // Set a custom gas limit
      const result = await this.horseMarketContract.listHorseForSale(tokenId, saleType, price, deadlineTimestamp, signer, { gasLimit });

      const transactionReceipt = await result.wait();

      console.log("List horse for sale result: ", transactionReceipt);
      return transactionReceipt;
    } catch (error) {
      console.error("Error listing horse for sale: ", error);
      throw error;
    }
  }

  async getNFTOwner(raceHorseController: RaceHorseController, tokenId: number): Promise<string> {
    const owner = await raceHorseController.ownerOf(tokenId);
    return owner;
  }
}

export default HorseMarketController;
