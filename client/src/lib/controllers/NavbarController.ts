import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";
import { ethers } from "ethers";
import { writable, Writable } from "svelte/store";

interface BaseState {
  account: string;
  balance: string;
}

const baseState: BaseState = {
  account: "loading account...",
  balance: "0.00",
};

class NavbarController {
  #navbarManagerStore: Writable<BaseState> = writable({ ...baseState });
    nav_store: unknown;

  constructor() {
    this.nav_store = {
      subscribe: this.#navbarManagerStore.subscribe,
    };
  }

  ethersProvider: EthersProvider | undefined;

  async init(): Promise<void> {
    this.ethersProvider = new EthersProvider();
    await this.#getDetails();
  }

  private async #getDetails(): Promise<void> {
    let address = await this.ethersProvider?.signer.getAddress();
  //  let amount = await this.ethersProvider?.signer.getBalance();
  //  let balance = ethers.utils.formatEther(amount).toString();

    address = `${address?.substring(0, 5)}...${address?.slice(-5)}`;
    balance = `${balance?.substring(0, 6)}`;

    this.#navbarManagerStore.update((s) => ({ ...s, account: address, balance }));
  }
}

export default new NavbarController();
