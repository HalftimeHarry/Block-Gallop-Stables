import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";

export class RaceHorseController {
    ethersProvider: EthersProvider;
    raceHorseContract: any;
	approveTransferToEscrow(newTokenId: any, address: any) {
		throw new Error('Method not implemented.');
	}
    async getTotalSupply() {
    try {
        const totalSupply = await this.raceHorseContract.totalSupply();
        return totalSupply;
    } catch (error) {
        console.error("Error getting total supply: ", error);
        throw error;
    }
    }
    async getTokenURI() {
    try {
        const nfts = [];
        const totalSupply = await this.raceHorseContract.totalSupply();
        for (let i = 1; i <= totalSupply; i++) {
        const uri = await this.raceHorseContract.tokenURI(i);
        const response = await fetch(uri);
        const metadata = await response.json();
        nfts.push(metadata);
        }
        return nfts;
    } catch (error) {
        console.error("Error getting token URIs: ", error);
        throw error;
    }
    }
	grantRoleToSeller(account: any) {
		throw new Error('Method not implemented.');
	}
    ethersProvider: EthersProvider;
    raceHorseContract: any;

    constructor() {
        this.ethersProvider = new EthersProvider();
    }

    async init() {
    this.raceHorseContract = await this.ethersProvider.getRaceHorseContract();
    // Add any necessary event listeners or subscriptions here
    console.log(await this.raceHorseContract.totalSupply());
    }

    // Add the ownerOf function to the RaceHorseController class
    async ownerOf(tokenId: number): Promise<string> {
    try {
        const owner = await this.raceHorseContract.ownerOf(tokenId);
        return owner;
    } catch (error) {
        console.error("Error getting NFT owner: ", error);
        throw error;
    }
    }

    async mintHorse(
        name: string,
        age: number,
        breed: string,
        racingStatus: string,
        tokenURI: string,
        imageURL: string
    ) {
        // Check for invalid or undefined arguments
        if (!name || !age || !breed || !racingStatus || !tokenURI || !imageURL) {
            console.warn("One or more arguments are invalid or undefined:");
            console.warn("name:", name, "age:", age, "breed:", breed, "racingStatus:", racingStatus, "tokenURI:", tokenURI, "imageURL:", imageURL);
            throw new Error("Invalid or undefined arguments");
        }

        console.log(
            "Calling mintHorse",
            `name: ${name}, age: ${age}, breed: ${breed}, racingStatus: ${racingStatus}, tokenURI: ${tokenURI}, imageURL: ${imageURL}`
        );

        try {
            const result = await this.raceHorseContract.mintHorse(
                name,
                age,
                breed,
                racingStatus,
                tokenURI,
                imageURL
            );
            console.log("Create horse result: ", result);
            return result;
        } catch (error) {
            console.error("Error minting horse: ", error);
            throw error;
        }
    }

    async listHorseForSale(
        tokenId: number,
        saleType: number,
        price: number,
        deadline: number,
        account: number
    ) {
        console.log(
            "Calling listHorseForSale",
            `tokenId: ${tokenId}, saleType: ${saleType}, price: ${price}, deadline: ${deadline}, account: ${account}`
        );
        try {
            const result = await this.raceHorseContract.listHorseForSale(
                tokenId,
                saleType,
                price,
                deadline,
                account
            );
            console.log("List horse for sale result: ", result);
            return result;
        } catch (error) {
            console.error("Error listing horse for sale: ", error);
            throw error;
        }
    }
}

export default RaceHorseController;
