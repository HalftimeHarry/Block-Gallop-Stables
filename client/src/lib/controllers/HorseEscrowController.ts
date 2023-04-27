import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";
import { writable } from "svelte/store";

interface baseState {
  isListed: boolean;
  goalAmount: number;
  deadline: number;
  purchasePrice: number;
  contributions: number;
}


const baseState = {
  isListed: false,
  goalAmount: 0,
  deadline: 0,
  purchasePrice: 0,
  contributions: 0,
};

class HorseEscrowController {
  #escrowStore = writable({ ...baseState });
    ethersProvider: EthersProvider | undefined;
      horseEscrowContract: {
    getDeadLine: (nftID: number) => Promise<any>;
    getIsListed: (nftID: number) => Promise<any>;
    setGoalAmount: (nftID: number, goalAmount: number) => Promise<any>;
    list: (
      nftID: number,
      buyer: string,
      purchasePrice: number,
      goalAmount: number,
      deadline: number,
      seller: string
    ) => Promise<any>;
    updateVeterinarianStatus: (nftID: number, passed: boolean) => Promise<any>;
    // ... other properties
  };
    escrow_store: any;

    constructor(horseEscrowContractProvider: any) {
       this.horseEscrowContract = horseEscrowContractProvider.getHorseEscrowContract();
       this.#escrowStore = {
      subscribe: this.#escrowStore.subscribe,
    };
  }

  async init(nftID: any) {
    this.ethersProvider = new EthersProvider(account);
    this.horseEscrowContract = this.ethersProvider.getHorseEscrowContract();

    this.getIsListed(nftID);
    this.getGoalAmount(nftID);
    this.getDeadLine(nftID);
    this.getPurchasePrice(nftID);
    this.getContributions(nftID);
  }

  async getIsListed(nftID) {
    const isListed = await this.horseEscrowContract.getIsListed(nftID);
    this.#escrowStore.update((s) => ({ ...s, isListed }));
  }

  async getGoalAmount(nftID) {
    const goalAmount = await this.horseEscrowContract.getGoalAmount(nftID);
    this.#escrowStore.update((s) => ({ ...s, goalAmount }));
  }

  async getDeadLine(nftID) {
    const deadline = await this.horseEscrowContract.getDeadLine(nftID);
    this.#escrowStore.update((s) => ({ ...s, deadline }));
  }

  async getPurchasePrice(nftID) {
    const purchasePrice = await this.horseEscrowContract.getPurchasePrice(nftID);
    this.#escrowStore.update((s) => ({ ...s, purchasePrice }));
  }

  async getContributions(nftID) {
    const contributions = await this.horseEscrowContract.getContributions(nftID);
    this.#escrowStore.update((s) => ({ ...s, contributions }));
  }

  // Add more methods for other interactions with the HorseEscrow contract
}

const horseEscrowController = new HorseEscrowController();
const escrow_store = horseEscrowController.escrow_store;
export default horseEscrowController;
export { escrow_store };
