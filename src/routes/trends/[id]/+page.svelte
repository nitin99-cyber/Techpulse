<script>
  import { page } from '$app/stores';
</script>

<div class="space-y-6">
  <header>
    <span class="text-xs uppercase tracking-wider text-pulse-400 font-medium">Topic Detail</span>
    <h1 class="text-2xl font-semibold text-white mt-1">Topic: {$page.params.id}</h1>
  </header>

  <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 text-sm text-slate-400">
    Select this topic to launch deep research and competitor analysis.
  </div>
</div>
