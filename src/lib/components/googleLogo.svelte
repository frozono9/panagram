<script lang="ts">
	export let showImagesText = true;
	let logoElement: HTMLImageElement;

	$: {
		if (logoElement) {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				logoElement.src =
					'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png';
			} else {
				logoElement.src =
					'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
			}
		}
	}
</script>

<div class="google-logo relative flex h-full flex-row items-center py-3">
	<img class="logo h-full max-w-[300px]" src="" alt="Google Logo" bind:this={logoElement} />
	{#if showImagesText}
		<h2 class="absolute right-1.5 bottom-4 text-sm text-[var(--accent-primary)]">Images</h2>
	{/if}
</div>
