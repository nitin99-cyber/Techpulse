import { json } from '@sveltejs/kit';
import { getDb } from '$server/db/client.js';
import { topicRepo } from '$server/repositories/topicRepo.js';
import { enqueueJob } from '$server/queue/producer.js';
import { IdeaSubmissionSchema } from '$server/validation/schemas.js';

export async function POST({ request, platform }) {
  try {
    const body = await request.json();
    const parsed = IdeaSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message || 'Invalid idea payload' }
        },
        { status: 400 }
      );
    }

    const db = getDb(platform);
    const idea = await topicRepo.createIdea(db, {
      title: parsed.data.title,
      summary: parsed.data.context
    });

    const job = await enqueueJob({
      db,
      queue: platform?.env?.JOB_QUEUE,
      jobType: 'EVALUATE_IDEA',
      entityId: idea.id,
      payload: parsed.data,
      priority: 3
    });

    return json({ success: true, idea, ...job }, { status: 201 });
  } catch (err) {
    return json(
      {
        success: false,
        error: { code: 'IDEA_SUBMIT_ERROR', message: err.message }
      },
      { status: 500 }
    );
  }
}
