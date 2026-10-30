import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";

// Admin-only: mark a school's details as verified, and publish or hide it.
// A school can only be published once it has been verified.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { verified?: unknown; status?: unknown };

  const { data: current, error: readError } = await admin.supabase
    .from("schools")
    .select("id, name, verified, status")
    .eq("id", id)
    .maybeSingle();

  if (readError) return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  if (!current) return NextResponse.json({ ok: false, error: "School not found" }, { status: 404 });

  const update: { verified?: boolean; status?: string; updated_at: string } = { updated_at: new Date().toISOString() };

  if (typeof body.verified === "boolean") update.verified = body.verified;
  if (body.status === "published" || body.status === "draft") update.status = body.status;

  const nextVerified = update.verified ?? current.verified;
  const nextStatus = update.status ?? current.status;

  if (nextStatus === "published" && !nextVerified) {
    return NextResponse.json(
      { ok: false, error: "Mark this school as verified before publishing it." },
      { status: 400 },
    );
  }
  // Un-verifying a published school also hides it.
  if (update.verified === false && current.status === "published") update.status = "draft";

  const { error } = await admin.supabase.from("schools").update(update).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await writeAuditLog(admin.supabase, {
    event: "school_updated",
    entityType: "school",
    entityId: id,
    actor: admin.email,
    details: {
      school: current.name,
      previous: { verified: current.verified, status: current.status },
      next: { verified: update.verified ?? current.verified, status: update.status ?? current.status },
    },
  });

  return NextResponse.json({ ok: true, verified: update.verified ?? current.verified, status: update.status ?? current.status });
}
