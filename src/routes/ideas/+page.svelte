<script>
  let title = $state('');
  let context = $state('');
  let targetAudience = $state('International English-speaking tech viewers');
  let preferredAngle = $state('');
  let emphasize = $state('');
  let avoid = $state('');
  let submitting = $state(false);
  let feedbackMsg = $state('');

  async function submitIdea(e) {
    e.preventDefault();
    submitting = true;
    feedbackMsg = '';

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, context, targetAudience, preferredAngle, emphasize, avoid })
      });
      const json = await res.json();
      if (json.success) {
        feedbackMsg = `Idea queued for evaluation (Job ID: ${json.jobId})`;
        title = '';
        context = '';
      } else {
        feedbackMsg = json.error?.message || 'Submission failed';
      }
    } catch (err) {
      feedbackMsg = err.message;
    } finally {
      submitting = false;
    }
  }
</script>

<div class="max-w-3xl space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-white">Evaluate My Idea</h1>
    <p class="text-sm text-slate-400 mt-1">
      Submit an evergreen or original video idea (e.g., "Why are HDDs still used when SSDs are faster?") to check YouTube saturation, differentiation angles, and evergreen value.
    </p>
  </header>

  <form onsubmit={submitIdea} class="space-y-4 rounded-xl bg-slate-900/70 border border-slate-800 p-6">
    <div>
      <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-title">Topic or Question *</label>
      <input
        id="idea-title"
        type="text"
        required
        bind:value={title}
        placeholder="e.g., Why are HDDs still used when SSDs are faster?"
        class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-context">Additional Context</label>
      <textarea
        id="idea-context"
        rows="3"
        bind:value={context}
        placeholder="Why you think this matters or specific facts to check..."
        class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-audience">Target Audience</label>
        <input
          id="idea-audience"
          type="text"
          bind:value={targetAudience}
          class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-angle">Preferred Angle</label>
        <input
          id="idea-angle"
          type="text"
          bind:value={preferredAngle}
          placeholder="e.g., Data center economics"
          class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-emphasize">Things to Emphasize</label>
        <input
          id="idea-emphasize"
          type="text"
          bind:value={emphasize}
          placeholder="e.g., Cost per terabyte, archival reliability"
          class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1" for="idea-avoid">Things to Avoid</label>
        <input
          id="idea-avoid"
          type="text"
          bind:value={avoid}
          placeholder="e.g., Overly dense hardware jargon"
          class="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
        />
      </div>
    </div>

    <div class="pt-2 flex items-center gap-4">
      <button
        type="submit"
        disabled={submitting}
        class="px-5 py-2.5 rounded-lg bg-pulse-600 hover:bg-pulse-500 disabled:opacity-50 text-white text-sm font-medium transition"
      >
        {submitting ? 'Submitting...' : 'Evaluate Idea'}
      </button>
      {#if feedbackMsg}
        <span class="text-sm text-pulse-300">{feedbackMsg}</span>
      {/if}
    </div>
  </form>
</div>
