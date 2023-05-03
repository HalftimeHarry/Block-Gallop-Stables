<script lang="ts">
	import { NFTStorage, File } from 'nft.storage';
	import { onMount } from 'svelte';
	import { RoleManagerController } from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/RoleManagerController';
	import { HorseMarketController } from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/HorseMarketController';
	import navbarController from '/workspace/Block-Gallop-Stables/client/src/lib/controllers/NavbarController';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	export const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;

	const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	const { nav_store } = navbarController;

	onMount(async () => {
		await navbarController.init();
	});

	$: ({ address, balance } = $nav_store);

	// Import HorseImput type
	import type { HorseInput } from '/workspace/Block-Gallop-Stables/client/src/HorseInput';
	// Form Data
	const formData: HorseInput = {
		name: '',
		age: '',
		breed: 'Thoroughbred',
		racingStatus: '',
		tokenURI: '',
		imageURL: '',
		saleType: 'Private Sale',
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
		// Convert the image URL to a File object
		const imageFile = dataURLtoFile(formData.imageURL, 'image.png');

		// Prepare the TokenInput object
		const tokenInput: TokenInput = {
			name: formData.name,
			description: `Age: ${formData.age}, Breed: ${formData.breed}, Racing Status: ${formData.racingStatus}, Sale Type: ${formData.saleType}, Price: ${formData.price}, Deadline: ${formData.deadline}`,
			image: imageFile
			// ... other properties
		};

		const ipnft = await nftstorage.store(tokenInput);

		// Do something with ipnft, e.g., store it in formData
		formData.tokenURI = ipnft.url;

		// Log the created NFT URL
		console.log('Created NFT: ', ipnft.url);
	}

	async function onFormSubmit(): Promise<void> {
		const horseMarketController = new HorseMarketController();
		const roleManagerController = new RoleManagerController();

		try {
			await horseMarketController.init();
			const { tokenId = 1, saleType, price, deadline } = formData;
			await horseMarketController.listHorseForSale(tokenId, saleType, price, deadline);

			await roleManagerController.grantRoleToSeller(address);
			await storeNFT();

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
				<option value="Private Sale">Private Sale</option>
				<option value="Claim">Claim</option>
				<option value="Auction">Auction</option>
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
