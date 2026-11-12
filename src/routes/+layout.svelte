<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { Compass, Lightbulb, FileSearch, Clapperboard, Settings, Activity } from 'lucide-svelte';

  let { children } = $props();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/trends', label: 'Discover Trends', icon: Compass },
    { href: '/ideas', label: 'My Ideas', icon: Lightbulb },
    { href: '/research/sample', label: 'Research', icon: FileSearch },
    { href: '/scripts/sample', label: 'Script Studio', icon: Clapperboard },
    { href: '/settings', label: 'Settings', icon: Settings }
  ];
</script>

<div class="min-h-screen flex bg-slate-950 text-slate-100">
  <aside class="w-64 border-r border-slate-800/80 bg-slate-900/60 flex flex-col">
    <div class="px-6 py-5 border-b border-slate-800/80">
      <a href="/dashboard" class="flex items-center gap-2.5">
        <div class="h-8 w-8 rounded-lg bg-pulse-600 flex items-center justify-center font-bold text-white">
          TP
        </div>
        <div>
          <span class="font-semibold tracking-tight text-white block leading-none">TechPulse</span>
          <span class="text-[11px] text-slate-400">Content Intelligence</span>
        </div>
      </a>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1">
      {#each navItems as item}
        {@const active = $page.url.pathname.startsWith(item.href.split('/').slice(0, 2).join('/'))}
        {@const Icon = item.icon}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {active
            ? 'bg-pulse-600/20 text-pulse-300 border border-pulse-500/30'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}"
        >
          <Icon class="w-4 h-4" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-slate-800/80 text-xs text-slate-500">
      Phase 1 Engine • English (US/GB/CA/AU/DE)
    </div>
  </aside>

  <main class="flex-1 overflow-y-auto">
    <div class="max-w-7xl mx-auto p-6 md:p-8">
      {@render children()}
    </div>
  </main>
</div>
