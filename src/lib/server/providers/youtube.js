import { logger } from '../utils/logger.js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube Data API v3 adapter (PRD Section 6.3 & 9).
 * Designed around quota conservation and computing derived velocity metrics.
 */
export class YouTubeProvider {
  /**
   * @param {{ apiKey: string }} config
   */
  constructor({ apiKey }) {
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is missing.');
    }
    this.apiKey = apiKey;
  }

  /**
   * Search YouTube videos by topic query and fetch public stats in two batched calls.
   * @param {{ query: string, regionCode?: string, maxResults?: number, publishedAfter?: string }} params
   * @returns {Promise<Array<object>>}
   */
  async searchCompetitors({ query, regionCode = 'US', maxResults = 15, publishedAfter }) {
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('regionCode', regionCode);
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('maxResults', String(Math.min(maxResults, 25)));
    if (publishedAfter) {
      searchUrl.searchParams.set('publishedAfter', publishedAfter);
    }
    searchUrl.searchParams.set('key', this.apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      logger.error('YOUTUBE_SEARCH_FAILED', new Error(errText), { status: searchRes.status });
      throw new Error(`YouTube search.list failed with status ${searchRes.status}`);
    }

    const searchJson = await searchRes.json();
    const items = searchJson.items || [];
    const videoIds = items.map((item) => item.id?.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return [];
    }

    const statsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    statsUrl.searchParams.set('part', 'snippet,statistics,contentDetails');
    statsUrl.searchParams.set('id', videoIds.join(','));
    statsUrl.searchParams.set('key', this.apiKey);

    const statsRes = await fetch(statsUrl.toString());
    if (!statsRes.ok) {
      const errText = await statsRes.text();
      logger.error('YOUTUBE_VIDEOS_FAILED', new Error(errText), { status: statsRes.status });
      throw new Error(`YouTube videos.list failed with status ${statsRes.status}`);
    }

    const statsJson = await statsRes.json();
    const now = Date.now();

    return (statsJson.items || []).map((video) => {
      const views = Number(video.statistics?.viewCount || 0);
      const likes = Number(video.statistics?.likeCount || 0);
      const comments = Number(video.statistics?.commentCount || 0);
      const publishedAt = video.snippet?.publishedAt;
      const hoursSincePublish = publishedAt
        ? Math.max(1, (now - new Date(publishedAt).getTime()) / (1000 * 60 * 60))
        : 1;

      return {
        videoId: video.id,
        channelId: video.snippet?.channelId || '',
        channelTitle: video.snippet?.channelTitle || '',
        title: video.snippet?.title || '',
        publishedAt,
        views,
        likes,
        comments,
        durationRaw: video.contentDetails?.duration || '',
        viewsPerHour: Number((views / hoursSincePublish).toFixed(2)),
        engagementRatio: views > 0 ? Number(((likes + comments) / views).toFixed(4)) : 0,
        queryUsed: query
      };
    });
  }
}
