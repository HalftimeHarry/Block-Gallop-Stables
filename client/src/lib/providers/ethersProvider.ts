import { ethers } from "ethers";
import horseEscrowABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseEscrow.sol/HorseEscrow.json";
import raceHorseABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RaceHorse.sol/RaceHorse.json";
import GBGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/GBGSToken.sol/GBGSToken.json";
import BGSTokenABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/BGSToken.sol/BGSToken.json";
import roleManagerABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RoleManager.sol/RoleManager.json";
import horseMarkeABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseMarket.sol/HorseMarket.json";
import {
    HorseEcrowAddress,
    RaceHorseAddress,
    GBGSTokenAddress,
    BGSTokenAddress,
    RoleManagerAddress,
    HorseMarketAddress,
    AdminAddress
} from "/workspace/Block-Gallop-Stables/client/src/lib/addressProvider/contractAddresses";

interface ContractDetails {
  address: string;
  abi: any;
}

class EthersProvider {
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    this.signer = this.provider.getSigner();
  }

  getContract({ address, abi }: ContractDetails) {
    return new ethers.Contract(address, abi, this.signer);
  }

  get horeseEscrowContract() {
    const contract = this.getContract({
      abi: horseEscrowABI.abi,
      address: HorseEcrowAddress,
    });
    // Add the rest of the horeseEscrowContract methods here and return the object
    return {
      getIsListed: async (nftID: number) => {
        return await contract.getIsListed(nftID);
      },
    };
  }

  get roleManagerwContract() {
    const contract = this.getContract({
      abi: roleManagerABI.abi,
      address: RoleManagerAddress,
    });
    // Add the rest of the horeseEscrowContract methods here and return the object
    return {
      grantRoleToSeller: async (address: any) => {
        return await contract.grantRoleToSeller(address);
      },
    };
  }

  get horseMarketContract() {
    const contract = this.getContract({
      abi: horseMarkeABI.abi,
      address: HorseMarketAddress,
    });
    // Add the rest of the horeseEscrowContract methods here and return the object
    return {
        listHorseForSale: async (tokenId, saleType, price, goalAmount, deadline, buyer) => {
        const result = await contract.methods.listHorseForSale(tokenId, saleType, price, goalAmount, deadline, buyer).send({ from: this.account });
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
