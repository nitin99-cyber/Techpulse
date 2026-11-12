import { json } from '@sveltejs/kit';
import { getDb } from '$server/db/client.js';
import { topicRepo } from '$server/repositories/topicRepo.js';

export async function GET({ url, platform }) {
  try {
    const db = getDb(platform);
    const status = url.searchParams.get('status') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const topicType = url.searchParams.get('topicType') || undefined;
    const limit = Math.min(Number(url.searchParams.get('limit') || 40), 100);

    const topics = await topicRepo.list(db, { status, category, topicType, limit });
    return json({ success: true, topics });
  } catch (err) {
    return json(
      {
        success: false,
        error: { code: 'TOPICS_FETCH_ERROR', message: err.message }
      },
      { status: 500 }
    );
  }
}
