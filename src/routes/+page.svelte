<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GoogleLogo from '$lib/components/googleLogo.svelte';
	import { FORCE_ITEMS, MAGIC_CATEGORIES, type Category } from '$lib/data/magicData';
	import { selectedCategory } from '$lib/stores';
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';

	// AUTOCOMPLETE HANDLING
	type AutocompleteItem = { key: string } & Category;

	const ITEMS: AutocompleteItem[] = Object.entries(MAGIC_CATEGORIES).map(([key, v]) => ({
		key,
		...v
	}));

	const fuse = new Fuse(ITEMS, {
		includeScore: true,
		threshold: 0.34,
		ignoreLocation: true,
		minMatchCharLength: 1,
		keys: [
			{ name: 'key', weight: 0.5 }, // category name
			{ name: 'searchTerms', weight: 0.25 },
			{ name: 'setA', weight: 0.15 },
			{ name: 'setB', weight: 0.15 },
			{ name: 'question', weight: 0.1 }
		]
	});

	onMount(() => {
		const url = page.url;
		const search = url.searchParams.get('search') ?? null;
		if (search != null) {
			searchVisible = true;
		}
	});

	let searchVisible = false;
	$: if (searchVisible && inputField) {
		inputField.focus();
	}

	let inputField: HTMLInputElement;
	let searchTerm: string = '';
	let forceItemsVisible = false;

	let debounced = '';
	let debounceTimeout: ReturnType<typeof setTimeout>;

	$: {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => (debounced = searchTerm.trim()), 120);
	}

	$: searchResults = (() => {
		if (!debounced) {
			// default suggestions when empty
			return ITEMS.map((i) => i.key);
		}

		const q = debounced.toLowerCase();
		const prefix = ITEMS.filter((i) => i.key.toLowerCase().startsWith(q)).map((i) => i.key);

		const fuzzy = fuse.search(debounced).map((r) => r.item.key);
		const seen = new Set<string>();
		const merged = [...prefix, ...fuzzy].filter((k) => (seen.has(k) ? false : (seen.add(k), true)));
		return merged.slice(0, 8);
	})();

	// $: searchResults = Object.keys(MAGIC_CATEGORIES).filter((category) => {
	// 	const { question, setA, setB, searchTerms } = MAGIC_CATEGORIES[category]; // ok, has string index signature

	// 	const haystacks = [category, question, ...setA, ...setB, ...searchTerms];

	// 	const q = searchTerm.toLowerCase();
	// 	return haystacks.some((s) => s.toLowerCase().includes(q));
	// });

	function selectSearchItem(category: string) {
		$selectedCategory = null;
		if (forceItemsVisible == false) {
			$selectedCategory = MAGIC_CATEGORIES[category] as Category;
		}
		goto('/search?q=' + category);
	}

	function openForceSelector() {
		searchVisible = true;
		forceItemsVisible = true;
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
				type="text"
				class="flex-1 border-0 text-lg font-semibold text-[var(--text-primary)] outline-0"
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
