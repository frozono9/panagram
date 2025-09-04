<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ImageResult } from '$lib';
	import GoogleLogo from '$lib/components/googleLogo.svelte';
	import ImageSearchResult from '$lib/components/imageSearchResult.svelte';
	import LabsLogo from '$lib/components/labsLogo.svelte';
	import { googleImageSearchString, findCategoryBySearchTerm, type Category, FORCE_ITEMS, MAGIC_CATEGORIES } from '$lib/data/magicData';
	import { selectedCategory } from '$lib/stores';
	import { bestSplitLetter } from '$lib/utils/anagram';
	import { onMount } from 'svelte';

	const MAX_IMAGES = 200; // max value is 1200
	let searchTerm: string | null;
	let loadedImages: ImageResult[] = [];
	let generatingCategory = false;
	let isAiGeneratedCategory = false;

	// Anagram Variables
	let inAnagramMode = false;
	let optionsInUse: string[] = []; // this is the active set of possible options
	let askedLetters: Set<string> = new Set(); // the set of letters already asked
	let activeLetter: string;
	let resultFound = false;

	// View state
	let showAllView = false; // true for "All" view, false for "Images" view

	let googleSearchLink = googleImageSearchString;

	onMount(() => {
		const url = page.url;
		searchTerm = url.searchParams.get('q') ?? null;

		if (searchTerm == null) {
			goto('/', { replaceState: true });
			return;
		}

		googleSearchLink += encodeURIComponent(searchTerm);

		// Check if we have an existing category or need to generate one
		initializeCategoryAndSearch();

		async function initializeCategoryAndSearch() {
			// If no category is selected, try to generate one with AI
			if ($selectedCategory == null) {
				// Need to generate a new category using AI
				generatingCategory = true;
				try {
					const response = await fetch('/api/generate-category', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ searchTerm })
					});
					
					if (response.ok) {
						const aiCategory = await response.json() as Category;
						selectedCategory.set(aiCategory);
						isAiGeneratedCategory = true; // Mark as AI-generated
					} else {
						console.error('Failed to generate category');
						// Fall back to no category (force mode)
						isAiGeneratedCategory = false;
					}
				} catch (error) {
					console.error('Error generating category:', error);
					// Fall back to no category (force mode)
					isAiGeneratedCategory = false;
				} finally {
					generatingCategory = false;
				}
			} else {
				// Category was set from homepage, so it's from MAGIC_CATEGORIES
				isAiGeneratedCategory = false;
			}
			
			// Update the latest searched category for the /api/message endpoint
			await updateSearchedCategory();
			
			searchForImages();
		}

		async function updateSearchedCategory() {
			let categoryName = '';
			
			if ($selectedCategory != null) {
				// Find the category name from MAGIC_CATEGORIES
				for (const [key, value] of Object.entries(MAGIC_CATEGORIES)) {
					if (value === $selectedCategory) {
						categoryName = key;
						break;
					}
				}
				// If not found in MAGIC_CATEGORIES, it's AI-generated
				if (!categoryName && isAiGeneratedCategory) {
					categoryName = searchTerm || 'AI Generated Category';
				}
			} else {
				// Use the search term if no category is available
				categoryName = searchTerm || '';
			}
			
			// Store in localStorage for Vercel compatibility
			if (typeof window !== 'undefined') {
				localStorage.setItem('lastSearchedCategory', categoryName);
				localStorage.setItem('triggerTimestamp', Date.now().toString());
			}
			
			try {
				// Also call the server endpoint for immediate updates
				await fetch('/api/update-search-category', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ category: categoryName })
				});
			} catch (error) {
				console.error('Failed to update search category:', error);
			}
		}
	});

	async function searchForImages() {
		// meaning we're using a force
		if ($selectedCategory == null) {
			const resp = await fetch('/api/search?q=' + searchTerm);
			loadedImages = (await resp.json()) as ImageResult[];
			return;
		}

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
	}

	function leftColumnTouchEnd(event: TouchEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (!inAnagramMode || $selectedCategory == null) return;
		if (resultFound) {
			return;
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
			return;
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

	async function enterAnagramMode() {
		// Check if we're in force mode (searching for a FORCE_ITEM or no category available)
		const isForceMode = FORCE_ITEMS.includes(searchTerm as any) || ($selectedCategory == null && !isAiGeneratedCategory);
		
		if (isForceMode) {
			// Force items should redirect to homepage
			goto('/');
			return;
		}

		// For AI-generated categories or MAGIC_CATEGORIES, we should have a category
		if ($selectedCategory == null) {
			// If category is still being generated, wait for it
			if (generatingCategory) {
				setTimeout(() => enterAnagramMode(), 100);
				return;
			}
			// If no category could be generated, treat as force mode
			goto('/');
			return;
		}

		// Preserve the first 8 images
		const firstEightImages = loadedImages.slice(0, 8);

		// Get new random images for the rest
		const resp = await fetch('/api/search?q=' + searchTerm);
		const newImages = (await resp.json()) as ImageResult[];

		// Combine first 8 with new random images
		loadedImages = [...firstEightImages, ...newImages];

		inAnagramMode = true;
		optionsInUse = [];
	}

	function goToImageViewer() {
		if (optionsInUse.length > 1 || !resultFound) return;

		// Build URL with category information for the X button
		let url = '/search/results?q=' + encodeURIComponent(optionsInUse[0]);
		
		if (isAiGeneratedCategory) {
			// For AI-generated categories, pass the original search term
			url += '&category=' + encodeURIComponent(searchTerm || '');
			url += '&ai=true';
		} else if ($selectedCategory != null) {
			// For MAGIC_CATEGORIES, find and pass the category key
			const categoryKey = Object.keys(MAGIC_CATEGORIES).find(key => 
				MAGIC_CATEGORIES[key] === $selectedCategory
			);
			if (categoryKey) {
				url += '&category=' + encodeURIComponent(categoryKey);
			}
		}

		goto(url);
	}

	function goToCategory() {
		if (optionsInUse.length > 1 || !resultFound) return;

		// For AI-generated categories, use the original search term
		if (isAiGeneratedCategory) {
			goto('/search/results?q=' + encodeURIComponent(searchTerm || ''));
			return;
		}

		// For MAGIC_CATEGORIES, find the category key
		if ($selectedCategory != null) {
			// Find which MAGIC_CATEGORIES key matches the current category
			const categoryKey = Object.keys(MAGIC_CATEGORIES).find(key => 
				MAGIC_CATEGORIES[key] === $selectedCategory
			);
			
			if (categoryKey) {
				goto('/search/results?q=' + encodeURIComponent(categoryKey));
				return;
			}
		}

		// Fallback to the chosen word if we can't determine the category
		goto('/search/results?q=' + optionsInUse[0]);
	}

	function goToRealGoogle() {
		if (optionsInUse.length > 1 || !resultFound) return;
		
		let searchQuery = '';
		
		// For AI-generated categories, use the original search term
		if (isAiGeneratedCategory) {
			searchQuery = searchTerm || '';
		} else if ($selectedCategory != null) {
			// For MAGIC_CATEGORIES, find the category key
			const categoryKey = Object.keys(MAGIC_CATEGORIES).find(key => 
				MAGIC_CATEGORIES[key] === $selectedCategory
			);
			searchQuery = categoryKey || '';
		}
		
		// Fallback to the chosen word if we can't determine the category
		if (!searchQuery) {
			searchQuery = optionsInUse[0] || '';
		}
		
		// Redirect to actual Google Images search
		if (searchQuery) {
			window.location.href = googleImageSearchString + encodeURIComponent(searchQuery);
		}
	}

	function showAllOptions() {
		showAllView = true;
	}

	function showImagesView() {
		showAllView = false;
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
		class="link-list flex h-8 w-full shrink-0 flex-row flex-nowrap items-center justify-start gap-4 overflow-x-hidden overflow-y-visible px-4 font-semibold whitespace-nowrap text-[var(--text-secondary)]"
	>
		<p>AI Mode</p>
		<button 
			class="{showAllView ? 'text-[var(--text-primary)] underline decoration-2 underline-offset-6' : ''}"
			on:click={showAllOptions}
		>
			All
		</button>
		<button 
			class="{!showAllView ? 'text-[var(--text-primary)] underline decoration-2 underline-offset-6' : ''}"
			on:click={showImagesView}
		>
			Images
		</button>
		<p>Videos</p>
		<p>Books</p>
		<p>News</p>
		<p>Shopping</p>
	</div>
	
	{#if showAllView && $selectedCategory != null}
		<!-- All options view - show the 12 possible options -->
		<div class="flex-1 w-full px-4">
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-[var(--text-primary)] mb-2">
					{$selectedCategory.question}
				</h2>
				<p class="text-sm text-[var(--text-secondary)]">
					Choose from {$selectedCategory.setA.length + $selectedCategory.setB.length} options:
				</p>
			</div>
			
			<div class="grid grid-cols-1 gap-3">
				<!-- Set A options -->
				<div class="space-y-2">
					<h3 class="text-md font-medium text-[var(--text-primary)]">
						{$selectedCategory.question.split(' or ')[0]}
					</h3>
					<div class="grid grid-cols-2 gap-2">
						{#each $selectedCategory.setA as option}
							<button 
								class="p-3 bg-[var(--bg-tertiary)] rounded-lg text-left text-[var(--text-primary)] hover:bg-[var(--accent-secondary)] transition-colors"
								on:click={() => goto('/search/results?q=' + encodeURIComponent(option))}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>
				
				<!-- Set B options -->
				<div class="space-y-2">
					<h3 class="text-md font-medium text-[var(--text-primary)]">
						{$selectedCategory.question.split(' or ')[1]?.replace('?', '') || 'Other'}
					</h3>
					<div class="grid grid-cols-2 gap-2">
						{#each $selectedCategory.setB as option}
							<button 
								class="p-3 bg-[var(--bg-tertiary)] rounded-lg text-left text-[var(--text-primary)] hover:bg-[var(--accent-secondary)] transition-colors"
								on:click={() => goto('/search/results?q=' + encodeURIComponent(option))}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else if showAllView && $selectedCategory == null}
		<!-- No category available - show message -->
		<div class="flex-1 w-full px-4 flex flex-col items-center justify-center">
			<div class="text-center">
				<h2 class="text-lg font-semibold text-[var(--text-primary)] mb-2">
					No options available
				</h2>
				<p class="text-sm text-[var(--text-secondary)]">
					This search doesn't have categorized options to display.
				</p>
			</div>
		</div>
	{:else}
		<!-- Images grid view -->
		<div class="grid flex-1 grid-cols-2 gap-2">
			<!-- Left column (odd indices) -->
			<div class="flex flex-col gap-3" on:touchend={leftColumnTouchEnd}>
				{#each loadedImages as imageResult, index}
					{@const titleOverride =
						inAnagramMode && optionsInUse.length < 1 ? ($selectedCategory?.question ?? '') : null}
					{#if index % 2 === 1}
						<ImageSearchResult
							on:click={goToRealGoogle}
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
	{/if}
</div>
