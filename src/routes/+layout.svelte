<script lang="ts">
	import '../App.css';
	import { selectedLanguage, LANGUAGES } from '$lib/stores';
	let { children } = $props();
</script>

<svelte:head>
	<meta content="dark light" name="color-scheme" />
	<meta
		content="Google Images. The most comprehensive image search on the web."
		name="description"
	/>
	<link href="https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico" rel="icon" />
	<title>Google Images</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
	/>
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Main content -->
<main class="min-h-screen">
	{@render children()}
</main>

<!-- Footer -->
<footer class="bg-[var(--bg-footer)] border-t border-[var(--border-footer)] px-4 py-3">
	<div class="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
		<!-- Country/Location -->
		<div class="flex items-center">
			<span class="text-[var(--text-secondary)]">Spain</span>
		</div>
		
		<!-- Footer links and language selector -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
			<!-- Left side links -->
			<div class="flex flex-wrap items-center gap-6">
				<a href="#" class="hover:underline text-[var(--text-secondary)]">About</a>
				<a href="#" class="hover:underline text-[var(--text-secondary)]">Advertising</a>
				<a href="#" class="hover:underline text-[var(--text-secondary)]">Business</a>
				<a href="#" class="hover:underline text-[var(--text-secondary)]">How Search works</a>
			</div>
			
			<!-- Right side links and language -->
			<div class="flex flex-wrap items-center gap-6">
				<a href="#" class="hover:underline text-[var(--text-secondary)]">Privacy</a>
				<a href="#" class="hover:underline text-[var(--text-secondary)]">Terms</a>
				<a href="#" class="hover:underline text-[var(--text-secondary)]">Settings</a>
				
				<!-- Language selector -->
				<select 
					bind:value={$selectedLanguage}
					on:change={() => console.log('Language changed to:', $selectedLanguage)}
					class="bg-transparent border-none outline-none cursor-pointer text-[var(--text-secondary)] hover:underline"
					aria-label="Select language"
				>
					{#each Object.entries(LANGUAGES) as [code, name]}
						<option value={code} class="bg-[var(--bg-primary)] text-[var(--text-primary)]">{name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</footer>

<style>
	:global(:root) {
		--bg-footer: #f2f2f2;
		--border-footer: #dadce0;
	}
	
	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--bg-footer: #171717;
			--border-footer: #3c4043;
		}
	}
</style>
