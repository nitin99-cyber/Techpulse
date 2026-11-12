import { json } from '@sveltejs/kit';
import { getDb } from '$server/db/client.js';

export async function GET({ params, platform }) {
  try {
    const db = getDb(platform);
    const job = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(params.id).first();
    if (!job) {
      return json(
        { success: false, error: { code: 'JOB_NOT_FOUND', message: 'Job not found' } },
        { status: 404 }
      );
    }
    return json({ success: true, job });
  } catch (err) {
    return json(
      { success: false, error: { code: 'JOB_FETCH_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
