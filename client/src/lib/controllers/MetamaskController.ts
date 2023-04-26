import { writable, Writable } from "svelte/store";

interface Config {
  HARDHAT: number;
}

interface MessageType {
  NOT_INSTALLED: string;
  LOADING: string;
  LOADED: string;
  ERROR: string;
}

interface BaseState {
  isMetamaskInstalled: boolean;
  isWrongNetwork: boolean;
  isConneted: boolean;
  isLocked: boolean;
  activeAccount: string;
  message: string;
}

const config: Config = {
  HARDHAT: 31337,
};

const messageType: MessageType = {
  NOT_INSTALLED: "Metamask not installed",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "Internal server error",
};

const baseState: BaseState = {
  isMetamaskInstalled: false,
  isWrongNetwork: false,
  isConneted: false,
  isLocked: false,
  activeAccount: messageType.LOADING,
  message: messageType.LOADING,
};

class MetamaskController {
  #appStore: Writable<BaseState> = writable({ ...baseState });
  store: any;

  constructor() {
    this.store = {
      subscribe: this.#appStore.subscribe,
    };
  }

  networkChanged(chainId: number): void {
    const isConneted = chainId == config.HARDHAT;
    const isWrongNetwork = !(chainId == config.HARDHAT);
    this.#appStore.update((s) => ({ ...s, isConneted, isWrongNetwork }));
  }

  async init(): Promise<void> {
    const { ethereum } = window as any;
    const hasMetamask = Boolean(ethereum && ethereum.isMetaMask);

    if (!hasMetamask)
      return this.#appStore.set({ ...baseState, message: messageType.NOT_INSTALLED });

    try {
      await ethereum.request({ method: "eth_requestAccounts" });

      this.#appStore.update((s) => {
        s.isMetamaskInstalled = hasMetamask;
        s.isConneted = ethereum.networkVersion == config.HARDHAT;
        s.isWrongNetwork = !(ethereum.networkVersion == config.HARDHAT);
        s.message = messageType.LOADED;
        s.isLocked = false;
        s.activeAccount = ethereum.selectedAddress;
        return s;
      });

      ethereum.on("accountsChanged", (accounts: string[]) => {
        this.#appStore.update((s) => {
          s.activeAccount = accounts[0];
          return s;
        });
      });
    } catch (error) {
      const message = error?.message || messageType.ERROR;
      this.#appStore.set({ ...baseState, message, isLocked: true });
    }
  }
}

export default new MetamaskController();
