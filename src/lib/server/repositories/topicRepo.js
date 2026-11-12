import { newId } from '../db/client.js';

/**
 * Repository for Topic & Idea CRUD operations in Cloudflare D1.
 */
export const topicRepo = {
  /**
   * List topics with optional filters.
   * @param {import('@cloudflare/workers-types').D1Database} db
   * @param {{ status?: string, category?: string, topicType?: string, limit?: number }} filters
   */
  async list(db, { status, category, topicType, limit = 40 } = {}) {
    let sql = 'SELECT * FROM topics WHERE 1=1';
    const bindings = [];

    if (status) {
      sql += ' AND status = ?';
      bindings.push(status);
    }
    if (category) {
      sql += ' AND category = ?';
      bindings.push(category);
    }
    if (topicType) {
      sql += ' AND topic_type = ?';
      bindings.push(topicType);
    }

    sql += ' ORDER BY opportunity_score DESC, created_at DESC LIMIT ?';
    bindings.push(limit);

    const { results } = await db.prepare(sql).bind(...bindings).all();
    return results || [];
  },

  /**
   * Fetch a single topic by ID.
   * @param {import('@cloudflare/workers-types').D1Database} db
   * @param {string} id
   */
  async getById(db, id) {
    return db.prepare('SELECT * FROM topics WHERE id = ?').bind(id).first();
  },

  /**
   * Insert a custom creator idea as a topic.
   * @param {import('@cloudflare/workers-types').D1Database} db
   * @param {{ title: string, summary?: string, category?: string }} data
   */
  async createIdea(db, { title, summary = '', category = 'Technology Explainers' }) {
    const id = `topic_${newId()}`;
    const normalizedTitle = title.toLowerCase().trim();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO topics (id, title, normalized_title, summary, category, topic_type, status, first_seen_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, 'CUSTOM_IDEA', 'SELECTED', ?, ?)`
      )
      .bind(id, title, normalizedTitle, summary, category, now, now)
      .run();

    return { id, title, topic_type: 'CUSTOM_IDEA', status: 'SELECTED' };
  }
};
