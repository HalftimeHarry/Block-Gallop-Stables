import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";
import MetamaskController from "/workspace/Block-Gallop-Stables/client/src/lib/controllers/MetamaskController";
import { RoleManagerController } from "/workspace/Block-Gallop-Stables/client/src/lib/controllers/RoleManagerController";

export class HorseMarketController {
  roleManagerController: RoleManagerController;
  ethersProvider: EthersProvider;
  horseMarketContract: any;

  constructor() {
    this.ethersProvider = new EthersProvider();
    this.roleManagerController = new RoleManagerController();
  }

  async init() {
    this.horseMarketContract = this.ethersProvider.getHorseMarketContract();
    console.log(this.horseMarketContract);
  }

  async listHorseForSale(tokenId: number, saleType: number, price: number, deadline: number) {
      console.log("Calling listHorseForSale");
      console.log(`tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}`);
      try {
          await MetamaskController.init();
          const metamaskControllerStore = MetamaskController.store;
          if (!metamaskControllerStore.isConneted) {
              console.error('Metamask is not connected to the right network');
              return;
          }
          const account = metamaskControllerStore.activeAccount;
          const result = await this.horseMarketContract.listHorseForSale(tokenId, saleType, price, deadline, { from: account });
          console.log("List horse for sale result: ", result);
          await this.roleManagerController.grantRoleToSeller(account);
          return result;
      } catch (error) {
          console.error("Error listing horse for sale: ", error);
          throw error;
      }
  }
}

export default HorseMarketController;
