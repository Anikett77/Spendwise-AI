import { TOOLS } from "./pricing";

/**
 * AI Spend Audit Engine — Rule-based, defensible recommendations
 * Every recommendation has explicit logic a finance person can verify.
 */

export function runAudit({ tools: userTools, teamSize, useCase }) {
  const results = [];
  let totalMonthlySavings = 0;

  for (const entry of userTools) {
    const { toolId, planId, seats, monthlySpend } = entry;
    const tool = TOOLS[toolId];
    if (!tool) continue;

    const plan = tool.plans[planId];
    const result = auditTool({ toolId, tool, plan, planId, seats, monthlySpend, teamSize, useCase, allTools: userTools });
    totalMonthlySavings += result.savingsMonthly;
    results.push(result);
  }

  // Cross-tool redundancy checks
  const crossToolInsights = checkRedundancies(userTools, useCase);

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    crossToolInsights,
    totalCurrentSpend: userTools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0),
  };
}

function auditTool({ toolId, tool, plan, planId, seats, monthlySpend, teamSize, useCase, allTools }) {
  const recommendations = [];
  let savingsMonthly = 0;
  let status = "optimal"; // optimal | warning | critical

  const effectiveSeats = seats || 1;
  const impliedPricePerSeat = plan?.pricePerSeat || 0;
  const expectedMonthlySpend = impliedPricePerSeat * effectiveSeats;

  // 1. Overpaying vs plan price check
  // Note: we flag this but do NOT add to savingsMonthly here.
  // Downstream plan-downgrade rules use Math.max(monthlySpend, expectedMonthlySpend)
  // as their baseline, so savings are never double-counted.
  const hasBillingMismatch = !plan?.isApiPricing && monthlySpend > 0 && expectedMonthlySpend > 0 && (monthlySpend - expectedMonthlySpend) > 10;
  if (hasBillingMismatch) {
    const overage = monthlySpend - expectedMonthlySpend;
    recommendations.push({
      type: "billing_mismatch",
      message: `You're paying $${monthlySpend}/mo but ${tool.name} ${plan.name} for ${effectiveSeats} seat(s) should cost $${expectedMonthlySpend}/mo. Verify your invoice — you may have legacy pricing or add-ons.`,
      savingsMonthly: overage,
      confidence: "high",
    });
    status = "warning";
    // savings counted once below via effectiveCurrent
  }

  // effectiveCurrent = what you're actually paying (or what the plan costs if no spend entered)
  // All downstream savings rules use this as baseline — prevents double counting
  const effectiveCurrent = Math.max(monthlySpend || 0, expectedMonthlySpend);

  // 2. Over-provisioned plan check (team too small for "team" tier)
  if (toolId === "claude" && planId === "team" && effectiveSeats <= 2) {
    const proAlternativeCost = effectiveSeats * 20;
    const currentCost = effectiveCurrent;
    const saving = currentCost - proAlternativeCost;
    if (saving > 0) {
      recommendations.push({
        type: "downgrade_plan",
        message: `Claude Team requires a 5-seat minimum ($${30 * 5}/mo floor) but you only have ${effectiveSeats} user(s). Switch to ${effectiveSeats} × Claude Pro at $20/seat = $${proAlternativeCost}/mo — identical features for a small team.`,
        savingsMonthly: saving,
        confidence: "high",
      });
      savingsMonthly += saving;
      status = "critical";
    }
  }

  if (toolId === "chatgpt" && planId === "enterprise" && effectiveSeats < 50) {
    const teamCost = effectiveSeats * 30;
    const currentCost = effectiveCurrent;
    const saving = currentCost - teamCost;
    if (saving > 0) {
      recommendations.push({
        type: "downgrade_plan",
        message: `ChatGPT Enterprise is designed for 150+ seat orgs with complex compliance needs. At ${effectiveSeats} seats, ChatGPT Team ($30/seat) offers the same GPT-4o access and workspace features at $${saving}/mo less.`,
        savingsMonthly: saving,
        confidence: "high",
      });
      savingsMonthly += saving;
      status = "critical";
    }
  }

  // 3. Redundant coding tools
  const codingTools = allTools.filter(t => ["cursor", "github_copilot", "windsurf"].includes(t.toolId));
  if (codingTools.length > 1 && ["cursor", "github_copilot", "windsurf"].includes(toolId)) {
    // Only add this recommendation for the most expensive redundant tool
    const sortedCoding = [...codingTools].sort((a, b) => (b.monthlySpend || 0) - (a.monthlySpend || 0));
    if (sortedCoding[0].toolId === toolId && codingTools.length > 1) {
      const cheaperTotal = sortedCoding.slice(1).reduce((sum, t) => sum + (t.monthlySpend || 0), 0);
      recommendations.push({
        type: "redundancy",
        message: `You're running ${codingTools.length} AI coding assistants simultaneously. Developers typically commit to one after a trial period — the context-switching overhead reduces productivity. Consider standardizing on one tool.`,
        savingsMonthly: monthlySpend || 0,
        confidence: "medium",
      });
      // Don't double count savings here — flag as insight
      status = status === "optimal" ? "warning" : status;
    }
  }

  // 4. Use-case mismatch: paying for coding tool when use case is writing/data
  if (useCase === "writing" && ["cursor", "windsurf"].includes(toolId)) {
    recommendations.push({
      type: "use_case_mismatch",
      message: `${tool.name} is built for code generation. For writing-focused teams, Claude Pro or ChatGPT Plus offer better drafting, editing, and long-form generation at comparable or lower cost.`,
      savingsMonthly: monthlySpend || 0,
      confidence: "medium",
    });
    status = "warning";
  }

  // 5. GitHub Copilot vs Cursor — if both exist, check if Cursor Business beats Copilot Business
  if (toolId === "github_copilot" && planId === "business") {
    const hasCursor = allTools.some(t => t.toolId === "cursor");
    if (!hasCursor) {
      const cursorProCost = effectiveSeats * 20;
      const currentCost = effectiveCurrent;
      if (cursorProCost < currentCost && (useCase === "coding" || useCase === "mixed")) {
        recommendations.push({
          type: "alternative_tool",
          message: `Cursor Pro ($20/seat) includes GPT-4o + Claude access, file-level context, and multi-file edits — capabilities that require GitHub Copilot Enterprise ($39/seat). Switching saves $${currentCost - cursorProCost}/mo at your team size.`,
          savingsMonthly: currentCost - cursorProCost,
          confidence: "medium",
        });
        savingsMonthly += currentCost - cursorProCost;
        status = "warning";
      }
    }
  }

  // 6. Claude Max for small teams — is it justified?
  if (toolId === "claude" && planId === "max" && effectiveSeats <= 2) {
    const proCost = effectiveSeats * 20;
    const currentCost = effectiveCurrent;
    const saving = currentCost - proCost;
    if (saving > 0) {
      recommendations.push({
        type: "downgrade_plan",
        message: `Claude Max ($100/seat) gives 20x the usage of Pro — justified for heavy daily power users (researchers, large-context document processing). For ${effectiveSeats} user(s) with general use, Claude Pro ($20/seat) covers 95% of use cases at $${saving}/mo less. Upgrade only if you consistently hit Pro limits.`,
        savingsMonthly: saving,
        confidence: "medium",
      });
      savingsMonthly += saving;
      status = "warning";
    }
  }

  // 7. Gemini Advanced vs ChatGPT Plus for general use
  if (toolId === "chatgpt" && planId === "plus") {
    const hasGemini = allTools.some(t => t.toolId === "gemini");
    if (hasGemini && useCase !== "coding") {
      recommendations.push({
        type: "redundancy",
        message: `You're paying for both ChatGPT Plus and Gemini. Both offer general-purpose LLM access at $20/seat. Consolidate to the one your team prefers — running both rarely doubles productivity.`,
        savingsMonthly: monthlySpend || 0,
        confidence: "medium",
      });
      status = status === "optimal" ? "warning" : status;
    }
  }

  // 8. If everything looks clean
  if (recommendations.length === 0) {
    status = "optimal";
    recommendations.push({
      type: "optimal",
      message: `Your ${tool.name} ${plan?.name} plan appears well-matched to your team size and use case. No immediate action needed.`,
      savingsMonthly: 0,
      confidence: "high",
    });
  }

  return {
    toolId,
    toolName: tool.name,
    logo: tool.logo,
    color: tool.color,
    planName: plan?.name || planId,
    seats: effectiveSeats,
    currentMonthlySpend: monthlySpend || expectedMonthlySpend,
    recommendations,
    savingsMonthly: Math.max(0, savingsMonthly),
    status,
  };
}

function checkRedundancies(userTools, useCase) {
  const insights = [];
  const toolIds = userTools.map(t => t.toolId);

  // Both Anthropic API and Claude Pro
  if (toolIds.includes("anthropic_api") && toolIds.includes("claude")) {
    insights.push("You have both Claude subscription and Anthropic API access. If your team is building on the API, you may not need the Claude.ai subscription — the API gives full model access.");
  }

  // Both OpenAI API and ChatGPT
  if (toolIds.includes("openai_api") && toolIds.includes("chatgpt")) {
    insights.push("You're paying for both OpenAI API and ChatGPT subscriptions. API access already includes ChatGPT-equivalent model access — evaluate if the ChatGPT.com subscription adds enough UI value to justify the extra cost.");
  }

  return insights;
}