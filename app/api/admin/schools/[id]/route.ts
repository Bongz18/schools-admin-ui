import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";
import { cleanFeeGroups } from "@/lib/fees";

// Admin-only: edit a school's details, mark them verified, and publish or hide the school.
// A school can only be published once it has been verified. Every change is audit-logged.

type FieldRule =
  | { kind: "text"; max: number }
  | { kind: "number" }
  | { kind: "choice"; options: string[] }
  | { kind: "list"; options: string[] }
  | { kind: "lines"; max: number; each: number }
  | { kind: "contacts"; max: number }
  | { kind: "feegroups" }
  | { kind: "links"; max: number }
  | { kind: "notice" }
  | { kind: "awards"; max: number };

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
  fee_groups: { kind: "feegroups" },
  fee_currency: { kind: "choice", options: ["USD", "ZiG"] },
  fee_term_min_usd: { kind: "number" },
  fee_term_max_usd: { kind: "number" },
  fees_source: { kind: "text", max: 300 },
  website: { kind: "text", max: 200 },
  phone: { kind: "text", max: 60 },
  email: { kind: "text", max: 160 },
  description: { kind: "text", max: 1500 },
  highlights: { kind: "lines", max: 12, each: 300 },
  contacts: { kind: "contacts", max: 10 },
  social_links: { kind: "links", max: 6 },
  notice: { kind: "notice" },
  awards: { kind: "awards", max: 6 },
};

const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function cleanField(rule: FieldRule, value: unknown): { ok: true; value: unknown } | { ok: false } {
  if (value === null || value === "") {
    return { ok: true, value: rule.kind === "list" || rule.kind === "lines" || rule.kind === "contacts" || rule.kind === "feegroups" || rule.kind === "links" || rule.kind === "awards" ? [] : null };
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
    case "feegroups": {
      const groups = cleanFeeGroups(value);
      return groups ? { ok: true, value: groups } : { ok: false };
    }
    case "links": {
      if (!Array.isArray(value) || value.length > rule.max) return { ok: false };
      const links: { label: string; url: string }[] = [];
      for (const item of value) {
        const label = typeof item?.label === "string" ? item.label.trim().slice(0, 40) : "";
        const url = typeof item?.url === "string" ? item.url.trim() : "";
        if (!label || !/^https:\/\/\S+$/.test(url) || url.length > 300) return { ok: false };
        links.push({ label, url });
      }
      return { ok: true, value: links };
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
    case "notice": {
      if (typeof value !== "object" || Array.isArray(value)) return { ok: false };
      const v = value as Record<string, unknown>;
      const title = str(v.title, 120);
      if (!title) return { ok: true, value: null }; // no title = no notice
      const closesOn = str(v.closes_on, 10);
      const linkUrl = str(v.link_url, 300);
      if (closesOn && !/^\d{4}-\d{2}-\d{2}$/.test(closesOn)) return { ok: false };
      if (linkUrl && !/^https:\/\/\S+$/.test(linkUrl)) return { ok: false };
      return {
        ok: true,
        value: {
          label: str(v.label, 40) || null,
          title,
          body: str(v.body, 400) || null,
          closes_on: closesOn || null,
          link_url: linkUrl || null,
          link_label: str(v.link_label, 60) || null,
        },
      };
    }
    case "awards": {
      if (!Array.isArray(value) || value.length > rule.max) return { ok: false };
      const awards: { count: number | null; title: string; year: string | null; note: string | null }[] = [];
      for (const item of value) {
        const title = str(item?.title, 120);
        if (!title) return { ok: false };
        const rawCount = item?.count;
        const count = rawCount === null || rawCount === undefined || rawCount === "" ? null : Number(rawCount);
        if (count !== null && (!Number.isInteger(count) || count < 1 || count > 9999)) return { ok: false };
        awards.push({ count, title, year: str(item?.year, 20) || null, note: str(item?.note, 200) || null });
      }
      return { ok: true, value: awards };
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
      const empty = rule.kind === "list" || rule.kind === "lines" || rule.kind === "contacts" || rule.kind === "feegroups" || rule.kind === "links" || rule.kind === "awards" ? [] : null;
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
  if (typeof body.verified === "boolean") {
    update.verified = body.verified;
    if (body.verified && !current.verified) update.verified_at = new Date().toISOString();
    if (!body.verified) update.verified_at = null;
  }
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
