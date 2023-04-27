<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Import HorseData type
	import type { HorseData } from '/workspace/Block-Gallop-Stables/client/src/HorseData';
	// Form Data
	const formData: HorseData = {
		name: 'Enter name here...',
		age: 0,
		breed: 'Thoroughbred',
		racingStats: '',
		tokenURI: '',
		imageURL: '',
		saleType: 'Private Sale',
		price: 0,
		deadline: 0
	};

	import { DateInput } from 'date-picker-svelte';
	let date = new Date();

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-form {cBase}">
	<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
	<article>{$modalStore[0].body ?? '(body missing)'}</article>
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
			<span>Deadline</span>
			<DateInput bind:value={date} />
			<input
				class="input"
				type="number"
				bind:value={formData.deadline}
				placeholder="Enter deadline here..."
			/>
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
