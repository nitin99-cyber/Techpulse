import { normalizeUrl, simpleHash } from '../utils/text.js';

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';

/**
 * Collect top technical stories from Hacker News Firebase API.
 * @param {{ limit?: number }} params
 */
export async function collectHackerNews({ limit = 20 } = {}) {
  const idsRes = await fetch(`${HN_BASE}/topstories.json`);
  if (!idsRes.ok) {
    throw new Error(`Hacker News topstories failed with status ${idsRes.status}`);
  }

  const ids = (await idsRes.json()).slice(0, limit);
  const items = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${HN_BASE}/item/${id}.json`);
      return res.ok ? res.json() : null;
    })
  );

  return items
    .filter((item) => item && item.title && item.url)
    .map((item) => ({
      title: item.title.trim(),
      sourceUrl: item.url,
      normalizedUrl: normalizeUrl(item.url),
      publisher: 'Hacker News',
      publishedAt: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
      sourceType: 'HN',
      marketCode: 'GLOBAL',
      contentHash: simpleHash(item.title),
      meta: {
        points: item.score || 0,
        comments: item.descendants || 0
      }
    }));
}
