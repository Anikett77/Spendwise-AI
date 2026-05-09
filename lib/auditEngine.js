import { TOOLS } from "./pricing";


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
  let status = "optimal";

  const effectiveSeats = seats || teamSize || 1;
  const impliedPricePerSeat = plan?.pricePerSeat || 0;
  const expectedMonthlySpend = impliedPricePerSeat * effectiveSeats;

  const effectiveCurrent = Math.max(monthlySpend || 0, expectedMonthlySpend);

  const hasBillingMismatch =
    !plan?.isApiPricing &&
    monthlySpend > 0 &&
    expectedMonthlySpend > 0 &&
    (monthlySpend - expectedMonthlySpend) > 10;

  if (hasBillingMismatch) {
    const overage = monthlySpend - expectedMonthlySpend;
    recommendations.push({
      type: "billing_mismatch",
      message: `You are paying $${monthlySpend}/mo but ${tool.name} ${plan.name} for ${effectiveSeats} seat(s) should cost $${expectedMonthlySpend}/mo. Verify your invoice.`,
      savingsMonthly: overage,
      confidence: "high",
    });
    savingsMonthly += overage;
    status = "warning";
  }

  if (toolId === "claude" && planId === "team" && effectiveSeats <= 2) {
    const proAlternativeCost = effectiveSeats * 20;
    const saving = effectiveCurrent - proAlternativeCost;
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
    const saving = effectiveCurrent - teamCost;
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

  const codingTools = allTools.filter(t => ["cursor", "github_copilot", "windsurf"].includes(t.toolId));
  if (codingTools.length > 1 && ["cursor", "github_copilot", "windsurf"].includes(toolId)) {
    const sortedCoding = [...codingTools].sort((a, b) => (b.monthlySpend || 0) - (a.monthlySpend || 0));
    if (sortedCoding[0].toolId === toolId) {
      recommendations.push({
        type: "redundancy",
        message: `You're running ${codingTools.length} AI coding assistants simultaneously. Developers typically commit to one after a trial period — the context-switching overhead reduces productivity. Consider standardizing on one tool.`,
        savingsMonthly: monthlySpend || 0,
        confidence: "medium",
      });
      status = status === "optimal" ? "warning" : status;
    }
  }

  if (useCase === "writing" && ["cursor", "windsurf"].includes(toolId)) {
    recommendations.push({
      type: "use_case_mismatch",
      message: `${tool.name} is built for code generation. For writing-focused teams, Claude Pro or ChatGPT Plus offer better drafting, editing, and long-form generation at comparable or lower cost.`,
      savingsMonthly: monthlySpend || 0,
      confidence: "medium",
    });
    status = "warning";
  }

  if (toolId === "github_copilot" && planId === "business") {
    const hasCursor = allTools.some(t => t.toolId === "cursor");
    if (!hasCursor && (useCase === "coding" || useCase === "mixed")) {
      const cursorProCost = effectiveSeats * 20;
      const saving = effectiveCurrent - cursorProCost;
      if (saving > 0) {
        recommendations.push({
          type: "alternative_tool",
          message: `Cursor Pro ($20/seat) includes GPT-4o + Claude access, file-level context, and multi-file edits — capabilities that require GitHub Copilot Enterprise ($39/seat). Switching saves $${saving}/mo at your team size.`,
          savingsMonthly: saving,
          confidence: "medium",
        });
        savingsMonthly += saving;
        status = "warning";
      }
    }
  }

  if (toolId === "claude" && planId === "max" && effectiveSeats <= 2) {
    const proCost = effectiveSeats * 20;
    const saving = effectiveCurrent - proCost;
    if (saving > 0) {
      recommendations.push({
        type: "downgrade_plan",
        message: `Claude Max ($100/seat) gives 20x the usage of Pro — justified for heavy daily power users. For ${effectiveSeats} user(s) with general use, Claude Pro ($20/seat) covers 95% of use cases at $${saving}/mo less.`,
        savingsMonthly: saving,
        confidence: "medium",
      });
      savingsMonthly += saving;
      status = "warning";
    }
  }


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

  if (toolIds.includes("anthropic_api") && toolIds.includes("claude")) {
    insights.push("You have both Claude subscription and Anthropic API access. If your team is building on the API, you may not need the Claude.ai subscription — the API gives full model access.");
  }

  if (toolIds.includes("openai_api") && toolIds.includes("chatgpt")) {
    insights.push("You're paying for both OpenAI API and ChatGPT subscriptions. API access already includes ChatGPT-equivalent model access — evaluate if the ChatGPT.com subscription adds enough UI value to justify the extra cost.");
  }

  return insights;
}