"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  optimal: {
    label: "Optimal",
    bg: "bg-green-50",
    color: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  warning: {
    label: "Review",
    bg: "bg-yellow-50",
    color: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  critical: {
    label: "Overspending",
    bg: "bg-red-50",
    color: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

function SavingsBanner({ monthly, annual }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (monthly <= 0) {
    return (
      <div className="mb-6 rounded-3xl border border-green-300 bg-gradient-to-br from-green-50 to-green-100 p-10 text-center">
        <div className="mb-3 text-5xl">✅</div>
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-green-800">
          You're spending well
        </h2>
        <p className="text-sm text-green-700">
          Your AI tool stack is well-matched to your team&apos;s needs.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-700 to-blue-600 p-10 text-white">
      <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/5"></div>
      <div className="absolute -bottom-16 -left-5 h-64 w-64 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Potential savings found
        </p>

        <div className="mb-2 flex items-end gap-3">
          <span
            className={`text-6xl font-black tracking-tight text-yellow-300 transition-opacity duration-500 md:text-7xl ${
              shown ? "opacity-100" : "opacity-0"
            }`}
          >
            ${monthly.toFixed(0)}
          </span>

          <span className="mb-2 text-xl text-white/70">/month</span>
        </div>

        <p className="mb-7 text-xl text-white/80">
          That&apos;s{" "}
          <strong className="text-white">
            ${annual.toFixed(0)}/year
          </strong>{" "}
          back in your budget
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium">
            💡 Based on current vendor pricing
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium">
            📊 Specific actionable steps below
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ result, index }) {
  const [expanded, setExpanded] = useState(true);

  const cfg =
    STATUS_CONFIG[result.status] || STATUS_CONFIG.optimal;

  const hasSavings = result.savingsMonthly > 0;

  return (
    <div
      className={`mb-4 overflow-hidden rounded-2xl border bg-white shadow-sm animate-fadeIn ${
        hasSavings ? cfg.border : "border-slate-200"
      }`}
      style={{
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition ${
          hasSavings ? cfg.bg : "bg-white"
        }`}
      >
        <div className="flex flex-1 items-center gap-4">
          <div className="text-3xl">{result.logo}</div>

          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              {result.toolName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {result.planName} · {result.seats} seat
              {result.seats !== 1 ? "s" : ""} ·{" "}
              <strong className="text-slate-700">
                ${result.currentMonthlySpend}/mo
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasSavings && (
            <div className="text-right">
              <div className="text-2xl font-extrabold tracking-tight text-green-700">
                -${result.savingsMonthly.toFixed(0)}
              </div>

              <div className="text-xs text-slate-500">
                per month
              </div>
            </div>
          )}

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 ${cfg.bg} ${cfg.border}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${cfg.dot}`}
            ></span>

            <span className={`text-xs font-semibold ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>

          <span
            className={`text-lg text-slate-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ⌄
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-6 py-5">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className={`flex gap-4 ${
                i > 0 ? "mt-5 border-t border-slate-100 pt-5" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm ${
                  rec.type === "optimal"
                    ? "bg-green-100"
                    : rec.type === "redundancy"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                {rec.type === "optimal"
                  ? "✓"
                  : rec.type === "redundancy"
                  ? "⚠"
                  : "↓"}
              </div>

              <div className="flex-1">
                <p className="text-sm leading-7 text-slate-700">
                  {rec.message}
                </p>

                {rec.savingsMonthly > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-green-700">
                      Saves $
                      {rec.savingsMonthly.toFixed(0)}
                      /mo · $
                      {(rec.savingsMonthly * 12).toFixed(0)}
                      /year
                    </span>

                    {rec.confidence === "high" && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
                        High confidence
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCapture({
  auditId,
  monthlySavings,
  onSubmit,
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Enter valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          company,
          role,
          auditId,
          monthlySavings,
          _hp: "",
        }),
      });

      setDone(true);

      if (onSubmit) onSubmit();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-green-300 bg-green-50 p-8 text-center">
        <div className="mb-2 text-4xl">✉️</div>

        <h3 className="mb-2 text-xl font-bold text-green-800">
          Report sent!
        </h3>

        <p className="text-sm text-green-700">
          Check your inbox for your audit.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <div className="mb-5">
        <h3 className="mb-2 text-xl font-bold text-slate-900">
          📩 Email your report
        </h3>

        <p className="text-sm text-slate-500">
          Get a copy of this audit in your inbox.
        </p>
      </div>

      <div className="mb-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Work Email *
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Company
          </label>

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Role
        </label>

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Founder, CTO..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send my report →"}
      </button>

      <p className="mt-3 text-xs text-slate-400">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

function CredexPromo({ savings }) {
  return (
    <div className="mb-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
        💡 Want more savings?
      </p>

      <h3 className="mb-3 text-2xl font-extrabold tracking-tight">
        Get AI credits at a discount
      </h3>

      <p className="mb-4 text-sm leading-7 text-slate-300">
        Credex sells discounted AI infrastructure credits.
      </p>

      <p className="mb-5 text-sm leading-7 text-slate-400">
        You already found ${savings.toFixed(0)}/mo in savings.
      </p>

      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        Learn about Credex →
      </a>
    </div>
  );
}

export default function ResultsPage({ params }) {
  const router = useRouter();

  const {id} = use(params);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [leadCaptured, setLeadCaptured] =
    useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(
      `audit_${id}`
    );

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    fetch(`/api/audit-data/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError("Audit not found.");
        else setData(d);
      })
      .catch(() => setError("Failed to load audit."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (data) {
      sessionStorage.setItem(
        `audit_${id}`,
        JSON.stringify(data)
      );
    }
  }, [data, id]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/results/${id}`
      : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

          <p className="text-slate-500">
            Loading your audit...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">😕</div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900">
            Audit not found
          </h2>

          <p className="mb-6 text-slate-500">
            This audit may have expired.
          </p>

          <button
            onClick={() => router.push("/audit")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Start new audit
          </button>
        </div>
      </div>
    );
  }

  const {
    audit_results = [],
    total_monthly_savings = 0,
    total_annual_savings = 0,
    total_current_spend = 0,
    cross_tool_insights = [],
    ai_summary,
  } = data || {};

  const showCredex =
    total_monthly_savings >= 500;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-white">
              S
            </div>

            <span className="font-bold text-slate-900">
              SpendWise AI
            </span>
          </a>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {copied ? "✓ Copied!" : "🔗 Share"}
            </button>

            <button
              onClick={() => router.push("/audit")}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white"
            >
              New audit
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Your AI Spend Audit
          </h1>

          <p className="text-slate-500">
            Current spend:{" "}
            <strong className="text-slate-800">
              ${total_current_spend}/mo
            </strong>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <SavingsBanner
              monthly={total_monthly_savings}
              annual={total_annual_savings}
            />

            {ai_summary && (
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    ✦
                  </div>

                  <span className="font-bold text-slate-900">
                    AI Summary
                  </span>
                </div>

                <p className="leading-8 text-slate-700">
                  {ai_summary}
                </p>
              </div>
            )}

            {cross_tool_insights.length > 0 && (
              <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-6">
                <h3 className="mb-3 font-bold text-yellow-800">
                  ⚠️ Cross-tool redundancies
                </h3>

                {cross_tool_insights.map(
                  (insight, i) => (
                    <p
                      key={i}
                      className="mb-2 text-sm leading-7 text-yellow-700"
                    >
                      {insight}
                    </p>
                  )
                )}
              </div>
            )}

            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Per-tool breakdown
            </h2>

            {audit_results.map((result, i) => (
              <ToolCard
                key={i}
                result={result}
                index={i}
              />
            ))}
          </div>

          <div className="sticky top-20 h-fit">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 font-bold text-slate-900">
                Audit summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Current spend
                  </span>

                  <span className="font-bold text-slate-800">
                    ${total_current_spend}/mo
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Monthly savings
                  </span>

                  <span className="font-bold text-green-700">
                    ${total_monthly_savings.toFixed(0)}/mo
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Annual savings
                  </span>

                  <span className="font-bold text-green-700">
                    ${total_annual_savings.toFixed(0)}/yr
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Tools reviewed
                  </span>

                  <span className="font-bold text-slate-800">
                    {audit_results.length}
                  </span>
                </div>
              </div>
            </div>

            {showCredex && (
              <CredexPromo
                savings={total_monthly_savings}
              />
            )}

            {!leadCaptured ? (
              <LeadCapture
                auditId={id}
                monthlySavings={total_monthly_savings}
                onSubmit={() =>
                  setLeadCaptured(true)
                }
              />
            ) : (
              <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-center">
                <div className="mb-2 text-3xl">✅</div>

                <h3 className="font-bold text-green-800">
                  Report sent successfully
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}