<script lang="ts">
	import { onMount } from 'svelte';
	
	let triggerState = 'false';
	let category = 'No category searched yet';
	let loading = true;

	async function checkTrigger() {
		try {
			// Get timestamp from localStorage
			const timestamp = localStorage.getItem('triggerTimestamp');
			const url = timestamp ? `/api/trigger?timestamp=${timestamp}` : '/api/trigger';
			
			const response = await fetch(url);
			if (response.ok) {
				triggerState = await response.text();
			}
		} catch (err) {
			console.error('Error checking trigger:', err);
		}
	}

	async function checkCategory() {
		try {
			// Get from localStorage first
			const localCategory = localStorage.getItem('lastSearchedCategory');
			if (localCategory) {
				category = localCategory;
			} else {
				const response = await fetch('/api/message');
				if (response.ok) {
					category = await response.text();
				}
			}
		} catch (err) {
			console.error('Error checking category:', err);
		}
	}

	onMount(() => {
		const init = async () => {
			await checkCategory();
			await checkTrigger();
			loading = false;
		};
		
		init();
		
		// Check trigger state every 500ms
		const interval = setInterval(checkTrigger, 500);
		
		// Cleanup on unmount
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>API Test - Trigger and Message</title>
</svelte:head>

<div class="container">
	<h1>API Test Page</h1>
	
	{#if loading}
		<p>Loading...</p>
	{:else}
		<div class="status">
			<h2>Current Status</h2>
			<p><strong>Category:</strong> {category}</p>
			<p><strong>Trigger State:</strong> <span class={triggerState === 'true' ? 'active' : 'inactive'}>{triggerState}</span></p>
		</div>
		
		<div class="buttons">
			<button on:click={checkCategory}>Refresh Category</button>
			<button on:click={checkTrigger}>Check Trigger</button>
		</div>
		
		<div class="instructions">
			<h3>How to test:</h3>
			<ol>
				<li>Go to the <a href="/search?q=test">search page</a> with any search term</li>
				<li>Come back to this page</li>
				<li>The category should update and trigger should be "true" for 2 seconds</li>
			</ol>
		</div>
	{/if}
	
	<a href="/" class="back-link">← Back to Home</a>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
	}
	
	h1 {
		color: #333;
		margin-bottom: 2rem;
	}
	
	.status {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 8px;
		margin: 1rem 0;
	}
	
	.active {
		color: #28a745;
		font-weight: bold;
	}
	
	.inactive {
		color: #6c757d;
	}
	
	.buttons {
		margin: 1rem 0;
	}
	
	button {
		background: #4285f4;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		margin-right: 0.5rem;
		cursor: pointer;
	}
	
	button:hover {
		background: #3367d6;
	}
	
	.instructions {
		background: #e3f2fd;
		padding: 1rem;
		border-radius: 8px;
		margin: 1rem 0;
	}
	
	.back-link {
		display: inline-block;
		margin-top: 2rem;
		color: #4285f4;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid #4285f4;
		border-radius: 4px;
		transition: background-color 0.3s;
	}
	
	.back-link:hover {
		background-color: #4285f4;
		color: white;
	}
</style>
