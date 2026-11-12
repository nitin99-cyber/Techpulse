<script>
  import { page } from '$app/stores';

  const approaches = [
    {
      key: 'FAST_PACED',
      label: '1. Breaking-News / Fast-Paced',
      hook: 'Sample hook ready once research report is approved.',
      body: 'Spoken ~40–50 words grounded strictly in verified claims.',
      closing: 'Concise payoff line.',
      words: 0,
      duration: '0.0s'
    },
    {
      key: 'CURIOSITY',
      label: '2. Curiosity / Storytelling',
      hook: 'Sample hook ready once research report is approved.',
      body: 'Narrative-driven ~40–50 words highlighting the content gap.',
      closing: 'Thought-provoking closing question.',
      words: 0,
      duration: '0.0s'
    },
    {
      key: 'EXPLANATORY',
      label: '3. Educational / Explanatory',
      hook: 'Sample hook ready once research report is approved.',
      body: 'Clear non-jargon explanation of why it matters.',
      closing: 'Memorable takeaway.',
      words: 0,
      duration: '0.0s'
    }
  ];
</script>

<div class="space-y-6">
  <header>
    <span class="text-xs uppercase tracking-wider text-pulse-400 font-medium">Script Studio</span>
    <h1 class="text-2xl font-semibold text-white mt-1">Short-Form Scripts: {$page.params.id}</h1>
    <p class="text-sm text-slate-400 mt-1">Target: ~20 seconds spoken (~40–50 words), verified against approved claims.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    {#each approaches as item}
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-pulse-300">{item.label}</h2>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{item.duration} • {item.words}w</span>
          </div>
          <div>
            <span class="text-[11px] uppercase tracking-wider text-slate-500">Hook</span>
            <p class="text-sm text-slate-200 mt-0.5">{item.hook}</p>
          </div>
          <div>
            <span class="text-[11px] uppercase tracking-wider text-slate-500">Body</span>
            <p class="text-sm text-slate-300 mt-0.5">{item.body}</p>
          </div>
          <div>
            <span class="text-[11px] uppercase tracking-wider text-slate-500">Closing</span>
            <p class="text-sm text-slate-200 mt-0.5">{item.closing}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex gap-2">
          <button
            type="button"
            class="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
          >
            Revise
          </button>
          <button
            type="button"
            class="flex-1 px-3 py-1.5 rounded-lg bg-pulse-600 hover:bg-pulse-500 text-xs font-medium text-white transition"
          >
            Approve
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
