import EthersProvider from "/workspace/Block-Gallop-Stables/client/src/lib/providers/ethersProvider";

export class RaceHorseController {
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
        console.log(this.raceHorseContract);
    }

    async createHorse(
        name: string,
        age: number,
        breed: string,
        racingStatus: string,
        tokenURI: string,
        imageURL: string
    ) {
        console.log(
            "Calling createHorse",
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
            console.error("Error creating horse: ", error);
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
