# SpendWise AI — Free AI Tool Spend Audit

A free tool that helps startup founders and engineering managers discover where they're overspending on AI tools (Cursor, Claude, ChatGPT, Copilot, Gemini, Windsurf, and more) and get specific, defensible recommendations to reduce spend.

**[Live Demo](https://your-deploy-url.vercel.app)** · Built for [Credex](https://credex.rocks)

## Screenshots

> Add 3+ screenshots or a Loom/YouTube link here after deployment.

## Quick Start

```bash
git clone https://github.com/your-username/ai-spend-audit
cd ai-spend-audit
npm install
cp .env.local.example .env.local
# Fill in your Supabase URL, Supabase Anon Key, and Anthropic API key
npm run dev
```

Open http://localhost:3000

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `ANTHROPIC_API_KEY` | Yes | For AI-generated summaries |
| `RESEND_API_KEY` | Optional | For transactional emails |
| `NEXT_PUBLIC_APP_URL` | Yes | Your deployed URL |

### Supabase Setup

Run these SQL statements in your Supabase SQL editor:

```sql
create table audits (
  id uuid primary key,
  audit_results jsonb,
  total_monthly_savings numeric,
  total_annual_savings numeric,
  total_current_spend numeric,
  cross_tool_insights jsonb,
  ai_summary text,
  use_case text,
  team_size integer,
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text,
  role text,
  team_size integer,
  audit_id uuid,
  monthly_savings numeric,
  high_value boolean default false,
  created_at timestamptz default now()
);
```

### Deploy

```bash
vercel --prod
```

Set environment variables in the Vercel dashboard.

## Decisions

1. **Next.js App Router over Pages Router** — Enables server components for the API routes co-located with pages, easier metadata management for OG tags, and streaming. The app router's `use()` hook makes param handling cleaner in the results page.

2. **Rule-based audit engine, not AI** — The audit math uses hardcoded logic (see `lib/auditEngine.js`). AI is used only for the narrative summary. This ensures the financial reasoning is deterministic, auditable, and fast. An LLM generating "$X savings" with no citation is not trustworthy.

3. **Supabase over a custom Postgres** — Zero-setup for a 7-day build. Row-level security, built-in REST API, and a generous free tier. In production at 10k audits/day, you'd add read replicas and Redis caching.

4. **Inline styles over Tailwind classes in page components** — Given the timeline and the need for complex dynamic styles (conditional colors, animations), inline styles prevented the need to configure `safelist` in Tailwind while maintaining full type safety and zero class-name collisions.

5. **sessionStorage for fresh audits** — After running an audit, the full result is stored in sessionStorage so the results page renders instantly without a DB round trip. The DB is the persistence layer for shared URLs — not the hot path.
