
export const TOOLS = {
  cursor: {
    name: "Cursor",
    logo: "⚡",
    color: "#6366f1",
    plans: {
      hobby: { name: "Hobby", pricePerSeat: 0, features: ["2000 completions/mo", "50 slow requests"] },
      pro: { name: "Pro", pricePerSeat: 20, features: ["Unlimited completions", "500 fast requests", "10 Claude Opus uses"] },
      business: { name: "Business", pricePerSeat: 40, features: ["All Pro features", "Team management", "SSO", "Audit logs"] },
      enterprise: { name: "Enterprise", pricePerSeat: 100, features: ["Custom contracts", "Dedicated support", "On-prem options"] },
    },
    category: "coding",
  },
  github_copilot: {
    name: "GitHub Copilot",
    logo: "🐙",
    color: "#24292e",
    plans: {
      individual: { name: "Individual", pricePerSeat: 10, features: ["Code completions", "Chat", "CLI"] },
      business: { name: "Business", pricePerSeat: 19, features: ["All Individual", "Policy management", "Audit logs"] },
      enterprise: { name: "Enterprise", pricePerSeat: 39, features: ["All Business", "Copilot Workspace", "Custom models"] },
    },
    category: "coding",
  },
  claude: {
    name: "Claude (Anthropic)",
    logo: "✦",
    color: "#d97706",
    plans: {
      free: { name: "Free", pricePerSeat: 0, features: ["Limited messages", "Claude 3 Haiku only"] },
      pro: { name: "Pro", pricePerSeat: 20, features: ["5x more usage", "Claude Opus 4", "Projects"] },
      max: { name: "Max", pricePerSeat: 100, features: ["20x more usage vs Pro", "Priority access"] },
      team: { name: "Team", pricePerSeat: 30, features: ["All Pro features", "Shared projects", "Admin dashboard"], minSeats: 5 },
      enterprise: { name: "Enterprise", pricePerSeat: 60, features: ["SSO", "Custom retention", "Dedicated support"], minSeats: 25 },
      api: { name: "API Direct", pricePerSeat: 0, features: ["Pay per token", "No seat limits"], isApiPricing: true },
    },
    category: "mixed",
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    logo: "🤖",
    color: "#10a37f",
    plans: {
      free: { name: "Free", pricePerSeat: 0, features: ["GPT-4o mini", "Limited GPT-4o"] },
      plus: { name: "Plus", pricePerSeat: 20, features: ["GPT-4o", "DALL·E", "Plugins"] },
      team: { name: "Team", pricePerSeat: 30, features: ["All Plus", "Workspace", "No data training"], minSeats: 2 },
      enterprise: { name: "Enterprise", pricePerSeat: 60, features: ["All Team", "SSO", "Advanced admin"], minSeats: 150 },
      api: { name: "API Direct", pricePerSeat: 0, features: ["Pay per token", "Access to all models"], isApiPricing: true },
    },
    category: "mixed",
  },
  anthropic_api: {
    name: "Anthropic API",
    logo: "⚡",
    color: "#d97706",
    plans: {
      api: { name: "API Direct", pricePerSeat: 0, features: ["Pay per token", "Claude 3 Haiku/Sonnet/Opus"], isApiPricing: true },
    },
    category: "api",
  },
  openai_api: {
    name: "OpenAI API",
    logo: "🔮",
    color: "#10a37f",
    plans: {
      api: { name: "API Direct", pricePerSeat: 0, features: ["Pay per token", "GPT-4, DALL-E, Whisper"], isApiPricing: true },
    },
    category: "api",
  },
  gemini: {
    name: "Gemini (Google)",
    logo: "💎",
    color: "#4285f4",
    plans: {
      free: { name: "Free", pricePerSeat: 0, features: ["Gemini 1.5 Flash", "Basic features"] },
      advanced: { name: "Advanced", pricePerSeat: 20, features: ["Gemini 1.5 Pro", "2TB storage", "Priority access"] },
      business: { name: "Business", pricePerSeat: 24, features: ["All Advanced", "Workspace integration", "Admin controls"] },
      enterprise: { name: "Enterprise", pricePerSeat: 36, features: ["All Business", "Dedicated support", "Custom contracts"] },
      api: { name: "API Direct", pricePerSeat: 0, features: ["Pay per token", "Gemini 1.5 Flash/Pro"], isApiPricing: true },
    },
    category: "mixed",
  },
  windsurf: {
    name: "Windsurf (Codeium)",
    logo: "🏄",
    color: "#06b6d4",
    plans: {
      free: { name: "Free", pricePerSeat: 0, features: ["25 Flow credits/mo", "Basic completions"] },
      pro: { name: "Pro", pricePerSeat: 15, features: ["Unlimited completions", "500 premium credits/mo"] },
      teams: { name: "Teams", pricePerSeat: 35, features: ["All Pro", "Team management", "Analytics"] },
      enterprise: { name: "Enterprise", pricePerSeat: 60, features: ["All Teams", "SSO", "Custom LLM"] },
    },
    category: "coding",
  },
};

export const TOOL_LIST = Object.entries(TOOLS).map(([id, tool]) => ({
  id,
  name: tool.name,
  logo: tool.logo,
  color: tool.color,
  plans: Object.entries(tool.plans).map(([planId, plan]) => ({
    id: planId,
    ...plan,
  })),
  category: tool.category,
}));
