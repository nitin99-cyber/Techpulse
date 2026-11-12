import { normalizeUrl, simpleHash } from '../utils/text.js';

/**
 * Query GDELT DOC 2.0 API for global cross-source technology news coverage.
 * @param {{ query?: string, maxRecords?: number }} params
 */
export async function collectGdeltNews({ query = 'technology OR cybersecurity OR AI', maxRecords = 25 } = {}) {
  const url = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
  url.searchParams.set('query', `${query} sourcelang:english`);
  url.searchParams.set('mode', 'ArtList');
  url.searchParams.set('maxrecords', String(maxRecords));
  url.searchParams.set('format', 'json');
  url.searchParams.set('sort', 'DateDesc');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`GDELT API failed with status ${res.status}`);
  }

  const json = await res.json();
  return (json.articles || []).map((article) => ({
    title: (article.title || '').trim(),
    sourceUrl: article.url,
    normalizedUrl: normalizeUrl(article.url),
    publisher: article.domain || 'GDELT',
    publishedAt: article.seendate ? new Date(article.seendate).toISOString() : new Date().toISOString(),
    sourceType: 'GDELT',
    marketCode: article.sourcecountry || 'GLOBAL',
    contentHash: simpleHash(article.title || article.url)
  }));
}
