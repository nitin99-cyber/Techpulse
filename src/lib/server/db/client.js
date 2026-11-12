/**
 * Cloudflare D1 database access helper.
 * Ensures parameterized queries and safe extraction from SvelteKit `platform.env`.
 */

/**
 * Retrieve the D1 binding from SvelteKit's event.platform.
 * @param {App.Platform | undefined} platform
 * @returns {import('@cloudflare/workers-types').D1Database}
 */
export function getDb(platform) {
  const db = platform?.env?.DB;
  if (!db) {
    throw new Error('D1 database binding "DB" is not configured in platform.env.');
  }
  return db;
}

/**
 * Generate a standard UUID v4 ID.
 * @returns {string}
 */
export function newId() {
  return crypto.randomUUID();
}
