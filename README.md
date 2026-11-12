# TechPulse

Personalized technology-content intelligence, research, and short-form script engine built with SvelteKit (JavaScript ES Modules), Cloudflare Workers, Cloudflare D1, Cloudflare Queues, and Google Gemini.

## Architecture

- **Frontend & API**: SvelteKit (`src/routes/`)
- **Server Modules**: Providers, collectors, AI agents, scoring, validation (`src/lib/server/`)
- **Prompts**: Version-controlled agent prompts (`prompts/`)
- **Background Workers**: Cron scheduler, queue consumer, recovery (`workers/`)
- **Database**: Cloudflare D1 SQLite migrations (`migrations/`)

## Quick Start

1. Copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` and `YOUTUBE_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize local D1 schema:
   ```bash
   npm run d1:local
   npm run d1:indexes
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```
