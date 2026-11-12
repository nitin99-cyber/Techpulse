import { collectGoogleNews } from '../../src/lib/server/collectors/googleNews.js';
import { collectHackerNews } from '../../src/lib/server/collectors/hackerNews.js';
import { collectGdeltNews } from '../../src/lib/server/collectors/gdelt.js';
import { logger } from '../../src/lib/server/utils/logger.js';

/**
 * Scheduled Cloudflare Worker entry point for periodic news & tech trend collection.
 */
export default {
  async scheduled(event, env, ctx) {
    logger.info('SCHEDULER_STARTED', { cron: event.cron });
    const markets = (env.DEFAULT_COUNTRIES || 'US,GB,CA,AU,DE').split(',').map((m) => m.trim());

    ctx.waitUntil(
      (async () => {
        for (const marketCode of markets) {
          try {
            const articles = await collectGoogleNews({ query: 'technology', marketCode });
            logger.info('COLLECTED_RSS', { marketCode, count: articles.length });
          } catch (err) {
            logger.error('RSS_COLLECTION_ERROR', err, { marketCode });
          }
        }

        try {
          const hn = await collectHackerNews({ limit: 20 });
          const gdelt = await collectGdeltNews({ maxRecords: 20 });
          logger.info('COLLECTED_TECH_SIGNALS', { hnCount: hn.length, gdeltCount: gdelt.length });
        } catch (err) {
          logger.error('TECH_SIGNAL_COLLECTION_ERROR', err);
        }
      })()
    );
  }
};
