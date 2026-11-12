import { json } from '@sveltejs/kit';

export async function GET({ platform }) {
  const hasDb = Boolean(platform?.env?.DB);
  const hasQueue = Boolean(platform?.env?.JOB_QUEUE);
  const hasGemini = Boolean(platform?.env?.GEMINI_API_KEY);
  const hasYouTube = Boolean(platform?.env?.YOUTUBE_API_KEY);

  let dbConnected = false;
  if (hasDb) {
    try {
      await platform.env.DB.prepare('SELECT 1').first();
      dbConnected = true;
    } catch {
      dbConnected = false;
    }
  }

  return json({
    success: true,
    status: 'OK',
    environment: {
      dbConnected,
      queueConfigured: hasQueue,
      geminiConfigured: hasGemini,
      youtubeConfigured: hasYouTube
    },
    timestamp: new Date().toISOString()
  });
}
