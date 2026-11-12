import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTrendScore, calculateOpportunityScore, classifyCompetition } from '../../src/lib/server/scoring/engine.js';
import { normalizeUrl, countWords, estimateSpokenDuration } from '../../src/lib/server/utils/text.js';

test('normalizeUrl strips tracking parameters and trailing slashes', () => {
  const input = 'https://example.com/news/ai-chip/?utm_source=twitter&utm_medium=social#top';
  assert.equal(normalizeUrl(input), 'https://example.com/news/ai-chip');
});

test('countWords and estimateSpokenDuration calculate short-form timing accurately', () => {
  const script = 'Why do massive data centers still rely on spinning hard drives when SSDs are ten times faster?';
  assert.equal(countWords(script), 17);
  assert.equal(estimateSpokenDuration(script), 7.1);
});

test('calculateTrendScore normalizes across available signals without treating missing data as zero', () => {
  const result = calculateTrendScore({
    searchDemand: null,
    socialVelocity: 0.8,
    youtubeGrowth: undefined,
    geographicSpread: 0.6,
    freshness: 1.0,
    crossSource: 0.5
  });
  assert.ok(result.missingSignals.includes('searchDemand'));
  assert.ok(result.missingSignals.includes('youtubeGrowth'));
  assert.equal(result.availableWeight, 55);
  assert.equal(result.score, 72.7);
});

test('calculateOpportunityScore computes weighted score', () => {
  const result = calculateOpportunityScore({
    audienceDemand: 0.8,
    competitionGap: 0.9,
    audienceRelevance: 0.7,
    storytellingPotential: 0.8,
    evergreenValue: 1.0,
    productionFeasibility: 0.9
  });
  assert.equal(result.score, 83);
});

test('classifyCompetition distinguishes LOW, MEDIUM, and HIGH saturation', () => {
  assert.equal(classifyCompetition({ videoCount: 2, avgViewsPerHour: 120, narrativeOverlapRatio: 0.2 }), 'LOW');
  assert.equal(classifyCompetition({ videoCount: 15, avgViewsPerHour: 2400, narrativeOverlapRatio: 0.8 }), 'HIGH');
  assert.equal(classifyCompetition({ videoCount: 7, avgViewsPerHour: 600, narrativeOverlapRatio: 0.5 }), 'MEDIUM');
});
