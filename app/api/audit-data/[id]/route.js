import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log("🔍 Fetching audit id:", id);
    console.log("🔍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Supabase fetch error:", JSON.stringify(error));
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    if (!data) {
      console.error("❌ No data returned for id:", id);
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    console.log("✅ Audit fetched successfully");
    const { email, company, ...publicData } = data;
    return NextResponse.json(publicData);
  } catch (err) {
    console.error("❌ Server error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}