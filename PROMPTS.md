# LLM Prompts

## Audit Summary Prompt

Used in: `app/api/audit/route.js` → `generateAISummary()`
Model: `claude-3-haiku-20240307`

### Final prompt:

```
You are an AI spend analyst. Write a concise, personalized 80-100 word summary for a startup audit report.

Team context: {teamSize} person team, primary use case: {useCase}
Current total spend: ${totalCurrentSpend}/mo
Potential monthly savings: ${totalMonthlySavings}/mo

Tool breakdown:
{toolSummaries}

Write a professional, specific, honest summary. Mention the biggest savings opportunity by name. If savings are minimal, say so honestly. Do not use phrases like "In conclusion" or "Overall". Be direct. 80-100 words only.
```

### Why this way:
- Haiku is fast and cheap for a 100-word summary — Sonnet/Opus would be overkill
- Explicit word count prevents runaway responses
- "Be direct" and "do not use" phrasing reduces LLM hedging
- Passing structured tool data prevents hallucination of numbers

### What didn't work:
- First version asked for "a paragraph" — got inconsistent lengths (30–300 words)
- Without "mention the biggest savings opportunity by name", responses were generic
- "Write as a financial advisor" persona made it too formal/stiff

### Fallback:
All LLM calls are wrapped in try/catch. On failure, `generateFallbackSummary()` generates a template-based summary from the audit data directly. This ensures the page always renders even if the API is unavailable.
