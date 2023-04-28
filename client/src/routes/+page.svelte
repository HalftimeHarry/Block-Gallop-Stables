<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import ModalForm from '/workspace/Block-Gallop-Stables/client/src/lib/components/ModalForm.svelte';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	function modalComponentForm(): void {
		const c: ModalComponent = { ref: ModalForm };
		const d: ModalSettings = {
			type: 'component',
			component: c,
			title: 'List Horse',
			body: 'Complete the form below and then press submit.',
			response: (r: any) => console.log('response:', r)
		};
		modalStore.trigger(d);
	}
</script>

<section class="flex justify-center p-4">
	<button
		class="btn variant-filled"
		data-sveltekit-preload-data="hover"
		on:click={modalComponentForm}>List Horse</button
	>
</section>

<Modal />
