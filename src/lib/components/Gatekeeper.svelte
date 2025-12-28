<script lang="ts">
  import { onMount } from 'svelte';

  let code = $state('');
  let error = $state('');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (code === 'ANAGRAM2026') {
      // Set cookie that expires in 1 year
      const d = new Date();
      d.setTime(d.getTime() + (365*24*60*60*1000));
      const expires = "expires="+ d.toUTCString();
      document.cookie = "site_access=granted;" + expires + ";path=/";
      
      // Reload to let the server/layout know we are authenticated
      window.location.reload();
    } else {
      error = 'Incorrect code. Please try again.';
    }
  }
</script>

<div class="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-md bg-[#202124] p-8 rounded-lg shadow-lg border border-[#3c4043]">
    <h1 class="text-2xl font-bold text-white mb-6 text-center">Enter Access Code</h1>
    
    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
      <div>
        <input
          type="text"
          bind:value={code}
          placeholder="Enter code"
          class="w-full px-4 py-3 bg-[#303134] border border-[#3c4043] rounded text-white focus:outline-none focus:border-[#8ab4f8] transition-colors"
        />
        {#if error}
          <p class="text-red-400 text-sm mt-2">{error}</p>
        {/if}
      </div>
      
      <button
        type="submit"
        class="w-full bg-[#8ab4f8] text-[#202124] font-semibold py-3 rounded hover:bg-[#aecbfa] transition-colors"
      >
        Enter
      </button>
    </form>
  </div>
</div>
