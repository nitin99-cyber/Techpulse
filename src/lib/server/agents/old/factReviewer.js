const SYSTEM_INSTRUCTION = `You are the Fact Reviewer for TechPulse.
Audit extracted factual claims against the source excerpts.
Return strict JSON:
{
  "reviewed_claims": [
    {
      "claim_text": "string",
      "claim_status": "VERIFIED | SUPPORTED | DISPUTED | UNVERIFIED | OPINION | OUTDATED",
      "confidence": 0.0 to 1.0,
      "source_ids": ["id"],
      "notes": "explanation of evidence or dispute"
    }
  ]
}
A claim is NOT verified merely because a model or single blog repeats it. Distinguish verified facts from allegations.`;

/**
 * Verify and classify claims extracted during research.
 * @param {import('../providers/gemini.js').GeminiProvider} aiProvider
 * @param {{ claims: Array<object>, sources: Array<object> }} input
 */
export async function runFactReviewer(aiProvider, { claims, sources }) {
  const prompt = `Audit these claims against the collected sources.
<CLAIMS>
${JSON.stringify(claims, null, 2)}
</CLAIMS>

<SOURCE_DATA>
${JSON.stringify(sources, null, 2)}
</SOURCE_DATA>`;

  const { data, usage } = await aiProvider.generateJson({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt
  });

  return { reviewedClaims: data.reviewed_claims || [], usage };
}
