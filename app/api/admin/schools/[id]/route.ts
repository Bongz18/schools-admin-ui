import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";

// Admin-only: edit a school's details, mark them verified, and publish or hide the school.
// A school can only be published once it has been verified. Every change is audit-logged.

type FieldRule =
  | { kind: "text"; max: number }
  | { kind: "number" }
  | { kind: "choice"; options: string[] }
  | { kind: "list"; options: string[] }
  | { kind: "lines"; max: number; each: number }
  | { kind: "contacts"; max: number };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EDITABLE: Record<string, FieldRule> = {
  name: { kind: "text", max: 160 },
  school_type: { kind: "choice", options: ["private", "trust", "mission", "government", "international"] },
  city: { kind: "text", max: 80 },
  suburb: { kind: "text", max: 120 },
  address: { kind: "text", max: 200 },
  province: { kind: "text", max: 80 },
  levels: { kind: "text", max: 120 },
  gender: { kind: "choice", options: ["girls", "boys", "coed"] },
  gender_note: { kind: "text", max: 200 },
  boarding: { kind: "choice", options: ["day", "day_boarding", "boarding"] },
  curriculum: { kind: "list", options: ["Cambridge", "ZIMSEC", "IB", "British"] },
  religion: { kind: "text", max: 120 },
  founded: { kind: "text", max: 40 },
  fees_text: { kind: "text", max: 600 },
  fee_term_min_usd: { kind: "number" },
  fee_term_max_usd: { kind: "number" },
  fees_source: { kind: "text", max: 300 },
  website: { kind: "text", max: 200 },
  phone: { kind: "text", max: 60 },
  email: { kind: "text", max: 160 },
  description: { kind: "text", max: 1500 },
  highlights: { kind: "lines", max: 12, each: 300 },
  contacts: { kind: "contacts", max: 10 },
};

function cleanField(rule: FieldRule, value: unknown): { ok: true; value: unknown } | { ok: false } {
  if (value === null || value === "") {
    return { ok: true, value: rule.kind === "list" || rule.kind === "lines" || rule.kind === "contacts" ? [] : null };
  }
  switch (rule.kind) {
    case "text":
      return typeof value === "string" ? { ok: true, value: value.trim().slice(0, rule.max) || null } : { ok: false };
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) && n >= 0 && n < 1_000_000 ? { ok: true, value: Math.round(n) } : { ok: false };
    }
    case "choice":
      return typeof value === "string" && rule.options.includes(value) ? { ok: true, value } : { ok: false };
    case "lines": {
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) return { ok: false };
      const lines = value.map((v) => v.trim().slice(0, rule.each)).filter(Boolean);
      return lines.length <= rule.max ? { ok: true, value: lines } : { ok: false };
    }
    case "contacts": {
      if (!Array.isArray(value) || value.length > rule.max) return { ok: false };
      const contacts: { label: string; email: string }[] = [];
      for (const item of value) {
        const label = typeof item?.label === "string" ? item.label.trim().slice(0, 80) : "";
        const email = typeof item?.email === "string" ? item.email.trim().toLowerCase() : "";
        if (!label || !EMAIL.test(email)) return { ok: false };
        contacts.push({ label, email });
      }
      return { ok: true, value: contacts };
    }
    case "list":
      return Array.isArray(value) && value.every((v) => typeof v === "string" && rule.options.includes(v))
        ? { ok: true, value: Array.from(new Set(value)) }
        : { ok: false };
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    verified?: unknown;
    status?: unknown;
    fields?: Record<string, unknown>;
  };

  const { data: current, error: readError } = await admin.supabase
    .from("schools")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (readError) return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  if (!current) return NextResponse.json({ ok: false, error: "School not found" }, { status: 404 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const changed: Record<string, { from: unknown; to: unknown }> = {};

  // Detail edits
  if (body.fields && typeof body.fields === "object") {
    for (const [key, raw] of Object.entries(body.fields)) {
      const rule = EDITABLE[key];
      if (!rule) continue;
      const result = cleanField(rule, raw);
      if (!result.ok) {
        return NextResponse.json({ ok: false, error: `"${key}" has an invalid value` }, { status: 400 });
      }
      const empty = rule.kind === "list" || rule.kind === "lines" || rule.kind === "contacts" ? [] : null;
      if (JSON.stringify(result.value) !== JSON.stringify(current[key] ?? empty)) {
        update[key] = result.value;
        changed[key] = { from: current[key], to: result.value };
      }
    }
    if (update.name === null) {
      return NextResponse.json({ ok: false, error: "The school needs a name." }, { status: 400 });
    }
    const min = (update.fee_term_min_usd ?? current.fee_term_min_usd) as number | null;
    const max = (update.fee_term_max_usd ?? current.fee_term_max_usd) as number | null;
    if (min != null && max != null && max < min) {
      return NextResponse.json({ ok: false, error: "The highest fee can't be lower than the lowest fee." }, { status: 400 });
    }
  }

  // Verify / publish
  if (typeof body.verified === "boolean") update.verified = body.verified;
  if (body.status === "published" || body.status === "draft") update.status = body.status;

  const nextVerified = (update.verified ?? current.verified) as boolean;
  const nextStatus = (update.status ?? current.status) as string;

  if (nextStatus === "published" && !nextVerified) {
    return NextResponse.json({ ok: false, error: "Mark this school as verified before publishing it." }, { status: 400 });
  }
  // Un-verifying a published school also hides it.
  if (update.verified === false && current.status === "published") update.status = "draft";

  const { data: saved, error } = await admin.supabase.from("schools").update(update).eq("id", id).select("*").maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const statusChanged = "verified" in update || "status" in update;
  if (statusChanged || Object.keys(changed).length) {
    await writeAuditLog(admin.supabase, {
      event: Object.keys(changed).length ? "school_edited" : "school_updated",
      entityType: "school",
      entityId: id,
      actor: admin.email,
      details: {
        school: current.name,
        ...(Object.keys(changed).length ? { fields: changed } : {}),
        ...(statusChanged
          ? {
              previous: { verified: current.verified, status: current.status },
              next: { verified: update.verified ?? current.verified, status: update.status ?? current.status },
            }
          : {}),
      },
    });
  }

  return NextResponse.json({
    ok: true,
    verified: saved?.verified ?? nextVerified,
    status: saved?.status ?? nextStatus,
    school: saved,
    changedFields: Object.keys(changed),
  });
}
