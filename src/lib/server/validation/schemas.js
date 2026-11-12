import { z } from 'zod';

export const IdeaSubmissionSchema = z.object({
  title: z.string().min(5, 'Idea must be at least 5 characters').max(200),
  context: z.string().max(2000).optional().default(''),
  targetAudience: z.string().max(200).optional().default('International English-speaking tech viewers'),
  preferredAngle: z.string().max(500).optional().default(''),
  emphasize: z.string().max(500).optional().default(''),
  avoid: z.string().max(500).optional().default('')
});

export const ResearchRequestSchema = z.object({
  topicId: z.string().min(1),
  desiredAngle: z.string().max(500).optional().default(''),
  emphasize: z.string().max(500).optional().default(''),
  avoid: z.string().max(500).optional().default(''),
  technicalDepth: z.enum(['BEGINNER', 'INTERMEDIATE', 'DEEP']).optional().default('INTERMEDIATE'),
  targetMarket: z.string().max(20).optional().default('US'),
  tone: z.string().max(100).optional().default('Clear, engaging, factual'),
  additionalInstructions: z.string().max(1000).optional().default('')
});

export const ScriptGenerateSchema = z.object({
  topicId: z.string().min(1),
  reportId: z.string().min(1),
  targetDurationSeconds: z.number().min(10).max(60).optional().default(20),
  revisionInstruction: z.string().max(500).optional().default('')
});

export const ClaimStatusEnum = z.enum([
  'VERIFIED',
  'SUPPORTED',
  'DISPUTED',
  'UNVERIFIED',
  'OPINION',
  'OUTDATED'
]);

export const TrendAnalysisOutputSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  why_it_matters: z.string(),
  category: z.string(),
  trend_type: z.enum(['BREAKING', 'EVERGREEN', 'EMERGING']),
  suggested_angles: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

export const ScriptVersionOutputSchema = z.object({
  approach: z.enum(['FAST_PACED', 'CURIOSITY', 'EXPLANATORY']),
  hook: z.string(),
  body: z.string(),
  closing: z.string(),
  visual_direction: z.string(),
  source_ids: z.array(z.string()).default([])
});

export const ScriptBatchOutputSchema = z.object({
  scripts: z.array(ScriptVersionOutputSchema).min(1).max(3)
});
