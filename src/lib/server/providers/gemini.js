import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

/**
 * Primary Gemini API provider adapter (PRD Section 7.9).
 * Model ID is configurable via env.GEMINI_MODEL and never hardcoded as a rigid dependency.
 */
export class GeminiProvider {
  /**
   * @param {{ apiKey: string, model?: string }} config
   */
  constructor({ apiKey, model = 'gemini-2.5-flash' }) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing.');
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  /**
   * Generate structured JSON output from Gemini.
   * @param {{ systemInstruction: string, prompt: string, maxOutputTokens?: number }} params
   * @returns {Promise<{ data: any, usage: { inputTokens: number, outputTokens: number } }>}
   */
  async generateJson({ systemInstruction, prompt, maxOutputTokens = 4096 }) {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          maxOutputTokens,
          temperature: 0.3
        }
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error('Gemini returned an empty response.');
      }

      const data = JSON.parse(rawText);
      const usage = {
        inputTokens: response.usageMetadata?.promptTokenCount || 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount || 0
      };

      return { data, usage };
    } catch (err) {
      logger.error('GEMINI_GENERATION_FAILED', err, { model: this.model });
      throw err;
    }
  }
}
