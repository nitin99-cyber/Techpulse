<script>
  import { Compass, Lightbulb, FileSearch, CheckCircle2, Clock } from 'lucide-svelte';

  const summaryCards = [
    { label: "Today's Opportunities", value: '0', hint: 'Ready for evaluation', icon: Compass },
    { label: 'Active Ideas', value: '0', hint: 'Custom evergreen pipeline', icon: Lightbulb },
    { label: 'Research Reports', value: '0', hint: 'Fact-checked dossiers', icon: FileSearch },
    { label: 'Approved Scripts', value: '0', hint: '~20s Shorts ready', icon: CheckCircle2 }
  ];
</script>

<div class="space-y-8">
  <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-semibold text-white tracking-tight">Content Intelligence Dashboard</h1>
      <p class="text-sm text-slate-400 mt-1">
        Discover global tech stories, evaluate original video ideas, and produce verified ~20s Shorts scripts.
      </p>
    </div>
    <div class="flex gap-3">
      <a
        href="/ideas"
        class="px-4 py-2 rounded-lg bg-pulse-600 hover:bg-pulse-500 text-white text-sm font-medium transition"
      >
        + Evaluate My Idea
      </a>
      <a
        href="/trends"
        class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
      >
        Browse Trends
      </a>
    </div>
  </header>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each summaryCards as card}
      {@const Icon = card.icon}
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-5">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>{card.label}</span>
          <Icon class="w-4 h-4 text-pulse-400" />
        </div>
        <div class="mt-3 text-2xl font-semibold text-white">{card.value}</div>
        <div class="mt-1 text-xs text-slate-500">{card.hint}</div>
      </div>
    {/each}
  </section>

  <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6">
      <h2 class="text-base font-medium text-white">Low-Competition Opportunities</h2>
      <p class="text-sm text-slate-400 mt-2">
        Run the news collector or configure your D1 database to surface stories across US, UK, CA, AU, and DE markets.
      </p>
    </div>
    <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6">
      <div class="flex items-center gap-2">
        <Clock class="w-4 h-4 text-slate-400" />
        <h2 class="text-base font-medium text-white">Pending Background Jobs</h2>
      </div>
      <p class="text-sm text-slate-400 mt-2">
        No background research or script generation jobs are currently queued.
      </p>
    </div>
  </section>
</div>
