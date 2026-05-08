import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Strip identifying info from public view
    const { email, company, ...publicData } = data;
    return NextResponse.json(publicData);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
