<script lang="ts">
	import { latestSearchedCategory } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';

	let currentCategory = '';
	let pollInterval: NodeJS.Timeout | undefined;

	async function fetchCategory() {
		try {
			const response = await fetch('/api/message');
			const data = await response.json();
			currentCategory = data.category || 'No category searched yet';
		} catch (error) {
			console.error('Error fetching category:', error);
			currentCategory = 'Error loading category';
		}
	}

	onMount(async () => {
		// Initial fetch
		await fetchCategory();
		
		// Poll every 1 second for updates
		pollInterval = setInterval(fetchCategory, 1000);
	});

	onDestroy(() => {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
	});
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-4 px-4 py-2">
	<div class="text-center">
		<h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">Latest Search Category</h1>
		<div class="text-2xl font-semibold text-[var(--accent-primary)] bg-[var(--bg-secondary)] px-6 py-4 rounded-lg shadow-lg">
			{currentCategory}
		</div>
	</div>
</div>

<style>
	:global(:root) {
		--text-primary: #333;
		--accent-primary: #4285f4;
		--bg-secondary: #f8f9fa;
	}
	
	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--text-primary: #fff;
			--accent-primary: #8ab4f8;
			--bg-secondary: #202124;
		}
	}
</style>
