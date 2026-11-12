const SYSTEM_INSTRUCTION = `You are the Topic Evaluator for TechPulse.
Evaluate an original creator video idea independently of breaking news trends.
Return strict JSON:
{
  "recommendation": "MAKE_IT | MODIFY_ANGLE | WAIT_FOR_TIMING | REJECT_IT",
  "reasoning": "clear explanation",
  "evergreen_score": 0 to 100,
  "storytelling_potential": 0 to 100,
  "suggested_angles": ["angle 1", "angle 2", "angle 3"],
  "evidence_limitations": ["any missing data or uncertainties"],
  "confidence": 0.0 to 1.0
}
Never invent search volumes or fabricate view predictions.`;

/**
 * Evaluate a user-submitted idea alongside optional competitor video samples.
 * @param {import('../providers/gemini.js').GeminiProvider} aiProvider
 * @param {{ idea: object, competitors?: Array<object> }} input
 */
export async function runTopicEvaluator(aiProvider, { idea, competitors = [] }) {
  const prompt = `Evaluate this creator idea for a ~20 second YouTube Short:
<IDEA_INPUT>
${JSON.stringify(idea, null, 2)}
</IDEA_INPUT>

<COMPETITOR_SAMPLE>
${JSON.stringify(competitors.slice(0, 15), null, 2)}
</COMPETITOR_SAMPLE>`;

  const { data, usage } = await aiProvider.generateJson({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt
  });

  return { evaluation: data, usage };
}
