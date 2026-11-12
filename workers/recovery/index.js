import { logger } from '../../src/lib/server/utils/logger.js';

/**
 * Recovery Worker for detecting stuck jobs and expired processing leases.
 */
export default {
  async scheduled(event, env) {
    logger.info('RECOVERY_CHECK_START', { cron: event.cron });
    try {
      const { results } = await env.DB.prepare(
        `SELECT id, job_type, entity_id, attempts, max_attempts FROM jobs
         WHERE status = 'PROCESSING' AND datetime(started_at) < datetime('now', '-10 minutes')`
      ).all();

      for (const job of results || []) {
        const nextStatus = job.attempts >= job.max_attempts ? 'FAILED_FINAL' : 'QUEUED';
        await env.DB.prepare(`UPDATE jobs SET status = ? WHERE id = ?`).bind(nextStatus, job.id).run();
        if (nextStatus === 'QUEUED' && env.JOB_QUEUE) {
          await env.JOB_QUEUE.send({ jobId: job.id, jobType: job.job_type, entityId: job.entity_id });
        }
      }
    } catch (err) {
      logger.error('RECOVERY_CHECK_FAILED', err);
    }
  }
};
