<script lang="ts">
	import type { ImageResult } from '$lib';

	export let imageData: ImageResult;
	export let titleOverride: string | null = null;
	export let boldLetter: string | null = null;
</script>

<div class="image-result flex flex-col overflow-hidden">
	<img
		src={imageData.preview.url}
		alt={imageData.origin.title}
		class="h-full w-full rounded-2xl object-cover"
	/>
	<p class="w-full truncate text-xs text-[var(--text-secondary)]">
		<span class="font-bold capitalize">{boldLetter ?? ''}</span>
		{titleOverride ?? imageData.origin.title}
	</p>
	<p class="truncate text-xs text-[var(--text-primary)]">{imageData.origin.website.name}</p>
</div>
