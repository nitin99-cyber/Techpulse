/**
 * Structured logger that omits secrets and sensitive fields.
 */

const REDACTED_KEYS = new Set([
  'apiKey',
  'api_key',
  'GEMINI_API_KEY',
  'YOUTUBE_API_KEY',
  'OPENAI_API_KEY',
  'GITHUB_TOKEN',
  'authorization',
  'token',
  'password'
]);

/**
 * @param {Record<string, unknown>} obj
 * @returns {Record<string, unknown>}
 */
function sanitizeMeta(obj = {}) {
  const safe = {};
  for (const [k, v] of Object.entries(obj)) {
    if (REDACTED_KEYS.has(k) || k.toLowerCase().includes('secret') || k.toLowerCase().includes('key')) {
      safe[k] = '[REDACTED]';
    } else {
      safe[k] = v;
    }
  }
  return safe;
}

export const logger = {
  info(event, meta = {}) {
    console.log(JSON.stringify({ level: 'INFO', ts: new Date().toISOString(), event, ...sanitizeMeta(meta) }));
  },
  warn(event, meta = {}) {
    console.warn(JSON.stringify({ level: 'WARN', ts: new Date().toISOString(), event, ...sanitizeMeta(meta) }));
  },
  error(event, error, meta = {}) {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        ts: new Date().toISOString(),
        event,
        errorMessage: error instanceof Error ? error.message : String(error),
        ...sanitizeMeta(meta)
      })
    );
  }
};
