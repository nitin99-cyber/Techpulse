import { newId } from '../db/client.js';

/**
 * Enqueue a background job in D1 and Cloudflare Queue.
 * @param {{ db: import('@cloudflare/workers-types').D1Database, queue?: import('@cloudflare/workers-types').Queue, jobType: string, entityId: string, payload: object, priority?: number }} params
 */
export async function enqueueJob({ db, queue, jobType, entityId, payload, priority = 5 }) {
  const jobId = `job_${newId()}`;
  const payloadJson = JSON.stringify(payload);

  await db
    .prepare(
      `INSERT INTO jobs (id, job_type, entity_id, status, priority, payload_json)
       VALUES (?, ?, ?, 'QUEUED', ?, ?)`
    )
    .bind(jobId, jobType, entityId, priority, payloadJson)
    .run();

  if (queue) {
    await queue.send({
      jobId,
      jobType,
      entityId,
      priority
    });
  }

  return { jobId, status: 'QUEUED' };
}
