import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";

// Lets the admin UI record an event. Admins only; the actor is always taken
// from the verified session, never from the request body.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const body = (await request.json().catch(() => ({}))) as {
    event?: string;
    entityType?: string;
    entityId?: string | number;
    details?: Record<string, unknown>;
  };

  if (!body.event || !body.entityType || body.entityId === undefined || body.entityId === null) {
    return NextResponse.json(
      { ok: false, error: "event, entityType and entityId are required" },
      { status: 400 },
    );
  }

  const saved = await writeAuditLog(admin.supabase, {
    event: body.event,
    entityType: body.entityType,
    entityId: body.entityId,
    actor: admin.email,
    details: body.details,
  });

  if (!saved) {
    return NextResponse.json({ ok: false, error: "Audit log insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
