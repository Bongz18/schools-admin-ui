import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";

const ALLOWED_STATUSES = ["submitted", "in_review", "accepted", "rejected"];

// Changes an application's status. Only admins can call it, and every change
// is written to the audit log with who made it and what it was before.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string; source?: string };
  const nextStatus = body.status;

  if (!nextStatus || !ALLOWED_STATUSES.includes(nextStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const { data: current, error: readError } = await admin.supabase
    .from("applications")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  }
  if (!current) {
    return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
  }

  const { error: updateError } = await admin.supabase
    .from("applications")
    .update({ status: nextStatus })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  await writeAuditLog(admin.supabase, {
    event: "status_updated",
    entityType: "application",
    entityId: id,
    actor: admin.email,
    details: {
      previous_status: current.status,
      next_status: nextStatus,
      source: body.source === "ai_recommendation" ? "ai_recommendation" : "manual",
    },
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
