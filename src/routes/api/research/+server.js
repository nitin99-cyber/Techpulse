import { json } from '@sveltejs/kit';
import { getDb } from '$server/db/client.js';
import { enqueueJob } from '$server/queue/producer.js';
import { ResearchRequestSchema } from '$server/validation/schemas.js';

export async function POST({ request, platform }) {
  try {
    const body = await request.json();
    const parsed = ResearchRequestSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message || 'Invalid research request' }
        },
        { status: 400 }
      );
    }

    const db = getDb(platform);
    const job = await enqueueJob({
      db,
      queue: platform?.env?.JOB_QUEUE,
      jobType: 'RESEARCH_TOPIC',
      entityId: parsed.data.topicId,
      payload: parsed.data,
      priority: 2
    });

    return json({ success: true, ...job }, { status: 202 });
  } catch (err) {
    return json(
      {
        success: false,
        error: { code: 'RESEARCH_QUEUE_ERROR', message: err.message }
      },
      { status: 500 }
    );
  }
}
