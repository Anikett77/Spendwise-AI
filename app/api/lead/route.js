import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    const { email, company, role, teamSize, auditId, monthlySavings } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    try {
      const { error: dbError } = await supabase.from("leads").insert([{
        email,
        company: company || null,
        role: role || null,
        team_size: teamSize || null,
        audit_id: auditId,
        monthly_savings: monthlySavings || 0,
        high_value: (monthlySavings || 0) >= 500,
        created_at: new Date().toISOString(),
      }]);
      if (dbError) console.error("❌ Lead DB error:", dbError.message);
      else console.log("✅ Lead saved:", email);
    } catch (dbErr) {
      console.error("❌ Lead DB exception:", dbErr.message);
    }

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const isHighValue = (monthlySavings || 0) >= 500;

      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: monthlySavings > 0
          ? `Your AI audit — $${Math.round(monthlySavings)}/mo in savings found`
          : "Your AI spend audit is ready",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
            <div style="margin-bottom: 24px;">
              <span style="background: #1d4ed8; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;">SpendWise AI</span>
            </div>

            <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 8px;">
              ${monthlySavings > 0
                ? `We found $${Math.round(monthlySavings)}/mo in savings`
                : "Your audit is ready"}
            </h1>

            <p style="color: #64748b; font-size: 15px; line-height: 1.6;">
              ${monthlySavings > 0
                ? `Your AI tool stack has <strong style="color:#0f172a;">$${Math.round(monthlySavings)}/month ($${Math.round(monthlySavings * 12)}/year)</strong> in potential savings. Here's your full breakdown:`
                : "Your AI tool stack looks well-optimized. Here's your full audit:"}
            </p>

            <a href="${appUrl}/results/${auditId}"
              style="display: inline-block; margin: 24px 0; background: #1d4ed8; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
              View full audit report →
            </a>

            ${isHighValue ? `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #334155;">
                💡 <strong>Your savings opportunity is significant.</strong> Credex offers discounted AI credits (Claude, ChatGPT, Cursor) that could increase your savings further.
                <a href="https://credex.rocks" style="color: #1d4ed8;">Learn more →</a>
              </p>
            </div>` : ""}

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
            <p style="color: #94a3b8; font-size: 13px;">
              You received this because you ran an audit on SpendWise AI.
              ${company ? `Company: ${company}.` : ""}
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("❌ Resend error:", error);
      } else {
        console.log("✅ Email sent to:", email, "id:", data?.id);
      }
    } catch (emailErr) {
      console.error("❌ Email exception:", emailErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}