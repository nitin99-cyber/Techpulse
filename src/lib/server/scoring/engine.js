/**
 * Deterministic Trend and Content Opportunity Scoring Engine (PRD Section 8).
 * Normalizes scores using only available signals so missing data is never treated as zero demand.
 */

const TREND_WEIGHTS = {
  searchDemand: 25,
  socialVelocity: 20,
  youtubeGrowth: 20,
  geographicSpread: 15,
  freshness: 10,
  crossSource: 10
};

const OPPORTUNITY_WEIGHTS = {
  audienceDemand: 25,
  competitionGap: 20,
  audienceRelevance: 20,
  storytellingPotential: 15,
  evergreenValue: 10,
  productionFeasibility: 10
};

/**
 * Compute normalized weighted score (0-100) from partial signals.
 * @param {Record<string, number | null | undefined>} signals - Each value should be 0..1 or null/undefined if unavailable.
 * @param {Record<string, number>} weights
 * @returns {{ score: number, availableWeight: number, missingSignals: string[] }}
 */
function computeNormalizedScore(signals, weights) {
  let weightedSum = 0;
  let availableWeight = 0;
  const missingSignals = [];

  for (const [key, weight] of Object.entries(weights)) {
    const val = signals[key];
    if (typeof val === 'number' && !Number.isNaN(val)) {
      const clamped = Math.max(0, Math.min(1, val));
      weightedSum += clamped * weight;
      availableWeight += weight;
    } else {
      missingSignals.push(key);
    }
  }

  if (availableWeight === 0) {
    return { score: 0, availableWeight: 0, missingSignals };
  }

  const normalized = (weightedSum / availableWeight) * 100;
  return {
    score: Number(normalized.toFixed(1)),
    availableWeight,
    missingSignals
  };
}

/**
 * Compute deterministic Trend Score.
 * @param {Record<string, number | null | undefined>} signals
 */
export function calculateTrendScore(signals) {
  return computeNormalizedScore(signals, TREND_WEIGHTS);
}

/**
 * Compute deterministic Content Opportunity Score.
 * @param {Record<string, number | null | undefined>} signals
 */
export function calculateOpportunityScore(signals) {
  return computeNormalizedScore(signals, OPPORTUNITY_WEIGHTS);
}

/**
 * Derive qualitative competition level from YouTube competitor metrics.
 * @param {{ videoCount: number, avgViewsPerHour: number, narrativeOverlapRatio: number }} stats
 * @returns {'LOW' | 'MEDIUM' | 'HIGH'}
 */
export function classifyCompetition({ videoCount = 0, avgViewsPerHour = 0, narrativeOverlapRatio = 0 }) {
  if (videoCount <= 3 && avgViewsPerHour < 500) {
    return 'LOW';
  }
  if (videoCount >= 12 && narrativeOverlapRatio > 0.65 && avgViewsPerHour >= 1000) {
    return 'HIGH';
  }
  return 'MEDIUM';
}
