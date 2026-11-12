import { ScriptBatchOutputSchema } from '../validation/schemas.js';
import { countWords, estimateSpokenDuration } from '../utils/text.js';

const SYSTEM_INSTRUCTION = `You are the Script Writer for TechPulse.
Convert the verified research report into 3 distinct short-form YouTube Shorts script approaches:
1. FAST_PACED (Breaking-news / punchy)
2. CURIOSITY (Storytelling / intriguing hook)
3. EXPLANATORY (Clear educational breakdown)

Target length: ~40 to 50 spoken words (~20 seconds spoken).
Each script MUST NOT introduce facts absent from the approved research report.
Return strict JSON:
{
  "scripts": [
    {
      "approach": "FAST_PACED | CURIOSITY | EXPLANATORY",
      "hook": "opening 1-sentence hook",
      "body": "core explanation",
      "closing": "memorable closing line",
      "visual_direction": "B-roll and on-screen text cues",
      "source_ids": ["source_id"]
    }
  ]
}`;

/**
 * Generate three short-form script versions grounded in verified research.
 * @param {import('../providers/gemini.js').GeminiProvider} aiProvider
 * @param {{ report: object, verifiedClaims: Array<object>, targetDurationSeconds?: number, revisionInstruction?: string }} input
 */
export async function runScriptWriter(
  aiProvider,
  { report, verifiedClaims, targetDurationSeconds = 20, revisionInstruction = '' }
) {
  const targetWords = Math.round(targetDurationSeconds * 2.4);
  const prompt = `Generate 3 script approaches targeting ~${targetDurationSeconds} seconds (~${targetWords} words total across hook+body+closing).
${revisionInstruction ? `Revision request from creator: ${revisionInstruction}` : ''}

<VERIFIED_CLAIMS>
${JSON.stringify(verifiedClaims, null, 2)}
</VERIFIED_CLAIMS>

<RESEARCH_REPORT>
${JSON.stringify(report, null, 2)}
</RESEARCH_REPORT>`;

  const { data, usage } = await aiProvider.generateJson({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt
  });

  const parsed = ScriptBatchOutputSchema.parse(data);
  const enrichedScripts = parsed.scripts.map((s) => {
    const fullSpoken = `${s.hook} ${s.body} ${s.closing}`.trim();
    return {
      ...s,
      wordCount: countWords(fullSpoken),
      estimatedDurationSeconds: estimateSpokenDuration(fullSpoken)
    };
  });

  return { scripts: enrichedScripts, usage };
}
