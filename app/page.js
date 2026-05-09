"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STATS = [
  { value: "$2,400", label: "avg. annual savings found" },
  { value: "2 min", label: "to complete audit" },
  { value: "8 tools", label: "AI tools analyzed" },
  { value: "100%", label: "free, always" },
];

const LOGOS = [
  { name: "Cursor", symbol: "⚡" },
  { name: "Claude", symbol: "✦" },
  { name: "ChatGPT", symbol: "🤖" },
  { name: "Copilot", symbol: "🐙" },
  { name: "Gemini", symbol: "💎" },
  { name: "Windsurf", symbol: "🏄" },
];

const TESTIMONIALS = [
  {
    quote:
      "Found $840/mo in savings in literally 3 minutes. We were on GitHub Copilot Enterprise for 8 devs — way overkill.",
    name: "A.K.",
    role: "CTO, Series A startup",
  },
  {
    quote:
      "The redundancy check caught that we had 3 coding assistants running simultaneously. Classic.",
    name: "M.R.",
    role: "Engineering Manager",
  },
  {
    quote:
      "Didn't realize Claude Team had a 5-seat minimum. We had 2 users on it. Saved $200/mo instantly.",
    name: "P.S.",
    role: "Founder",
  },
];

export default function Home() {
  const router = useRouter();
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveT((p) => (p + 1) % TESTIMONIALS.length);
    }, 4000);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-white">
              S
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              SpendWise AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 md:block">
              Free, no login required
            </span>

            <button
              onClick={() => router.push("/audit")}
              className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
            >
              Start audit →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-blue-700">
            <span className=""></span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
            Stop overpaying for <br />

            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI tools
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-slate-500 md:text-xl">
            Enter your AI tool subscriptions. Get an instant audit
            showing exactly where you're overspending and how much you
            could save.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push("/audit")}
              className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition hover:scale-[1.02]"
            >
              Get your free audit →
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Analyzes all major AI tools
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                <span className="text-lg">{logo.symbol}</span>
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Mac Browser Mockup */}
<div className="rounded-2xl mb-15 mx-30 border border-gray-200 overflow-hidden shadow-xl">
  
  {/* Mac title bar */}
  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-400" />
      <div className="w-3 h-3 rounded-full bg-yellow-400" />
      <div className="w-3 h-3 rounded-full bg-green-400" />
    </div>
    <div className="flex-1 mx-4 h-6 rounded-md bg-white border border-gray-200 max-w-xs flex items-center px-3 gap-1.5">
      <svg width="10" height="10" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0zm4.5 9l-3.75-3.75"/>
      </svg>
      <span className="text-xs text-gray-400">spendwiseai.com/results/7ef5ef51</span>
    </div>
  </div>

  {/* Dashboard content */}
  <div className="flex bg-white min-h-80">

    {/* Sidebar */}
    <div className="w-44 border-r border-gray-100 p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
        <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">S</div>
        <span className="text-xs font-bold text-slate-900">SpendWise AI</span>
      </div>
      {["Results", "Summary", "Breakdown", "Share"].map((item, i) => (
        <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${i === 0 ? "bg-blue-600 text-white font-medium" : "text-gray-400"}`}>
          <div className={`w-2 h-2 rounded-sm ${i === 0 ? "bg-white/40" : "bg-gray-200"}`} />
          {item}
        </div>
      ))}
    </div>

    {/* Main content */}
    <div className="flex-1 p-4 flex flex-col gap-3 bg-slate-50">

      {/* Savings hero */}
      <div className="rounded-xl bg-slate-900 p-4 text-white">
        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Potential savings found</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-yellow-300">$974</span>
          <span className="text-sm text-white/60 mb-0.5">/month</span>
        </div>
        <p className="text-xs text-white/60 mt-0.5">That&apos;s <strong className="text-white">$11,688/year</strong> back in your budget</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Current spend", val: "$860/mo", color: "text-slate-800" },
          { label: "Savings found", val: "$974/mo", color: "text-green-600" },
          { label: "Tools reviewed", val: "3", color: "text-blue-600" },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-3 bg-white border border-gray-100">
            <div className="text-[10px] text-gray-400 mb-1">{card.label}</div>
            <div className={`text-sm font-bold ${card.color}`}>{card.val}</div>
          </div>
        ))}
      </div>

      {/* Tool cards */}
      <div className="flex flex-col gap-2">
        {[
          { logo: "⚡", name: "Cursor", plan: "Enterprise · 1 seat", saving: "-$700", status: "Review", statusColor: "bg-amber-100 text-amber-700" },
          { logo: "✦", name: "Claude", plan: "Pro · 3 seats", saving: null, status: "Optimal", statusColor: "bg-green-100 text-green-700" },
        ].map(tool => (
          <div key={tool.name} className="rounded-xl bg-white border border-gray-100 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{tool.logo}</span>
              <div>
                <p className="text-xs font-semibold text-slate-800">{tool.name}</p>
                <p className="text-[10px] text-gray-400">{tool.plan}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tool.saving && <span className="text-sm font-bold text-green-600">{tool.saving}</span>}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tool.statusColor}`}>{tool.status}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</div>
            

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white px-6 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 text-4xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </div>

              <div className="text-sm text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-slate-900">
            How it works
          </h2>

          <p className="mb-14 text-center text-slate-500">
            No signup. No credit card. No BS.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                step: "01",
                title: "Enter your tools",
                desc: "List the AI tools your team pays for — plans, seats, and monthly spend.",
              },
              {
                step: "02",
                title: "Get instant audit",
                desc: "Our engine checks every tool against current pricing and your use case.",
              },
              {
                step: "03",
                title: "See your savings",
                desc: "Per-tool breakdown with specific, defensible recommendations.",
              },
              {
                step: "04",
                title: "Share the report",
                desc: "Get a unique shareable link. Email the report to yourself or your team.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <div className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-blue-600">
                  {item.step}
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900">
            What founders say
          </h2>

          <div className="min-h-[220px] rounded-2xl border border-slate-200 bg-white p-8">
            <p className="mb-6 text-xl italic leading-8 text-slate-700">
              "{TESTIMONIALS[activeT].quote}"
            </p>

            <div className="font-semibold text-slate-900">
              {TESTIMONIALS[activeT].name}
            </div>

            <div className="text-sm text-slate-500">
              {TESTIMONIALS[activeT].role}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveT(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeT
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900">
            Ready to find your savings?
          </h2>

          <p className="mb-8 text-lg text-slate-500">
            Takes 2 minutes. Completely free. No signup required.
          </p>

          <button
            onClick={() => router.push("/audit")}
            className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-10 py-5 text-xl font-bold text-white shadow-xl shadow-blue-500/20 transition hover:scale-[1.02]"
          >
            Start your free audit →
          </button>

          <p className="mt-5 text-sm text-slate-400">
            No account needed · Results in under 2 minutes · 100% free
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-10">
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">
              S
            </div>

            <span className="font-bold text-slate-900">
              SpendWise AI
            </span>
          </div>

          <p className="text-sm text-slate-400">
            Pricing data sourced from official vendor pages. Verified
            weekly.
          </p>
        </div>
      </footer>
    </div>
  );
}