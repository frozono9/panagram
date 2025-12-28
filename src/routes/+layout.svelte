<script lang="ts">
	import '../App.css';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	let code = $state('');
	let error = $state(false);

	async function submitCode(e: Event) {
		e.preventDefault();
		const res = await fetch('/api/verify-code', {
			method: 'POST',
			body: JSON.stringify({ code }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (res.ok) {
			window.location.reload();
		} else {
			error = true;
		}
	}
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

{#if data.hasAccess}
	{@render children()}
{:else}
	<div class="access-container">
		<div class="access-card">
			<h1>Enter Access Code</h1>
			<form onsubmit={submitCode}>
				<input
					type="text"
					bind:value={code}
					placeholder="Enter code..."
					class:error={error}
				/>
				{#if error}
					<p class="error-msg">Incorrect code. Please try again.</p>
				{/if}
				<button type="submit">Submit</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.access-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #202124; /* Dark background like Google dark mode */
		color: #e8eaed;
		font-family: 'Poppins', sans-serif;
	}

	.access-card {
		background-color: #303134;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
		text-align: center;
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		margin-bottom: 1rem;
		border: 1px solid #5f6368;
		border-radius: 4px;
		background-color: #202124;
		color: white;
		font-size: 1rem;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #8ab4f8;
	}

	input.error {
		border-color: #f28b82;
	}

	.error-msg {
		color: #f28b82;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	button {
		background-color: #8ab4f8;
		color: #202124;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		width: 100%;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #aecbfa;
	}
</style>
