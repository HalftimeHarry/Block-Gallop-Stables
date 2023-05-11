<script lang="ts">
	import { NFTStorage, File } from 'nft.storage';
	import navbarController from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/NavbarController';
	import EthersProvider from '../providers/ethersProvider.js';
	import { HorseNFTController } from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/HorseNFTController';
	import { HorseMarketController } from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/HorseMarketController';
	import { onMount } from 'svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	export const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;

	const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

	const { nav_store } = navbarController;

	onMount(async () => {
		await navbarController.init();
	});

	$: ({ address } = $nav_store);

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Import HorseImput type

	// Form Data
	const formData: HorseInput = {
		name: '',
		age: '',
		breed: 'Thoroughbred',
		racingStatus: '',
		tokenURI: '',
		imageURL: '',
		saleType: '1',
		price: '',
		deadline: null
	};

	type TokenInput = {
		name: string;
		description: string;
		image: File;
		// ... other properties
	};

	let imageURL = '';

	const handleFileInput = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			formData.imageURL = reader.result;
		};
		reader.readAsDataURL(file);
	};

	import { DateInput } from 'date-picker-svelte';
	let deadline = new Date();

	function dataURLtoFile(dataurl, filename) {
		const arr = dataurl.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	async function storeNFT() {
		try {
			const horseNFTController = new HorseNFTController();
			await horseNFTController.init();

			// Convert the image URL to a File object
			const imageFile = dataURLtoFile(formData.imageURL, 'image.png');

			// Prepare the TokenInput object
			const tokenInput = {
				name: formData.name,
				description: `Age: ${formData.age}, Breed: ${formData.breed}, Racing Status: ${formData.racingStatus}, Sale Type: ${formData.saleType}, Price: ${formData.price}, Deadline: ${formData.deadline}`,
				image: imageFile
			};

			const ipnft = await nftstorage.store(tokenInput);

			// Log the created NFT URL
			const uri = `https://ipfs.io/ipfs/${ipnft.ipnft}/metadata.json`;
			console.log(uri);

			// Store the tokenURI in formData
			formData.tokenURI = uri;

			// Call the mint function from the HorseNFTCotroller class to mint the NFT
		const result = await horseNFTController.mint(uri);
			console.log('NFT minted successfully. Transaction result:', result);
		} catch (error) {
			console.error('Error minting NFT:', error);
		}
	}

	async function getNewTokenId(horseNFTCotroller: HorseNFTController): Promise<number> {
		const totalSupply = await horseNFTCotroller.totalSupply();
		return totalSupply.toNumber() + 1;
	}

	async function onFormSubmit(): Promise<void> {
		const horseNFTCotroller = new HorseNFTController();
		const horseMarketController = new HorseMarketController();
		const saleType = parseInt(formData.saleType);
		const price = formData.price;
		const deadline = formData.deadline ?? new Date();

		try {
			await horseNFTCotroller.init();
			await horseMarketController.init();

			// Store the NFT and set the tokenURI
			await storeNFT();

			// Get the new tokenId using the getNewTokenId function
			const tokenId = await getNewTokenId(horseNFTCotroller);
			console.log(tokenId);

			// Check the owner of the NFT with tokenId
			const owner = await horseMarketController.getNFTOwner(horseNFTCotroller, tokenId);
			console.log(`The owner of the NFT with tokenId ${tokenId} is: ${owner}`);

			// List the horse for sale with the new tokenId
			await horseMarketController.listHorseForSale(tokenId, saleType, price, deadline, address);

			if ($modalStore[0].response) $modalStore[0].response(formData);
			modalStore.close();
		} catch (error) {
			console.error('Error listing horse for sale:', error);
		}
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-form {cBase}">
	<header class={cHeader}>{$modalStore[0]?.title ?? '(title missing)'}</header>
	<article>{$modalStore[0]?.body ?? '(body missing)'}</article>
	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form class="modal-form {cForm}">
		<label class="label">
			<span>Horse Name</span>
			<input
				class="input"
				type="text"
				bind:value={formData.name}
				placeholder="Enter name here..."
			/>
		</label>
		<label class="label">
			<span>Age</span>
			<input
				class="input"
				type="number"
				bind:value={formData.age}
				placeholder="Enter horse age here..."
			/>
		</label>
		<label class="label">
			<span>Type of listing</span>
			<select class="select" bind:value={formData.saleType}>
				<option value="1">Private Sale</option>
				<option value="2">Claim</option>
				<option value="3">Auction</option>
			</select>
		</label>
		<label class="label">
			<span>Breed</span>
			<select class="select" bind:value={formData.breed}>
				<option value="Thoroughbred">Thoroughbred</option>
				<option value="Arabian">Arabian</option>
				<option value="Quaterhorse">Quaterhorse</option>
			</select>
		</label>
		<label class="label">
			<span>Purchase Price</span>
			<input
				class="input"
				type="number"
				bind:value={formData.price}
				placeholder="Enter price here..."
			/>
		</label>
		<label class="label">
			<span>Photo</span>
			<input class="input" type="file" on:change={handleFileInput} />
			{#if formData.imageURL}
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src={formData.imageURL} alt="Selected Image" />
			{/if}
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Deadline</span>
			<DateInput bind:value={formData.deadline} />
		</label>
		<label class="label">
			<span>Status</span>
			<textarea
				class="textarea"
				rows="4"
				bind:value={formData.racingStatus}
				placeholder="2 Wins 3 Losses..."
			/>
		</label>
		<!-- ... (the rest of the template content remains the same) -->
	</form>
	<!-- prettier-ignore -->
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
	/* You can add more styles here if necessary */
</style>
