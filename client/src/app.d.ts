// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

interface HorseInput {
  name: string;
  age: number;
  breed: string;
  racingStatus: string;
  tokenURI: string;
  imageURL: string;
  saleType: string;
  price: number;
  deadline: Date | null;
}