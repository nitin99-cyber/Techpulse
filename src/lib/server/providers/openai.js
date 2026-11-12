/**
 * Optional OpenAI secondary review provider (PRD Section 7.9).
 * Used selectively for independent second-opinion reviews when configured.
 */
export class OpenAIProvider {
  /**
   * @param {{ apiKey?: string, model?: string }} config
   */
  constructor({ apiKey, model = 'gpt-4o-mini' } = {}) {
    this.apiKey = apiKey || '';
    this.model = model;
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * @param {{ systemInstruction: string, prompt: string }} params
   */
  async review({ systemInstruction, prompt }) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI request failed with status ${res.status}`);
    }

    const json = await res.json();
    return {
      data: JSON.parse(json.choices?.[0]?.message?.content || '{}'),
      usage: {
        inputTokens: json.usage?.prompt_tokens || 0,
        outputTokens: json.usage?.completion_tokens || 0
      }
    };
  }
}
