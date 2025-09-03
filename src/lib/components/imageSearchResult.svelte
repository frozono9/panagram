<script lang="ts">
	import type { ImageResult } from '$lib';
	import { createEventDispatcher } from 'svelte';

	export let imageData: ImageResult;
	export let titleOverride: string | null = null;
	export let boldLetter: string | null = null;

	const dispatch = createEventDispatcher();
</script>

<button
	class="image-result flex flex-col overflow-hidden"
	on:click|preventDefault|stopPropagation={() => dispatch('click')}
>
	<img
		src={imageData.preview.url}
		alt={imageData.origin.title}
		class="h-full w-full rounded-2xl object-cover"
	/>
	<p class="w-full truncate text-left text-xs text-[var(--text-secondary)]">
		<span class="text-left font-bold capitalize">{boldLetter ?? ''}</span>
		{titleOverride ?? imageData.origin.title}
	</p>
	<p class="truncate text-left text-xs text-[var(--text-primary)]">
		{imageData.origin.website.name}
	</p>
</button>
