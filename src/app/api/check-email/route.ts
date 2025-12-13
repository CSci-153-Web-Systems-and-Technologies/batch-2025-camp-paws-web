import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toString().trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Server not configured for email lookup" }, { status: 500 });
    }

    const url = `${supabaseUrl}/rest/v1/users?select=id&email=eq.${encodeURIComponent(
      email
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase lookup error:", res.status, text);
      return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
    }

    const data = await res.json();
    const exists = Array.isArray(data) && data.length > 0;

    return NextResponse.json({ exists });
  } catch (err) {
    console.error("check-email route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
