import { ethers } from "ethers";
import horseEscrowABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseEscrow.sol/HorseEscrow.json";
import raceHorseABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RaceHorse.sol/RaceHorse.json";
import GBGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/GBGSToken.sol/GBGSToken.json";
import BGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/BGSToken.sol/BGSToken.json";
import roleManagerABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RoleManager.sol/RoleManager.json";
import horseMarketABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseMarket.sol/HorseMarket.json";
import metamaskController from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/MetamaskController';

import {
    HorseEcrowAddress,
    RaceHorseAddress,
    GBGSTokenAddress,
    BGSTokenAddress,
    RoleManagerAddress,
    HorseMarketAddress,
    AdminAddress
} from "/workspace/Block-Gallop-Stables/client/src/lib/addressProvider/contractAddresses";


class EthersProvider {
  async getDefaultAccount() {
    await metamaskController.init();
    return metamaskController.store.activeAccount;
  }

  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  account: string;

  constructor(account?: string) {
    this.account = account;
    if (typeof window !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      this.signer = this.provider.getSigner();
    } else {
      console.error("Window object is not available");
    }
  }

  setAccount(account: string) {
    this.account = account;
  }

  async getConnectedAccount() {
    if (typeof window === 'undefined') {
      console.error("Window object is not available");
      return;
    }

    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the user's account address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts[0]; // Return the first account in the array
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("No web3 provider detected");
    }
  }
    // Add this method to the EthersProvider class
  async listAccounts() {
    return await this.provider.listAccounts();
  }
  getContract({ abi, address }) {
  const contract = new ethers.Contract(address, abi, this.signer);
  return contract;
}
  get adminAddress() {
    return AdminAddress;
  }
  getHorseEscrowContract() {
  const contract = this.getContract({
    abi: horseEscrowABI.abi,
    address: HorseEcrowAddress,
  });

  return {
    getIsListed: async (nftID: number) => {
      return await contract.methods.getIsListed(nftID).call();
    },
    setGoalAmount: async (nftID: number, goalAmount: number) => {
      return await contract.methods.setGoalAmount(nftID, goalAmount).send({ from: this.account });
    },
    list: async (
      nftID: number,
      buyer: string,
      purchasePrice: number,
      goalAmount: number,
      deadline: number,
      seller: string
    ) => {
      return await contract.methods
        .list(nftID, buyer, purchasePrice, goalAmount, deadline, seller)
        .send({ from: this.account });
    },
    updateVeterinarianStatus: async (nftID: number, passed: boolean) => {
      return await contract.methods.updateVeterinarianStatus(nftID, passed).send({ from: this.account });
    },
    approveSale: async (nftID: number) => {
      return await contract.methods.approveSale(nftID).send({ from: this.account });
    },
    finalizeSale: async (nftID: number) => {
      return await contract.methods.finalizeSale(nftID).send({ from: this.account });
    },
    refund: async (nftID: number) => {
      return await contract.methods.refund(nftID).send({ from: this.account });
    },
    cancelSale: async (nftID: number) => {
      return await contract.methods.cancelSale(nftID).send({ from: this.account });
    },
    getGoalAmount: async (nftID: number) => {
        return await contract.goalAmount(nftID);
      },
    getBalance: async () => {
      return await contract.methods.getBalance().call();
    },
  };
}

  getRoleManagerContract() {
    const contract = this.getContract({
      abi: roleManagerABI.abi,
      address: RoleManagerAddress,
    });
    console.log(contract);
    return {
      grantRoleToSeller: async (address: string) => {
        return await contract.grantRoleToSeller(address);
      },
      revokeRoleFromSeller: async (address: string) => {
        return await contract.revokeRoleFromSeller(address);
      },
      grantRoleToVeterinarian: async (address: string) => {
        return await contract.grantRoleToVeterinarian(address);
      },
      revokeRoleFromVeterinarian: async (address: string) => {
        return await contract.revokeRoleFromVeterinarian(address);
      },
      grantRoleToBuyer: async (address: string) => {
        return await contract.grantRoleToBuyer(address);
      },
      revokeRoleFromBuyer: async (address: string) => {
        return await contract.revokeRoleFromBuyer(address);
      },
      grantRoleToDAO: async (address: string) => {
        return await contract.grantRoleToDAO(address);
      },
      revokeRoleFromDAO: async (address: string) => {
        return await contract.revokeRoleFromDAO(address);
      },
      grantRoleToDefaultAdmin: async (address: string) => {
        return await contract.grantRoleToDefaultAdmin(address);
      },
      revokeRoleFromDefaultAdmin: async (address: string) => {
        return await contract.revokeRoleFromDefaultAdmin(address);
      },
    };
  }
  getHorseMarketContract() {
    const contract = this.getContract({
      abi: horseMarketABI.abi,
      address: HorseMarketAddress,
    });
    // Add the rest of the HorseMarket contract methods here and return the object
    return {
      listHorseForSale: async (tokenId: number, saleType: string, price: number, deadline: number, account: number) => {
        try {
          const result = await contract.listHorseForSale(tokenId, saleType, price, deadline, account);
          return result;
        } catch (error) {
          console.error('Error listing horse for sale:', error);
        }
      },
      buyHorse: async (tokenId: number, paymentAmount: number) => {
        const result = await contract.methods.buyHorse(tokenId).send({ from: this.account, value: paymentAmount });
        return result;
      },
      cancelHorseSale: async (tokenId: number) => {
        const result = await contract.methods.cancelHorseSale(tokenId).send({ from: this.account });
        return result;
      },
      getHorseSale: async (tokenId: number) => {
        const result = await contract.methods.getHorseSale(tokenId).call();
        return result;
      },
    };
  }
  getRaceHorseContract() {
    const contract = this.getContract({
      abi: raceHorseABI.abi,
      address: RaceHorseAddress,
    });
    // Add the rest of the raceHorseContract methods here and return the object
    return {
      getTotalSupply: async () => await contract.totalSupply(),
      getTokenURI: async () => {
        const nfts = [];
        const totalSupply = await contract.totalSupply();
        for (let i = 1; i <= totalSupply; i++) {
          const uri = await contract.tokenURI(i);
          const response = await fetch(uri);
          const metadapp = await response.json();
          nfts.push(metadapp);
        }
        return nfts;
      },
      mintHorse: async (
        name,
        age,
        breed,
        racingStats,
        tokenURI,
        imageURL,
        saleType,
        price
      ) => {
        try {
          const tx = await contract.mintHorse(
            name,
            age,
            breed,
            racingStats,
            tokenURI,
            imageURL,
            saleType,
            price
          );
          await tx.wait();
          console.log("Horse minted successfully");
        } catch (error) {
          console.error("Error minting horse:", error);
        }
      },
    };
  }
  getGBGSTokenContract() {
    const contract = this.getContract({
      abi: GBGSTokenABI.abi,
      address: GBGSTokenAddress,
    });
    // Add the rest of the raceHorseContract methods here and return the object
    return {
      getTotalSupply: async () => await contract.totalSupply(),
      getTokenURI: async () => {
        const nfts = [];
        const totalSupply = await contract.totalSupply();
        for (let i = 1; i <= totalSupply; i++) {
          const uri = await contract.tokenURI(i);
          const response = await fetch(uri);
          const metadapp = await response.json();
          nfts.push(metadapp);
        }
        return nfts;
      },
    };
  }
  getBGSTokenContract() {
    const contract = this.getContract({
      abi: BGSTokenABI.abi,
      address: BGSTokenAddress,
    });
    // Add the rest of the raceHorseContract methods here and return the object
    return {
      getTotalSupply: async () => await contract.totalSupply(),
      getTokenURI: async () => {
        const nfts = [];
        const totalSupply = await contract.totalSupply();
        for (let i = 1; i <= totalSupply; i++) {
          const uri = await contract.tokenURI(i);
          const response = await fetch(uri);
          const metadapp = await response.json();
          nfts.push(metadapp);
        }
        return nfts;
      },
    };
  }
}

export default EthersProvider;
