import { supabase } from "../../../lib/supabase";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://spendwiseai.com";

export async function generateMetadata({ params }) {
  const { id } = await params;

  let title = "AI Spend Audit — SpendWise AI";
  let description = "See how much this team could save on AI tools.";

  try {
    const { data } = await supabase
      .from("audits")
      .select("total_monthly_savings, total_annual_savings, total_current_spend, use_case")
      .eq("id", id)
      .single();

    if (data) {
      const savings = Math.round(data.total_monthly_savings || 0);
      const annual = Math.round(data.total_annual_savings || 0);
      const spend = Math.round(data.total_current_spend || 0);

      if (savings > 0) {
        title = `$${savings}/mo in AI savings found — SpendWise AI`;
        description = `This ${data.use_case} team is spending $${spend}/mo on AI tools and could save $${savings}/mo ($${annual}/yr). See the full breakdown.`;
      } else {
        title = `AI spend audit: well-optimized stack — SpendWise AI`;
        description = `This team's AI tool stack is already optimized. See the full audit on SpendWise AI.`;
      }
    }
  } catch {
    // Use defaults if DB unavailable
  }

  const ogImageUrl = `${APP_URL}/api/og?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/results/${id}`,
      siteName: "SpendWise AI",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export { default } from "./page.jsx";
