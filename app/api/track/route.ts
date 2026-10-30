import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/adminAuth";

// Records anonymous interest in a school: a profile view or an "add to compare".
// No personal data is stored: just which school, what happened, and when.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TYPES = new Set(["view", "compare_add"]);
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i;

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOTS.test(userAgent)) return new NextResponse(null, { status: 204 });

  const body = (await request.json().catch(() => null)) as { schoolId?: unknown; type?: unknown } | null;
  const schoolId = typeof body?.schoolId === "string" ? body.schoolId : "";
  const type = typeof body?.type === "string" ? body.type : "";
  if (!UUID.test(schoolId) || !TYPES.has(type)) return new NextResponse(null, { status: 204 });

  const supabase = getServiceClient();
  if (!supabase) return new NextResponse(null, { status: 204 });

  // Only count interest in schools parents can actually see.
  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("id", schoolId)
    .eq("status", "published")
    .maybeSingle();
  if (school) {
    const { error } = await supabase.from("school_events").insert({ school_id: schoolId, event_type: type });
    if (error) console.error("Track insert failed:", error.message);
  }
  return new NextResponse(null, { status: 204 });
}
