import { classifyCompetition } from '../scoring/engine.js';

/**
 * Analyze YouTube competitor videos for saturation, dominant narratives, and gaps.
 * @param {import('../providers/gemini.js').GeminiProvider} aiProvider
 * @param {{ topicTitle: string, videos: Array<object> }} input
 */
export async function runCompetitorAnalyst(aiProvider, { topicTitle, videos }) {
  const videoCount = videos.length;
  const avgViewsPerHour =
    videoCount > 0
      ? Number((videos.reduce((acc, v) => acc + (v.viewsPerHour || 0), 0) / videoCount).toFixed(2))
      : 0;

  if (videoCount === 0) {
    return {
      summary: {
        competitionLevel: 'LOW',
        videoCount: 0,
        avgViewsPerHour: 0,
        dominantNarratives: [],
        overusedHooks: [],
        contentGaps: ['No recent competing YouTube videos found for this exact query.']
      },
      usage: { inputTokens: 0, outputTokens: 0 }
    };
  }

  const prompt = `Analyze these competing YouTube videos for the topic "${topicTitle}".
Return strict JSON:
{
  "dominant_narratives": ["narrative 1"],
  "overused_hooks": ["hook pattern 1"],
  "content_gaps": ["unexplored angle 1"],
  "narrative_overlap_ratio": 0.0 to 1.0
}
<VIDEOS>
${JSON.stringify(videos.slice(0, 20), null, 2)}
</VIDEOS>`;

  const { data, usage } = await aiProvider.generateJson({
    systemInstruction: 'You are the YouTube Competitor Analyst for TechPulse. Identify saturation and unexplored angles.',
    prompt
  });

  const competitionLevel = classifyCompetition({
    videoCount,
    avgViewsPerHour,
    narrativeOverlapRatio: Number(data.narrative_overlap_ratio || 0.5)
  });

  return {
    summary: {
      competitionLevel,
      videoCount,
      avgViewsPerHour,
      dominantNarratives: data.dominant_narratives || [],
      overusedHooks: data.overused_hooks || [],
      contentGaps: data.content_gaps || []
    },
    usage
  };
}
