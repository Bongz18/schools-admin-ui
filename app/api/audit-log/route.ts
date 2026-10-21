import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      event?: string;
      entityType?: string;
      entityId?: string | number;
      actor?: string;
      details?: Record<string, unknown>;
    };

    const event = body.event;
    const entityType = body.entityType;
    const entityId = body.entityId;

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
      actor: body.actor || "system",
      details: body.details ? JSON.stringify(body.details) : null,
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
