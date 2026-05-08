import { NextResponse } from "next/server";
import { runAudit } from "../../../lib/auditEngine";
import { supabase } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Rate limiting - simple in-memory (use Redis in production)
const requestCounts = new Map();
const RATE_LIMIT = 10; // per 10 min per IP
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  const entry = requestCounts.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    requestCounts.set(key, { count: 1, start: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Honeypot check
    const body = await request.json();
    if (body._honeypot) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }

    const { tools, teamSize, useCase } = body;

    if (!tools?.length || !teamSize || !useCase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Run the rule-based audit engine
    const auditResult = runAudit({ tools, teamSize, useCase });

    // Generate AI summary
    let aiSummary = generateFallbackSummary(auditResult, useCase);
    try {
      const aiRes = await generateAISummary(auditResult, useCase, teamSize);
      if (aiRes) aiSummary = aiRes;
    } catch (e) {
      console.error("AI summary failed, using fallback:", e.message);
    }

    // Create shareable ID
    const shareId = uuidv4();

    // Store in Supabase (best effort — don't fail the request if DB is down)
    const publicData = {
      id: shareId,
      audit_results: auditResult.results.map(r => ({
        toolName: r.toolName,
        planName: r.planName,
        status: r.status,
        savingsMonthly: r.savingsMonthly,
        recommendations: r.recommendations,
      })),
      total_monthly_savings: auditResult.totalMonthlySavings,
      total_annual_savings: auditResult.totalAnnualSavings,
      total_current_spend: auditResult.totalCurrentSpend,
      cross_tool_insights: auditResult.crossToolInsights,
      ai_summary: aiSummary,
      use_case: useCase,
      team_size: teamSize,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("audits").insert([publicData]);
    } catch (dbErr) {
      console.error("DB store failed:", dbErr.message);
      // Continue — don't fail the user request
    }

    return NextResponse.json({ id: shareId, ...publicData });
  } catch (err) {
    console.error("Audit API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateAISummary(auditResult, useCase, teamSize) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "placeholder_anthropic_key") {
    return null;
  }

  const toolSummaries = auditResult.results.map(r =>
    `${r.toolName} (${r.planName}): $${r.currentMonthlySpend}/mo, status=${r.status}, savings=$${r.savingsMonthly}`
  ).join("\n");

  const prompt = `You are an AI spend analyst. Write a concise, personalized 80-100 word summary for a startup audit report.

Team context: ${teamSize} person team, primary use case: ${useCase}
Current total spend: $${auditResult.totalCurrentSpend}/mo
Potential monthly savings: $${auditResult.totalMonthlySavings}/mo

Tool breakdown:
${toolSummaries}

Write a professional, specific, honest summary. Mention the biggest savings opportunity by name. If savings are minimal, say so honestly. Do not use phrases like "In conclusion" or "Overall". Be direct. 80-100 words only.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "~anthropic/claude-haiku-latest",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text || null;
}

function generateFallbackSummary(auditResult, useCase) {
  const { totalMonthlySavings, totalAnnualSavings, results } = auditResult;
  const topSaving = [...results].sort((a, b) => b.savingsMonthly - a.savingsMonthly)[0];

  if (totalMonthlySavings <= 0) {
    return `Your team's AI tool stack is well-optimized for ${useCase} work. Current spending aligns with your team size and use case — no immediate changes recommended. We'll notify you when new pricing changes create savings opportunities. Keep monitoring as vendors update their plans, especially around enterprise tier thresholds.`;
  }

  return `Your team could save $${totalMonthlySavings.toFixed(0)}/month ($${totalAnnualSavings.toFixed(0)}/year) on AI tools. The biggest opportunity is ${topSaving.toolName}, where ${topSaving.recommendations[0]?.message?.slice(0, 120)}... Implementing these recommendations doesn't require changing how your team works — just smarter plan selection. Review each suggestion and prioritize the highest-confidence items first.`;
}
