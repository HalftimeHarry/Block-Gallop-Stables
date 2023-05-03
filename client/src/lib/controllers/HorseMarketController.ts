import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";


export class HorseMarketController {
	account(account: any) {
		throw new Error('Method not implemented.');
	}
  ethersProvider: EthersProvider;
  horseMarketContract: any;
static listHorseForSale: any;
static init: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
  }

  async init() {
    this.horseMarketContract = this.ethersProvider.getHorseMarketContract();
    console.log(this.horseMarketContract);
  }

  async listHorseForSale(tokenId: number, saleType: number, price: number, deadline: number) {
    console.log("Calling listHorseForSale");
    console.log(`tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}`);
    try {
      const result = await this.horseMarketContract.listHorseForSale(tokenId, saleType, price, deadline);
      console.log("List horse for sale result: ", result);
      return result;
    } catch (error) {
      console.error("Error listing horse for sale: ", error);
      throw error;
    }
  }
}

export default HorseMarketController;
