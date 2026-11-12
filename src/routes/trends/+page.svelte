<script>
  let selectedCountry = $state('US');
  let selectedCategory = $state('ALL');

  const countries = ['US', 'GB', 'CA', 'AU', 'DE'];
  const categories = [
    'ALL',
    'Artificial Intelligence',
    'Cybersecurity',
    'Consumer Technology',
    'Programming and Developer Tools',
    'Space and Emerging Technology'
  ];
</script>

<div class="space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-white">Global Trend Discovery</h1>
    <p class="text-sm text-slate-400 mt-1">
      Clustered technology stories scored by cross-source confirmation, velocity, and YouTube competition gap.
    </p>
  </header>

  <div class="flex flex-wrap gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
    <select
      bind:value={selectedCountry}
      class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
    >
      {#each countries as code}
        <option value={code}>Market: {code}</option>
      {/each}
    </select>

    <select
      bind:value={selectedCategory}
      class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
    >
      {#each categories as cat}
        <option value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
      {/each}
    </select>
  </div>

  <div class="rounded-xl bg-slate-900/50 border border-dashed border-slate-800 p-10 text-center text-sm text-slate-400">
    No clustered trends stored yet. Trigger the scheduler worker or execute D1 migrations to begin collecting feeds.
  </div>
</div>
