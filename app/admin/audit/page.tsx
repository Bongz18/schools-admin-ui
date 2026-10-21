import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, entityType, entityId, actor, details } = body || {};

    if (!event || !entityType || entityId === undefined || entityId === null) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabase.from("audit_logs").insert({
      entity_type: entityType,
      entity_id: String(entityId),
      event,
      actor: actor || "system",
      details: details ? JSON.stringify(details) : null,
    });

    if (error) {
      console.error("Audit log insert failed:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Audit log route error:", error);
    return NextResponse.json({ ok: true, skipped: true });
  }
}
