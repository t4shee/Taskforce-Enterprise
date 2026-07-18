import { NextResponse } from "next/server";
import { supabase } from "../../config/supabase";

// 🛡️ ABSOLUTE CACHE KILLERS FOR VERCEL & LOCALHOST
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "daily";

  let days = 1;
  if (filter === "weekly") days = 7;
  if (filter === "monthly") days = 30;

  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  // Fetch from Supabase
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .gte("timestamp", dateThreshold.toISOString())
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("GET DB ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scan_id = "SCN-" + Math.floor(1000 + Math.random() * 9000);

    // 🛡️ THE FIX: Forcefully convert any decimal scores (like 51.6) into integers (52) 
    // so the PostgreSQL INT column accepts the data without crashing!
    const safeRisk = Math.round(Number(body.risk)) || 0;

    console.log("Attempting to save rounded risk score:", safeRisk); 

    const { data, error } = await supabase
      .from("scans")
      .insert([{
        scan_id: scan_id,
        target: body.target || "Unknown",
        risk: safeRisk,
        status: body.status || "Unknown",
        timestamp: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error("SUPABASE POST REJECTION:", error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error("CRITICAL API POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}