import { ethers } from "ethers";
import horseEscrowABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/HorseEscrow.sol/HorseEscrow.json";
import raceHorseABI from "/workspace/Block-Gallop-Stables/artifacts/contracts/RaceHorse.sol/RaceHorse.json";
import { horseEcrowAddress, raceHorseAddress, GBGSTokenAddress } from "/workspace/Block-Gallop-Stables/client/src/lib/addressProvider/contractAddresses";

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
      address: horseEcrowAddress,
    });

    // Add the rest of the horeseEscrowContract methods here and return the object
    return {
      getIsListed: async (nftID: number) => {
        return await contract.getIsListed(nftID);
      },
    };
  }

  get raceHorseContract() {
    const contract = this.getContract({
      abi: raceHorseABI.abi,
      address: raceHorseAddress,
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

  attachLogSuccessListener(callback: (event: any) => void) {
    const contract = this.getContract({
      abi: horseEscrowABI.abi,
      address: horseEcrowAddress,
    });
    contract.on("LogSuccess", callback);
  }
}

export default EthersProvider;
