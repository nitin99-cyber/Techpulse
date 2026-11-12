<script>
  import { onMount } from 'svelte';

  let statusData = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/system/status');
      statusData = await res.json();
    } catch {
      statusData = { success: false };
    }
  });
</script>

<div class="max-w-3xl space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-white">Settings & System Health</h1>
    <p class="text-sm text-slate-400 mt-1">
      Monitor Cloudflare D1, Queues, AI provider bindings, and regional collection rules.
    </p>
  </header>

  <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
    <h2 class="text-base font-medium text-white">Runtime Connectivity</h2>
    {#if statusData}
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
          <span class="text-slate-400">D1 Database</span>
          <span class={statusData.environment?.dbConnected ? 'text-emerald-400' : 'text-amber-400'}>
            {statusData.environment?.dbConnected ? 'Connected' : 'Not Bound'}
          </span>
        </div>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
          <span class="text-slate-400">Cloudflare Queue</span>
          <span class={statusData.environment?.queueConfigured ? 'text-emerald-400' : 'text-amber-400'}>
            {statusData.environment?.queueConfigured ? 'Configured' : 'Not Bound'}
          </span>
        </div>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
          <span class="text-slate-400">Gemini API Key</span>
          <span class={statusData.environment?.geminiConfigured ? 'text-emerald-400' : 'text-amber-400'}>
            {statusData.environment?.geminiConfigured ? 'Set' : 'Missing'}
          </span>
        </div>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
          <span class="text-slate-400">YouTube Data API</span>
          <span class={statusData.environment?.youtubeConfigured ? 'text-emerald-400' : 'text-amber-400'}>
            {statusData.environment?.youtubeConfigured ? 'Set' : 'Missing'}
          </span>
        </div>
      </div>
    {:else}
      <p class="text-sm text-slate-400">Checking system status...</p>
    {/if}
  </div>
</div>
