-- TechPulse Migration 0001: Initial Schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  language TEXT DEFAULT 'en',
  countries_json TEXT NOT NULL,
  categories_json TEXT NOT NULL,
  collection_interval_hours INTEGER DEFAULT 3,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  normalized_title TEXT,
  summary TEXT,
  category TEXT,
  topic_type TEXT DEFAULT 'TREND', -- 'TREND' or 'CUSTOM_IDEA'
  status TEXT DEFAULT 'DISCOVERED', -- 'DISCOVERED', 'SELECTED', 'REJECTED', 'RESEARCHED', 'ARCHIVED'
  first_seen_at TEXT,
  last_seen_at TEXT,
  trend_score REAL DEFAULT 0,
  opportunity_score REAL DEFAULT 0,
  audience_value_score REAL DEFAULT 0,
  competition_level TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH'
  confidence REAL DEFAULT 0.5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topic_sources (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  normalized_url TEXT,
  publisher TEXT,
  title TEXT,
  published_at TEXT,
  retrieved_at TEXT,
  source_type TEXT, -- 'RSS', 'GDELT', 'HN', 'GITHUB'
  content_hash TEXT,
  excerpt TEXT,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_metrics (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL,
  market_code TEXT,
  measured_at TEXT NOT NULL,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS competitor_videos (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  channel_id TEXT,
  channel_title TEXT,
  title TEXT,
  published_at TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  query_used TEXT,
  collected_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_reports (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  instructions_json TEXT,
  report_json TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'COMPLETED', 'REVISED'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_claims (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  claim_text TEXT NOT NULL,
  claim_status TEXT NOT NULL, -- 'VERIFIED', 'SUPPORTED', 'DISPUTED', 'UNVERIFIED', 'OPINION', 'OUTDATED'
  confidence REAL DEFAULT 0.5,
  source_ids_json TEXT,
  notes TEXT,
  FOREIGN KEY(report_id) REFERENCES research_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scripts (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'APPROVED', 'ARCHIVED'
  approved_version_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS script_versions (
  id TEXT PRIMARY KEY,
  script_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  approach TEXT NOT NULL, -- 'FAST_PACED', 'CURIOSITY', 'EXPLANATORY'
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  closing TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  estimated_duration_seconds REAL DEFAULT 0,
  visual_direction TEXT,
  source_ids_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(script_id) REFERENCES scripts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL, -- 'RESEARCH_TOPIC', 'EVALUATE_IDEA', 'GENERATE_SCRIPTS', 'COLLECT_NEWS'
  entity_id TEXT,
  status TEXT DEFAULT 'QUEUED', -- 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED_RETRYABLE', 'FAILED_FINAL', 'CANCELLED'
  priority INTEGER DEFAULT 5,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  payload_json TEXT NOT NULL,
  result_json TEXT,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS api_usage (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  model TEXT,
  operation TEXT,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost_usd REAL DEFAULT 0,
  status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_runs (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  market_code TEXT,
  status TEXT,
  records_found INTEGER DEFAULT 0,
  records_saved INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  topic_id TEXT,
  decision TEXT, -- 'ACCEPTED', 'REJECTED', 'POSTPONED'
  reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
