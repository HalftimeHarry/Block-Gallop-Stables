import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";

class HorseMarketController {
  ethersProvider: EthersProvider | undefined;
  horseMarketContract: {
    // Contract methods
  } | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const ethersProvider = new EthersProvider();
    const account = await ethersProvider.getConnectedAccount();
    this.ethersProvider = new EthersProvider(account);
    this.horseMarketContract = this.ethersProvider.horseMarketContract;
  }
}

const horseMarketController = new HorseMarketController();
export default horseMarketController;
