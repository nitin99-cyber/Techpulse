/**
 * Text normalization, URL canonicalization, and script timing utilities.
 */

/**
 * Normalize a URL by removing tracking parameters and trailing slashes.
 * @param {string} rawUrl
 * @returns {string}
 */
export function normalizeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl.trim());
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'ref'
    ];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }
    parsed.hash = '';
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return (rawUrl || '').trim();
  }
}

/**
 * Compute a lightweight deterministic hash for deduplicating article text/titles.
 * Uses Web Crypto API / FNV-1a fallback compatible with Cloudflare Workers.
 * @param {string} input
 * @returns {string}
 */
export function simpleHash(input) {
  const str = (input || '').toLowerCase().trim();
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Count spoken words in a script string.
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Estimate spoken duration in seconds for short-form narration.
 * Average YouTube Shorts pacing is ~145 words per minute (~2.42 words/sec).
 * @param {string} text
 * @param {number} [wordsPerSecond=2.4]
 * @returns {number}
 */
export function estimateSpokenDuration(text, wordsPerSecond = 2.4) {
  const words = countWords(text);
  if (words === 0) return 0;
  return Number((words / wordsPerSecond).toFixed(1));
}
