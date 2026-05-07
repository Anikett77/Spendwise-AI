"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOL_LIST } from "../../lib/pricing";

const USE_CASES = [
  { id: "coding", label: "Coding / Engineering", emoji: "💻" },
  { id: "writing", label: "Writing / Content", emoji: "✍️" },
  { id: "data", label: "Data / Analytics", emoji: "📊" },
  { id: "research", label: "Research", emoji: "🔍" },
  { id: "mixed", label: "Mixed", emoji: "🔀" },
];

function ToolRow({
  entry,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
  const tool = TOOL_LIST.find(
    (t) => t.id === entry.toolId
  );

  const plans = tool?.plans || [];

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 xl:grid-cols-[2fr_1.5fr_80px_110px_40px]">
        {/* Tool */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            AI Tool
          </label>

          <select
            value={entry.toolId}
            onChange={(e) =>
              onChange(index, "toolId", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
          >
            <option value="">Select tool...</option>

            {TOOL_LIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.logo} {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Plan
          </label>

          <select
            value={entry.planId}
            onChange={(e) =>
              onChange(index, "planId", e.target.value)
            }
            disabled={!entry.toolId}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select plan...</option>

            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.pricePerSeat > 0
                  ? ` — $${p.pricePerSeat}/seat`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Seats
          </label>

          <input
            type="number"
            min={1}
            value={entry.seats}
            onChange={(e) =>
              onChange(
                index,
                "seats",
                parseInt(e.target.value) || 1
              )
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        {/* Monthly spend */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            $/month
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              $
            </span>

            <input
              type="number"
              min={0}
              value={entry.monthlySpend}
              onChange={(e) =>
                onChange(
                  index,
                  "monthlySpend",
                  parseFloat(e.target.value) || 0
                )
              }
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Remove */}
        <div className="flex items-end">
          <button
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const router = useRouter();

  const [tools, setTools] = useState([
    {
      toolId: "",
      planId: "",
      seats: 1,
      monthlySpend: "",
    },
  ]);

  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("audit_form");

      if (saved) {
        const d = JSON.parse(saved);

        if (d.tools?.length) setTools(d.tools);
        if (d.teamSize) setTeamSize(d.teamSize);
        if (d.useCase) setUseCase(d.useCase);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "audit_form",
      JSON.stringify({
        tools,
        teamSize,
        useCase,
      })
    );
  }, [tools, teamSize, useCase]);

  const handleChange = (
    index,
    field,
    value
  ) => {
    setTools((prev) => {
      const next = [...prev];

      next[index] = {
        ...next[index],
        [field]: value,
      };

      if (field === "toolId") {
        next[index].planId = "";
      }

      return next;
    });
  };

  const addTool = () => {
    setTools((prev) => [
      ...prev,
      {
        toolId: "",
        planId: "",
        seats: 1,
        monthlySpend: "",
      },
    ]);
  };

  const removeTool = (i) => {
    setTools((prev) =>
      prev.filter((_, idx) => idx !== i)
    );
  };

  const totalMonthly = tools.reduce(
    (sum, t) =>
      sum + (parseFloat(t.monthlySpend) || 0),
    0
  );

  const isValid =
    tools.some((t) => t.toolId && t.planId) &&
    teamSize &&
    useCase;

  const handleSubmit = async () => {
    if (!isValid) {
      setError(
        "Add at least one tool with a plan, your team size, and use case."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tools: tools.filter(
            (t) => t.toolId && t.planId
          ),
          teamSize: parseInt(teamSize),
          useCase,
        }),
      });

      const data = await res.json();

      if (data.id) {
        sessionStorage.setItem(
          `audit_${data.id}`,
          JSON.stringify(data)
        );

        localStorage.removeItem("audit_form");

        router.push(`/results/${data.id}`);
      } else {
        setError(
          data.error ||
            "Something went wrong. Please try again."
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
              S
            </div>

            <span className="font-bold text-slate-900">
              SpendWise AI
            </span>
          </a>

          <span className="text-sm text-slate-500">
            Step 1 of 1 — Enter your tools
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900">
            Your AI spend audit
          </h1>

          <p className="text-slate-500">
            Add every AI tool your team pays for.
            We'll find where you're overspending.
          </p>
        </div>

        {/* Team section */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-bold text-slate-900">
            About your team
          </h2>

          <div className="grid gap-8 md:grid-cols-[180px_1fr]">
            {/* Team size */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total team size
              </label>

              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) =>
                  setTeamSize(e.target.value)
                }
                placeholder="e.g. 8"
                className="w-full rounded-xl border text-gray-600 border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Primary use case
              </label>

              <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.id}
                    onClick={() => setUseCase(uc.id)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      useCase === uc.id
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {uc.emoji} {uc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tools section */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Your AI tools
            </h2>

            {totalMonthly > 0 && (
              <div className="text-sm text-slate-500">
                Total:{" "}
                <strong className="text-slate-900">
                  ${totalMonthly.toFixed(0)}/mo
                </strong>
              </div>
            )}
          </div>

          {tools.map((entry, i) => (
            <ToolRow
              key={i}
              entry={entry}
              index={i}
              onChange={handleChange}
              onRemove={removeTool}
              canRemove={tools.length > 1}
            />
          ))}

          <button
            onClick={addTool}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            <span className="text-xl leading-none">+</span>
            Add another tool
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <span>ℹ️</span>

          <span>
            Your spend data is used only to generate
            your audit. Email is optional, asked only
            after results are shown.
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className={`flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-bold text-white transition ${
            loading || !isValid
              ? "cursor-not-allowed bg-slate-400"
              : "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 hover:scale-[1.01]"
          }`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Analyzing your spend...
            </>
          ) : (
            "Run my audit →"
          )}
        </button>
      </div>
    </div>
  );
}