<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GoogleLogo from '$lib/components/googleLogo.svelte';
	import {
		findCategoryBySearchTerm,
		FORCE_ITEMS,
		getCategoryByKeyInsensitive,
		googleImageSearchString,
		MAGIC_CATEGORIES,
		type Category
	} from '$lib/data/magicData';
	import { selectedCategory } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const url = page.url;
		const search = url.searchParams.get('search') ?? null;
		if (search != null) {
			searchVisible = true;
		}
		handleAutocomplete();
	});

	let searchVisible = false;
	$: if (searchVisible && inputField) {
		inputField.focus();
	}

	let inputField: HTMLInputElement;
	let searchTerm: string = '';
	let forceItemsVisible = false;
	let searchResults: string[] = [];

	async function handleAutocomplete() {
		if (searchTerm == '') {
			searchResults = Object.keys(MAGIC_CATEGORIES);
			return;
		}
		const r = await fetch('/api/autocomplete?search=' + searchTerm);
		const json = await r.json();
		searchResults = json as string[];
	}

	function selectSearchItem(raw: string) {
		const input = raw.trim();
		if (!input) return;

		// If showing the "force items" palette, just route with the raw input.
		if (forceItemsVisible) {
			goto('/search?q=' + encodeURIComponent(input));
			return;
		}

		// Try exact key match first (case-insensitive), then fallback to search-term match.
		const category = getCategoryByKeyInsensitive(input) ?? findCategoryBySearchTerm(input);

		if (category) {
			$selectedCategory = category;
		} else {
			// Clear selectedCategory so the search page knows to generate an AI category
			$selectedCategory = null;
		}

		// Always go to search page - it will handle AI category generation if needed
		goto('/search?q=' + encodeURIComponent(input));
	}

	function openForceSelector() {
		searchVisible = true;
		forceItemsVisible = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchResults.length > 0) {
			selectSearchItem(searchResults[0]);
		}
	}
</script>

<div class="flex h-screen w-full flex-col items-center gap-4 px-1 py-2">
	{#if searchVisible || forceItemsVisible}
		{@const options = forceItemsVisible ? FORCE_ITEMS : searchResults}
		<nav
			class="flex w-full flex-row items-center justify-center gap-4 border-0 border-b-1 border-[var(--border-search)] px-2 pb-3 text-2xl"
		>
			<button
				aria-label="button"
				on:click={() => {
					searchVisible = false;
					forceItemsVisible = false;
				}}><i class="ti ti-arrow-left text-[var(--accent-primary)]"></i></button
			>
			<input
				bind:this={inputField}
				bind:value={searchTerm}
				on:input={handleAutocomplete}
				type="text"
				class="flex-1 border-0 text-lg font-semibold text-[var(--text-primary)] outline-0"
				on:keydown={handleKeydown}
			/>
			<i class="ti ti-microphone text-2xl text-[var(--text-secondary)]"></i>
			<i class="ti ti-camera text-2xl text-[var(--text-secondary)]"></i>
		</nav>
		<div class="flex w-full flex-col items-center gap-3">
			{#each options as option}
				<button
					class="flex w-full flex-row gap-3 px-4 text-[var(--text-secondary)]"
					on:click={() => selectSearchItem(option)}
				>
					<i class="ti ti-search text-2xl"></i>
					<p class="flex-1 text-left font-semibold text-[var(--text-primary)] capitalize">
						{option}
					</p>
					<i class="ti ti-arrow-up-left text-2xl"></i>
				</button>
			{/each}
		</div>
	{:else}
		<nav class="flex w-full flex-row items-center justify-between gap-4 px-2 text-xl">
			<div class="left flex flex-row items-center gap-3 px-4 text-sm font-semibold">
				<a class="text-[var(--text-secondary)]" href="https://google.com">ALL</a>
				<span class="text-[var(--accent-primary)] underline decoration-2 underline-offset-20"
					>IMAGES</span
				>
			</div>
			<div class="right flex flex-row items-center gap-4">
				<button on:click={openForceSelector} aria-label="Notifications" class="inline p-0">
					<i class="ti ti-bell text-2xl text-[var(--text-secondary)]"></i>
				</button>
				<i class="ti ti-grid-dots"></i>
				<div
					class="flex aspect-square w-8 flex-col items-center justify-center overflow-hidden rounded-full bg-[var(--accent-secondary)] p-4"
				>
					<a href="https://account.google.com" aria-label="account">
						<i class="ti ti-user-filled"></i>
					</a>
				</div>
			</div>
		</nav>

		<div class="flex w-full flex-col items-center justify-center gap-4 px-5 py-12">
			<div class="flex flex-1 flex-row items-center justify-center">
				<GoogleLogo />
			</div>
			<button
				on:click={() => (searchVisible = true)}
				aria-label="Search"
				class="flex h-12 w-full flex-row items-center justify-between rounded-3xl bg-[var(--bg-tertiary)] px-4 text-[var(--text-secondary)]"
			>
				<i class="ti ti-search text-xl"></i>
				<div class="flex flex-row items-center gap-3">
					<i class="ti ti-microphone text-xl"></i>
					<i class="ti ti-camera text-2xl"></i>
				</div>
			</button>
		</div>
	{/if}
</div>
