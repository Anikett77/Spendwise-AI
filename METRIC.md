# Metrics

## North Star Metric

**Qualified leads generated per week** — defined as: email captured from a user whose audit shows ≥$100/mo in potential savings.

**Why this metric and not others:**
- "Audits completed" is a vanity metric — someone completing an audit with zero savings is not a qualified lead for Credex.
- "Page views" or "DAU" would be wrong for a tool people use once per quarter. This isn't a daily-use product.
- "Consultations booked" is too far down the funnel to optimize early — you need volume first.
- Qualified leads is the exact handoff point between the product (SpendWise) and the business (Credex). Optimizing it aligns both teams.

**Target:** 50 qualified leads/week by Month 3.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
**Definition:** % of users who start the form (add at least one tool) and click "Run my audit"
**Target:** ≥65%
**Why it matters:** Drop-off in the form means the UX is too complex or the ask is too much. Every point of improvement here multiplies all downstream metrics.
**What to instrument:** Track `audit_form_started` (first tool added) vs `audit_submitted` events.

### 2. Savings-Positive Rate
**Definition:** % of completed audits that show ≥$100/mo in potential savings
**Target:** ≥40%
**Why it matters:** If most audits show $0 savings, either (a) our engine is too conservative, (b) our target users are already optimized (unlikely), or (c) we're attracting the wrong users. This metric directly controls what % of completions become qualified leads.
**What to instrument:** Log `total_monthly_savings` on every audit. Track distribution, not just average.

### 3. Lead Capture Rate (Post-Result)
**Definition:** % of savings-positive audit completions that result in an email capture
**Target:** ≥25%
**Why it matters:** This is the conversion between "this tool helped me" and "I'm willing to stay in touch." A low rate means either the value shown isn't compelling enough, or the email ask has too much friction.
**What to instrument:** Track `email_captured` event tied to `audit_id`. Segment by savings bucket ($100–$500, $500–$2k, $2k+).

---

## What to Instrument First

Priority order (instrument these before anything else):

1. `audit_started` — user opens `/audit`
2. `audit_form_first_tool_added` — user selects their first tool (intent signal)
3. `audit_submitted` — user clicks "Run my audit"
4. `audit_results_viewed` — results page loaded (confirms no bounce before seeing results)
5. `email_captured` — lead form submitted
6. `credex_cta_clicked` — "Learn about Credex" button clicked (high-value signal)
7. `share_link_copied` — viral loop activation

All events should include: `audit_id`, `total_monthly_savings`, `use_case`, `team_size`, `tool_count`.

**Tool:** Start with simple Supabase event logging (already have the DB). Move to PostHog or Mixpanel when event volume justifies it (>1k events/day).

---

## Pivot Trigger

**If after 60 days:** Audit completion rate is ≥60% but lead capture rate stays below 10% despite 2+ A/B tests on the email capture copy and placement.

**What this means:** Users find the tool useful but don't trust us enough to give their email — or they don't see value in staying in touch. The product is a calculator, not a service.

**Pivot options:**
1. Remove email gate entirely, focus on the shareable URL as the viral loop. Monetize through the Credex CTA alone.
2. Add instant value to the email capture: "Get notified when vendor prices change and your audit updates" — make it a subscription to price alerts, not just a report copy.
3. Shift target user: if indie hackers are completing audits but CTOs aren't, adjust GTM toward the segment that does convert.

**What not to do:** Don't pivot away from the tool itself if completion rates are high. High completion + low lead capture is a trust/value-prop problem, not a product problem.
