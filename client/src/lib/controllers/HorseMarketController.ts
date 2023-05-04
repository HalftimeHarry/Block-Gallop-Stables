import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";


export class HorseMarketController {
  ethersProvider: EthersProvider;
  horseMarketContract: any;
static listHorseForSale: any;
static init: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
  }

  async init() {
    this.horseMarketContract = this.ethersProvider.getHorseMarketContract();
    // Add any necessary event listeners or subscriptions here
  }

  async listHorseForSale(tokenId: number, saleType: string, price: number, deadline: number) {
    const account = await this.ethersProvider.getSignerAddress();
    console.log(`tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}, account: ${account}`);
    try {
      const result = await this.horseMarketContract.listHorseForSale(tokenId, saleType, price, deadline, account);
      console.log("List horse for sale result: ", result);
      return result;
    } catch (error) {
      console.error("Error listing horse for sale: ", error);
      throw error;
    }
  }
}

export default HorseMarketController;
