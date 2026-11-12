import { normalizeUrl, simpleHash } from '../utils/text.js';

/**
 * Collect emerging open-source repositories via GitHub REST API.
 * @param {{ token?: string, query?: string, perPage?: number }} params
 */
export async function collectGithubTrending({ token = '', query = 'stars:>500 pushed:>2026-01-01', perPage = 15 } = {}) {
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', 'updated');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('per_page', String(perPage));

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TechPulse-Collector/1.0'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`GitHub search failed with status ${res.status}`);
  }

  const json = await res.json();
  return (json.items || []).map((repo) => ({
    title: `${repo.full_name}: ${repo.description || 'Open-source repository'}`,
    sourceUrl: repo.html_url,
    normalizedUrl: normalizeUrl(repo.html_url),
    publisher: 'GitHub',
    publishedAt: repo.pushed_at || new Date().toISOString(),
    sourceType: 'GITHUB',
    marketCode: 'GLOBAL',
    contentHash: simpleHash(repo.full_name),
    meta: {
      stars: repo.stargazers_count || 0,
      language: repo.language || 'Unknown'
    }
  }));
}
