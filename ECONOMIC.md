# Economics — Unit Economics for SpendWise AI

## What Is a Converted Lead Worth to Credex?

Credex sells discounted AI infrastructure credits. Based on publicly available context:
- AI credits sold: Cursor, Claude, ChatGPT Enterprise, others
- Discount vs retail: estimated 20–40% off list price
- Typical deal size (enterprise AI credits): $5,000–$50,000/year

**Conservative assumption:** Average Credex customer = $15,000 in credits/year.
- Credex margin on resale: ~15–25% → **$2,250–$3,750 gross profit per customer**
- Customer lifetime: 12–24 months (credits renew annually)
- **LTV estimate: $3,000–$7,500 per converted customer**

I'll use **$4,000 LTV** as the working number.

---

## CAC by Channel

| Channel | Effort (hrs/week) | Estimated Users/Month | Conversion: Audit → Lead | Conversion: Lead → Consult | Conversion: Consult → Purchase | CAC |
|---------|------------------|-----------------------|--------------------------|----------------------------|-------------------------------|-----|
| Reddit (organic) | 3 hrs | 200 | 20% = 40 leads | 10% = 4 consults | 25% = 1 purchase | **$0 cash + ~12 hrs** |
| Hacker News (Show HN) | 1 post | 500 (spike) | 15% = 75 leads | 8% = 6 consults | 25% = 1.5 purchases | **$0 cash** |
| X cold outreach | 5 hrs/week | 60 | 25% = 15 leads | 15% = 2.25 consults | 25% = 0.5 purchases/week | **$0 cash + time** |
| Vendor partnership (unfair channel) | BD time | 1,000+ | 25% = 250 leads | 12% = 30 consults | 30% = 9 purchases | **Low cash, high BD** |

**Blended CAC (months 1–6):** ~$200–$400 in equivalent time cost. Cash CAC: **$0** (all organic).

If paid acquisition is added later:
- LinkedIn ads to Engineering Managers: ~$80–$150 CPL → at 10% consult rate → ~$1,000–$1,500 CAC. Still well below $4,000 LTV. **Profitable.**

---

## Conversion Funnel

```
Landing page visitors        →   10,000/mo (realistic at Month 6 with SEO + HN)
Audit form started           →   25% = 2,500
Audit completed              →   70% of started = 1,750
Email captured               →   20% of completed = 350 leads/mo
Credex consultation booked   →   8% of leads = 28 consults/mo
Credit purchase              →   25% of consults = 7 customers/mo
Revenue (at $15k ACV)        →   $105,000 GMV/mo → ~$18,750 gross profit/mo at 15% margin
```

The tool is profitable at 7 customers/month. **Break-even is very low.**

---

## What Makes This Profitable

The audit → consult conversion hinges on two things:
1. **Audit quality** — if the savings are real and specific, users trust the recommendation. A vague "you might be overpaying" won't drive consult bookings. The audit must say "$420/month, here's exactly why."
2. **Timing** — the Credex consultation offer appears only when savings >$500/mo. This filters for high-intent, high-value leads. Showing it to everyone would dilute conversion.

---

## $1M ARR in 18 Months — What Has to Be True

**$1M ARR = ~$83k MRR = ~20 new Credex customers/month at $4k LTV amortized, or ~55 customers/month at $1,500 ACV (smaller deals).**

For this to happen:
1. **The vendor partnership channel activates by Month 4** — one Cursor or Anthropic partnership surfaces SpendWise in their billing/cancellation flows. This alone could drive 500–1,000 audits/day.
2. **SEO compounds** — "cursor pricing," "claude pro vs max," "chatgpt team vs enterprise" are high-intent, relatively low-competition queries. A tool page ranking for these drives passive, free traffic. Realistic timeline: 3–6 months to page 1.
3. **Sales motion exists** — Credex has humans who can close the high-savings leads ($500+/mo). The tool generates the lead; sales closes it. Without this motion, conversion to revenue won't happen.
4. **Retention** — AI pricing changes constantly. Users who get an audit in Month 1 get a re-audit prompt when vendor prices change. This drives repeat visits and re-engagement without CAC.

**Most likely failure mode:** Tool gets traffic but Credex consultation booking rate stays below 5%. This means either (a) the savings aren't compelling enough, (b) the Credex offer isn't trusted, or (c) the consultation process is too much friction. Fix: A/B test the CTA copy and reduce friction (instant Calendly embed instead of a form).

---

## Sensitivity Analysis

| Variable | Base Case | Optimistic | Pessimistic |
|----------|-----------|------------|-------------|
| Monthly audits | 1,750 | 5,000 | 500 |
| Lead capture rate | 20% | 30% | 10% |
| Consult booking rate | 8% | 15% | 3% |
| Purchase rate | 25% | 35% | 15% |
| ACV | $15,000 | $25,000 | $8,000 |
| **Monthly customers** | 7 | 79 | 0.2 |
| **Annual revenue** | $1.26M | $23.7M | $29k |

Base case hits $1M ARR. Pessimistic case does not. **The biggest variable is consult booking rate** — everything else is tractable with marketing spend. The consult-to-purchase conversion is a Credex sales problem, not a product problem.
