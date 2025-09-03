<script lang="ts">
	import type { ImageResult } from '$lib';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MAGIC_CATEGORIES } from '$lib/data/magicData';

	export let data;
	let searchedImages: ImageResult[] = [];
	let searchTerm: string | null = null;

	onMount(() => {
		searchedImages = data.images as ImageResult[];
		searchTerm = $page.url.searchParams.get('q');
	});

	function redirectToGoogleSearch() {
		if (searchTerm) {
			// Find which category the search term belongs to
			let categoryName = '';
			for (const [key, category] of Object.entries(MAGIC_CATEGORIES)) {
				if (category.setA.includes(searchTerm) || category.setB.includes(searchTerm)) {
					categoryName = key;
					break;
				}
			}
			
			// If found in a category, use the category name, otherwise use the search term
			const searchQuery = categoryName || searchTerm;
			const query = encodeURIComponent(searchQuery);
			window.location.href = `https://www.google.com/search?tbm=isch&q=${query}`;
		}
	}
</script>

{#if searchedImages.length > 0}
	<div class="flex h-full w-full flex-col items-center justify-start">
		<nav class="flex h-12 w-full flex-row items-center justify-center gap-2 px-4 py-2">
			<span class="aspect-square h-full overflow-hidden rounded-full bg-white">
				<img
					src={'https://www.google.com/s2/favicons?domain=' +
						searchedImages[0].origin.website.domain}
					alt={searchedImages[0].origin.website.name}
					class="w-full bg-cover"
				/>
			</span>
			<p class="flex-1 font-semibold">{searchedImages[0].origin.website.name}</p>
			<div class="flex flex-row items-center gap-2 text-2xl text-[var(--text-secondary)]">
				<button class="hover:bg-gray-100 rounded-full p-1" aria-label="More options">
					<i class="ti ti-dots-vertical"></i>
				</button>
				<button on:click={redirectToGoogleSearch} class="hover:bg-gray-100 rounded-full p-1" aria-label="Search on Google">
					<i class="ti ti-x"></i>
				</button>
			</div>
		</nav>
		<img src={searchedImages[0].url} alt={searchedImages[0].origin.title} class="h-auto w-full" />
		<div class="flex flex-row items-center justify-between gap-8 p-3">
			<div class="flex flex-col items-start text-left">
				<p class="font-semibold">{searchedImages[0].origin.title}</p>
				<p class="text-xs font-semibold text-[var(--text-secondary)]">
					Images may be subject to copyright. <span class="font-bold">Learn More</span>
				</p>
			</div>
			<button
				class="flex h-9 w-fit flex-row items-center gap-2 rounded-full bg-[var(--accent-primary)] px-4 text-[var(--bg-primary)]"
				>Visit <i class="ti ti-chevron-right"></i></button
			>
		</div>
		<div class="items center mt-3 flex h-10 w-full flex-row justify-between gap-4 px-4">
			<button class="w-full rounded-full bg-[var(--bg-tertiary)]">
				<i class="ti ti-upload"></i> Share</button
			>
			<button class="w-full rounded-full bg-[var(--bg-tertiary)]">
				<i class="ti ti-bookmark"></i> Save</button
			>
		</div>
	</div>
{/if}
