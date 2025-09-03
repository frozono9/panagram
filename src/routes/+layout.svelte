<script lang="ts">
	import '../app.css';
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

{@render children()}
