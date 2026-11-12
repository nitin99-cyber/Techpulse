<script>
  import { page } from '$app/stores';

  let activeTab = $state('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sources', label: 'Sources' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'claims', label: 'Facts & Claims' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'angles', label: 'Angles' }
  ];
</script>

<div class="space-y-6">
  <header class="flex items-center justify-between">
    <div>
      <span class="text-xs uppercase tracking-wider text-pulse-400 font-medium">Research Workspace</span>
      <h1 class="text-2xl font-semibold text-white mt-1">Report: {$page.params.id}</h1>
    </div>
    <a
      href={`/scripts/${$page.params.id}`}
      class="px-4 py-2 rounded-lg bg-pulse-600 hover:bg-pulse-500 text-white text-sm font-medium transition"
    >
      Generate 3 Scripts
    </a>
  </header>

  <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
    {#each tabs as tab}
      <button
        type="button"
        onclick={() => (activeTab = tab.id)}
        class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition {activeTab === tab.id
          ? 'bg-pulse-600/20 text-pulse-300 border border-pulse-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 text-sm text-slate-400">
    Viewing <strong class="text-slate-200">{activeTab}</strong> section for research dossier <code class="text-pulse-300">{$page.params.id}</code>.
  </div>
</div>
