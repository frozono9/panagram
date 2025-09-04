<script lang="ts">
	import { onMount } from 'svelte';
	
	let category = '';
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			// First try the server endpoint
			const response = await fetch('/api/message');
			if (response.ok) {
				let categoryValue = await response.text();
				
				// If server returns default, try localStorage
				if (categoryValue === 'No category searched yet' && typeof window !== 'undefined') {
					const localCategory = localStorage.getItem('lastSearchedCategory');
					if (localCategory) {
						categoryValue = localCategory;
						// Update server with localStorage value
						fetch('/api/message', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ category: localCategory })
						}).catch(() => {}); // Silent fail
					}
				}
				
				category = categoryValue;
			} else {
				// Fallback to localStorage
				if (typeof window !== 'undefined') {
					category = localStorage.getItem('lastSearchedCategory') || 'No category searched yet';
				} else {
					category = 'No category searched yet';
				}
			}
		} catch (err) {
			error = 'Error fetching category';
			console.error('Error:', err);
			// Final fallback
			if (typeof window !== 'undefined') {
				category = localStorage.getItem('lastSearchedCategory') || 'No category searched yet';
			} else {
				category = 'No category searched yet';
			}
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Latest Searched Category</title>
</svelte:head>

<div class="container">
	<h1>Latest Searched Category</h1>
	
	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<p class="category">{category}</p>
	{/if}
	
	<a href="/" class="back-link">← Back to Home</a>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
	}
	
	h1 {
		color: #333;
		margin-bottom: 2rem;
	}
	
	.category {
		font-size: 1.5rem;
		font-weight: bold;
		color: #4285f4;
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 8px;
		margin: 2rem 0;
	}
	
	.error {
		color: #d73027;
		font-weight: bold;
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
