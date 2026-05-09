@AGENTS.md


Day 4 — Results page + DB
feat: build results page with savings hero banner
feat: add per-tool breakdown cards with expandable recommendations
feat: add Supabase storage for audit results
feat: add shareable public URL with stripped personal data
feat: add Credex promo for audits showing >$500/mo savings
feat: integrate Anthropic API for AI-generated summary with fallback
Day 5 — Lead capture + polish
feat: add email capture form after results are shown
feat: add POST /api/lead route with Supabase storage
feat: add transactional email via Resend
feat: add dynamic Open Graph tags on results page
fix: handle Anthropic API failures gracefully with template fallback
Day 6 — Tests + CI
test: add 10 audit engine unit tests covering all rule paths
feat: add GitHub Actions CI workflow for lint and test on push
docs: add TESTS.md with test descriptions and run instructions
docs: add ARCHITECTURE.md with Mermaid system diagram
Day 7 — Docs + deploy
docs: add README with decisions section and quick start
docs: add PRICING_DATA.md with verified vendor URLs
docs: add PROMPTS.md with full LLM prompt and reasoning
docs: add GTM.md, ECONOMICS.md, METRICS.md, LANDING_COPY.md
docs: add DEVLOG.md, REFLECTION.md, USER_INTERVIEWS.md
chore: deploy to Vercel, add production environment variables
fix: lighthouse accessibility score improvements
fix: lighthouse accessibility score improvements