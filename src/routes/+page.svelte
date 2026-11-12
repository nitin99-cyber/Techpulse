<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/dashboard', { replaceState: true });
  });
</script>

<div class="flex items-center justify-center h-64 text-slate-400 text-sm">
  Loading TechPulse workspace...
</div>
