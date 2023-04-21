<div class="flex justify-center">
	<div class="grid grid-cols-1 gap-4 min-w-full md:min-w-[750px]">
		<h3 class="text-center py-6">List a Horse</h3>
		<div class="card p-4 w-full text-token space-y-4">
			<label class="label">
				<span>Horse Name</span>
				<input class="input" type="text" placeholder="Enter name here..." />
			</label>
			<label class="label">
				<span>Type of listing</span>
				<select class="select">
					<option value="html">Private Sale</option>
					<option value="css">Claim</option>
					<option value="typescript">Auction</option>
				</select>
			</label>
			<label class="label">
				<span>Breed</span>
				<select class="select">
					<option value="html">Thoroughbred</option>
					<option value="css">Arabian</option>
					<option value="typescript">Quaterhorse</option>
				</select>
			</label>
			<label class="label">
				<span>Purchase Price</span>
				<input class="input" type="text" placeholder="Enter price here..." />
			</label>
			<label class="label">
				<span>Status</span>
				<textarea class="textarea" rows="4" placeholder="2 Wins 3 Losses..." />
			</label>

			<button type="button" class="btn btn-sm variant-filled-primary"> Create Snippet </button>
		</div>
	</div>
</div>
