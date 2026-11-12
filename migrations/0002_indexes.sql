-- TechPulse Migration 0002: Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_score ON topics(opportunity_score);
CREATE INDEX IF NOT EXISTS idx_topics_first_seen ON topics(first_seen_at);
CREATE INDEX IF NOT EXISTS idx_topics_type ON topics(topic_type);
CREATE INDEX IF NOT EXISTS idx_sources_topic ON topic_sources(topic_id);
CREATE INDEX IF NOT EXISTS idx_sources_hash ON topic_sources(content_hash);
CREATE INDEX IF NOT EXISTS idx_sources_url ON topic_sources(normalized_url);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_competitor_topic ON competitor_videos(topic_id);
CREATE INDEX IF NOT EXISTS idx_metrics_topic_time ON topic_metrics(topic_id, measured_at);
CREATE INDEX IF NOT EXISTS idx_scripts_topic ON scripts(topic_id);
CREATE INDEX IF NOT EXISTS idx_claims_report ON research_claims(report_id);
