<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ImageResult } from '$lib';
	import GoogleLogo from '$lib/components/googleLogo.svelte';
	import ImageSearchResult from '$lib/components/imageSearchResult.svelte';
	import LabsLogo from '$lib/components/labsLogo.svelte';
	import { selectedCategory } from '$lib/stores';
	import { bestSplitLetter } from '$lib/utils/anagram';
	import { onMount } from 'svelte';

	const MAX_IMAGES = 200; // max value is 1200
	let searchTerm: string | null;
	let loadedImages: ImageResult[] = [];
	let imagesLoading = false;

	// Anagram Variables
	let inAnagramMode = false;
	let optionsInUse: string[] = []; // this is the active set of possible options
	let askedLetters: Set<string> = new Set(); // the set of letters already asked
	let activeLetter: string;
	let resultFound = false;

	let googleSearchLink = 'https://www.google.com/search?tbm=isch&q=';

	onMount(() => {
		const url = page.url;
		searchTerm = url.searchParams.get('q') ?? null;

		if (searchTerm == null) {
			goto('/', { replaceState: true });
			return;
		}

		googleSearchLink += encodeURIComponent(searchTerm);

		searchForImages();

		async function searchForImages() {
			// meaning we're using a force
			if ($selectedCategory == null) {
				const resp = await fetch('/api/search?q=' + searchTerm);
				loadedImages = (await resp.json()) as ImageResult[];
				return;
			}

			imagesLoading = true;
			const queries = [...$selectedCategory.setA, ...$selectedCategory.setB];
			const results = await Promise.all(
				queries.map(async (q) => {
					const resp = await fetch('/api/search?q=' + q);
					const data = await resp.json();
					return data;
				})
			);

			let i = 0;
			let total = 0;
			let added = true;
			while (added) {
				added = false;
				for (const result of results) {
					if (i < result.length) {
						loadedImages.push(result[i]);
						total++;
						added = true;
					}
				}
				i++;
				if (total >= MAX_IMAGES) break;
			}
			loadedImages = [...loadedImages];
			imagesLoading = false;
		}
	});

	function leftColumnTouchEnd(event: TouchEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (!inAnagramMode || $selectedCategory == null) return;
		if (resultFound) {
			window.location.href = googleSearchLink;
		}
		if (optionsInUse.length < 1) {
			optionsInUse = $selectedCategory.setA;
			getNextLetter();
		} else {
			optionsInUse = optionsInUse.filter((word) => word.toLowerCase().includes(activeLetter));
			getNextLetter();
			checkProgressiveAnagram();
		}
	}

	function rightColumnTouchEnd(
		event: TouchEvent & { currentTarget: EventTarget & HTMLDivElement }
	) {
		if (!inAnagramMode || $selectedCategory == null) return;

		if (resultFound) {
			window.location.href = googleSearchLink;
		}

		if (optionsInUse.length < 1) {
			optionsInUse = $selectedCategory.setB;
			getNextLetter();
		} else {
			optionsInUse = optionsInUse.filter((word) => !word.toLowerCase().includes(activeLetter));
			getNextLetter();
			checkProgressiveAnagram();
		}
	}

	function getNextLetter() {
		const letter = bestSplitLetter(optionsInUse, askedLetters);
		if (!letter) return;
		askedLetters.add(letter);
		activeLetter = letter;
	}

	function checkProgressiveAnagram() {
		if (optionsInUse.length < 2) {
			resultFound = true;
			activeLetter = '✓ ' + optionsInUse[0];
		}
	}

	function enterAnagramMode() {
		if ($selectedCategory == null) return;
		inAnagramMode = true;
		optionsInUse = [];
	}

	function goToImageViewer() {
		if (optionsInUse.length > 1 || !resultFound) return;

		goto('/search/results?q=' + optionsInUse[0]);
	}
</script>

<div
	class="flex h-screen w-full shrink-0 flex-col items-center gap-4 overflow-x-hidden overflow-y-auto px-2 py-2"
>
	<nav class="flex h-15 w-full shrink-0 flex-row items-center justify-center gap-4 px-2 text-xl">
		<LabsLogo />
		<button
			class="flex h-full flex-1 flex-row items-center justify-center"
			on:click={enterAnagramMode}
		>
			<GoogleLogo showImagesText={false} />
		</button>
		<div class="right flex flex-row items-center gap-4">
			<div
				class="flex aspect-square w-8 flex-col items-center justify-center overflow-hidden rounded-full bg-[var(--accent-secondary)] p-4"
			>
				<a href="https://account.google.com" aria-label="account">
					<i class="ti ti-user-filled"></i>
				</a>
			</div>
		</div>
	</nav>
	<button
		on:click={() => goto('/?search')}
		aria-label="Search"
		class="flex h-12 w-full shrink-0 flex-row items-center justify-between rounded-3xl bg-[var(--bg-tertiary)] px-4 text-[var(--text-secondary)]"
	>
		<i class="ti ti-search text-xl"></i>
		<span class="flex-1 px-4 text-left text-[var(--text-primary)]">{searchTerm}</span>
		<div class="flex flex-row items-center gap-3">
			<i class="ti ti-microphone text-xl"></i>
			<i class="ti ti-camera text-2xl"></i>
		</div>
	</button>
	<div
		class="link-list flex h-8 w-fit shrink-0 flex-row flex-nowrap items-center justify-start gap-4 overflow-x-hidden overflow-y-visible pl-10 font-semibold whitespace-nowrap text-[var(--text-secondary)]"
	>
		<p>AI Mode</p>
		<p>All</p>
		<p class="text-[var(--text-primary)] underline decoration-2 underline-offset-6">Images</p>
		<p>Videos</p>
		<p>Books</p>
		<p>News</p>
		<p>Shopping</p>
	</div>
	<div class="grid flex-1 grid-cols-2 gap-2">
		<!-- Left column (odd indices) -->
		<div class="flex flex-col gap-3" on:touchend={leftColumnTouchEnd}>
			{#each loadedImages as imageResult, index}
				{@const titleOverride =
					inAnagramMode && optionsInUse.length < 1 ? ($selectedCategory?.question ?? '') : null}
				{#if index % 2 === 1}
					<ImageSearchResult
						on:click={goToImageViewer}
						imageData={imageResult}
						{titleOverride}
						boldLetter={activeLetter ?? null}
					/>
				{/if}
			{/each}
		</div>

		<!-- Right column (even indices) -->
		<div class="flex flex-col gap-3" on:touchend={rightColumnTouchEnd}>
			{#each loadedImages as imageResult, index}
				{#if index % 2 === 0}
					<ImageSearchResult imageData={imageResult} on:click={goToImageViewer} />
				{/if}
			{/each}
		</div>
	</div>
</div>
