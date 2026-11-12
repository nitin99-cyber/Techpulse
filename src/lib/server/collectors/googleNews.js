import { normalizeUrl, simpleHash } from '../utils/text.js';

const MARKET_CONFIG = {
  US: { hl: 'en-US', gl: 'US', ceid: 'US:en' },
  GB: { hl: 'en-GB', gl: 'GB', ceid: 'GB:en' },
  CA: { hl: 'en-CA', gl: 'CA', ceid: 'CA:en' },
  AU: { hl: 'en-AU', gl: 'AU', ceid: 'AU:en' },
  DE: { hl: 'en-DE', gl: 'DE', ceid: 'DE:en' }
};

/**
 * Lightweight RSS XML item parser compatible with Cloudflare Workers.
 * @param {string} xml
 * @param {string} marketCode
 */
function parseRssItems(xml, marketCode) {
  const items = [];
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  for (const rawItem of itemMatches) {
    const title = rawItem.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ||
      rawItem.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link = rawItem.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = rawItem.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const source = rawItem.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'Google News';

    if (!title || !link) continue;

    const cleanTitle = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
    const normalizedUrl = normalizeUrl(link);

    items.push({
      title: cleanTitle,
      sourceUrl: link.trim(),
      normalizedUrl,
      publisher: source.trim(),
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      sourceType: 'RSS',
      marketCode,
      contentHash: simpleHash(cleanTitle)
    });
  }
  return items;
}

/**
 * Fetch technology news from Google News RSS for a given market and query.
 * @param {{ query?: string, marketCode?: string }} params
 */
export async function collectGoogleNews({ query = 'technology', marketCode = 'US' } = {}) {
  const cfg = MARKET_CONFIG[marketCode] || MARKET_CONFIG.US;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${cfg.hl}&gl=${cfg.gl}&ceid=${cfg.ceid}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'TechPulse-Collector/1.0' }
  });
  if (!res.ok) {
    throw new Error(`Google News RSS failed (${res.status}) for ${marketCode}`);
  }

  const xml = await res.text();
  return parseRssItems(xml, marketCode);
}
