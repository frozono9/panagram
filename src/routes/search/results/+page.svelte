<script lang="ts">
	import type { ImageResult } from '$lib';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { googleImageSearchString, MAGIC_CATEGORIES } from '$lib/data/magicData';
	import ImageSearchResult from '$lib/components/imageSearchResult.svelte';
	import { selectedCategory } from '$lib/stores.js';

	export let data;
	let searchedImages: ImageResult[] = [];
	let featuredImage: ImageResult;
	let searchTerm: string | null = null;

	onMount(() => {
		searchedImages = data.images as ImageResult[];
		if (searchedImages.length < 1) return;
		featuredImage = searchedImages.pop() ?? searchedImages[0];
		searchTerm = $page.url.searchParams.get('q');
	});

	function redirectToGoogleSearch() {
		let googleSearchQuery = searchTerm ?? '';

		if ($selectedCategory) {
			const categoryKey = Object.entries(MAGIC_CATEGORIES).find(
				([, value]) => value === $selectedCategory
			)?.[0];

			googleSearchQuery = categoryKey ?? searchTerm ?? '';
		}

		const query = encodeURIComponent(googleSearchQuery);
		window.location.href = googleImageSearchString + 'query';
	}
</script>

{#if searchedImages.length > 0}
	<div class="flex h-full w-full flex-col items-center justify-start">
		<nav class="flex h-12 w-full flex-row items-center justify-center gap-2 px-4 py-2">
			<span class="aspect-square h-full overflow-hidden rounded-full bg-white">
				<img
					src={'https://www.google.com/s2/favicons?domain=' + featuredImage.origin.website.domain}
					alt={featuredImage.origin.website.name}
					class="w-full bg-cover"
				/>
			</span>
			<a href={featuredImage.origin.website.url} class="flex-1 font-semibold"
				>{featuredImage.origin.website.name}</a
			>
			<div class="flex flex-row items-center gap-2 text-2xl text-[var(--text-secondary)]">
				<button class="rounded-full p-1 hover:bg-gray-100" aria-label="More options">
					<i class="ti ti-dots-vertical"></i>
				</button>
				<button
					on:click={redirectToGoogleSearch}
					class="rounded-full p-1 hover:bg-gray-100"
					aria-label="Search on Google"
				>
					<i class="ti ti-x"></i>
				</button>
			</div>
		</nav>
		<img src={searchedImages[0].url} alt={featuredImage.origin.title} class="h-auto w-full" />
		<div class="flex flex-row items-center justify-between gap-8 p-3">
			<div class="flex flex-col items-start text-left">
				<p class="font-semibold">{featuredImage.origin.title}</p>
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
		<br />
		<div class="grid grid-cols-2 gap-2 px-2">
			{#each searchedImages as imageData}
				<ImageSearchResult {imageData} />
			{/each}
		</div>
	</div>
{/if}
