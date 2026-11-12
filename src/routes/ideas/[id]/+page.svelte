<script>
  import { page } from '$app/stores';
</script>

<div class="space-y-6">
  <header>
    <span class="text-xs uppercase tracking-wider text-pulse-400 font-medium">Idea Evaluation</span>
    <h1 class="text-2xl font-semibold text-white mt-1">Idea: {$page.params.id}</h1>
  </header>

  <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 text-sm text-slate-400">
    Evaluation results, YouTube saturation analysis, and editorial recommendation will appear here once the job completes.
  </div>
</div>
