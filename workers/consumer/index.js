import { logger } from '../../src/lib/server/utils/logger.js';

/**
 * Queue Consumer Worker for async research, evaluation, and script generation jobs.
 */
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      const { jobId, jobType, entityId } = message.body;
      logger.info('JOB_PROCESSING_START', { jobId, jobType, entityId });

      try {
        await env.DB.prepare(
          `UPDATE jobs SET status = 'PROCESSING', started_at = CURRENT_TIMESTAMP, attempts = attempts + 1 WHERE id = ?`
        )
          .bind(jobId)
          .run();

        // Dispatch jobType handlers (EVALUATE_IDEA, RESEARCH_TOPIC, GENERATE_SCRIPTS)
        await env.DB.prepare(
          `UPDATE jobs SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
          .bind(jobId)
          .run();

        message.ack();
        logger.info('JOB_COMPLETED', { jobId, jobType });
      } catch (err) {
        logger.error('JOB_FAILED', err, { jobId, jobType });
        await env.DB.prepare(
          `UPDATE jobs SET status = 'FAILED_RETRYABLE', error_message = ? WHERE id = ?`
        )
          .bind(err instanceof Error ? err.message : String(err), jobId)
          .run();
        message.retry();
      }
    }
  }
};
