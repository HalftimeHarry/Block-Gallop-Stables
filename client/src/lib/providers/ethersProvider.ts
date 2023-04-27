import { ethers } from "ethers";
import horseEscrowABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseEscrow.sol/HorseEscrow.json";
import raceHorseABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RaceHorse.sol/RaceHorse.json";
import GBGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/GBGSToken.sol/GBGSToken.json";
import BGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/BGSToken.sol/BGSToken.json";
import roleManagerABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RoleManager.sol/RoleManager.json";
import horseMarketABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseMarket.sol/HorseMarket.json";
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
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  account: string;

  constructor(account: string) {
    this.account = account;
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    this.signer = this.provider.getSigner();
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

  get roleManagerContract() {
    const contract = this.getContract({
      abi: roleManagerABI.abi,
      address: RoleManagerAddress,
    });
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
  get horseMarketContract() {
    const contract = this.getContract({
      abi: horseMarketABI.abi,
      address: HorseMarketAddress,
    });
    // Add the rest of the HorseMarket contract methods here and return the object
    return {
      listHorseForSale: async (tokenId: number, saleType: number, price: number, goalAmount: number, deadline: number, buyer: string) => {
        const result = await contract.methods.listHorseForSale(tokenId, saleType, price, goalAmount, deadline, buyer).send({ from: this.account });
        return result;
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
  get raceHorseContract() {
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
    };
  }
  get GBGSTokenContract() {
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
  get BGSTokenContract() {
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