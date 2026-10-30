"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import supabase from "@/lib/supabaseClient";
import { adminFetch } from "@/lib/adminFetch";
import { BOARDING_LABELS, CURRICULUM_OPTIONS, GENDER_LABELS, SCHOOL_COLUMNS, TYPE_LABELS, type School } from "@/lib/schools";

type FormState = Record<string, string>;

const TEXT_FIELDS: { key: keyof School; label: string; hint?: string; long?: boolean }[] = [
  { key: "name", label: "School name" },
  { key: "suburb", label: "Suburb or area", hint: "e.g. Borrowdale" },
  { key: "city", label: "City or town" },
  { key: "province", label: "Province" },
  { key: "levels", label: "Levels", hint: "e.g. Forms 1–6, or ECD to Grade 7" },
  { key: "gender_note", label: "Note on pupils", hint: "e.g. Girls in Sixth Form only" },
  { key: "religion", label: "Religious ethos" },
  { key: "founded", label: "Founded" },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "description", label: "Short description", long: true, hint: "One or two plain sentences parents will see first." },
];

function toForm(school: School): FormState {
  const form: FormState = {};
  for (const [key, value] of Object.entries(school)) {
    if (Array.isArray(value)) continue;
    form[key] = value == null ? "" : String(value);
  }
  return form;
}

export default function EditSchoolPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("schools").select(SCHOOL_COLUMNS).eq("id", params.id).maybeSingle();
      const row = (data as unknown as School | null) ?? null;
      setSchool(row);
      if (row) {
        setForm(toForm(row));
        setCurriculum(row.curriculum ?? []);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const toggleCurriculum = (option: string) =>
    setCurriculum((current) => (current.includes(option) ? current.filter((c) => c !== option) : [...current, option]));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!school) return;

    const fields: Record<string, unknown> = { curriculum };
    for (const field of TEXT_FIELDS) fields[field.key] = form[field.key] ?? "";
    for (const key of ["school_type", "gender", "boarding", "fees_text", "fees_source"]) fields[key] = form[key] ?? "";
    for (const key of ["fee_term_min_usd", "fee_term_max_usd"]) {
      const raw = (form[key] ?? "").replace(/[^0-9.]/g, "");
      fields[key] = raw === "" ? null : Number(raw);
    }

    setSaving(true);
    const response = await adminFetch(`/api/admin/schools/${school.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    const result = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      toast.error(result?.error ?? "Changes weren't saved.");
      return;
    }
    const count = (result.changedFields ?? []).length;
    toast.success(count ? `Saved ${count} change${count === 1 ? "" : "s"}` : "No changes to save");
    router.push("/admin/schools");
  };

  if (loading) return <p className="text-slate-600">Loading school…</p>;
  if (!school) return <p className="text-slate-600">School not found.</p>;

  const input = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900";
  const label = "block text-sm font-medium text-slate-800";
  const hint = "mt-1 text-xs text-slate-500";

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit {school.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {school.status === "published" ? "This school is live. Changes show on SchoolSpot within a minute." : "Hidden draft."}
          </p>
        </div>
        <Link href={`/admin/schools/${school.id}/preview`} className="text-sm text-sky-700 underline">
          Preview
        </Link>
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Fees</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fee_term_min_usd" className={label}>Lowest fee per term (US$)</label>
            <input id="fee_term_min_usd" inputMode="numeric" value={form.fee_term_min_usd ?? ""} onChange={set("fee_term_min_usd")} className={input} />
            <p className={hint}>Used for the fee filter and the &quot;About US$… a term&quot; line.</p>
          </div>
          <div>
            <label htmlFor="fee_term_max_usd" className={label}>Highest fee per term (US$, optional)</label>
            <input id="fee_term_max_usd" inputMode="numeric" value={form.fee_term_max_usd ?? ""} onChange={set("fee_term_max_usd")} className={input} />
            <p className={hint}>Fill in for a range, e.g. day vs boarding or junior vs senior.</p>
          </div>
        </div>
        <div>
          <label htmlFor="fees_text" className={label}>Fee details parents will read</label>
          <textarea id="fees_text" rows={3} value={form.fees_text ?? ""} onChange={set("fees_text")} className={input} />
          <p className={hint}>e.g. Day US$3,950 a term; boarding US$6,100 a term (2026 Term 3). Plus US$500 registration.</p>
        </div>
        <div>
          <label htmlFor="fees_source" className={label}>Where the fees came from</label>
          <input id="fees_source" value={form.fees_source ?? ""} onChange={set("fees_source")} className={input} />
          <p className={hint}>e.g. Confirmed by the bursar by phone, 4 November 2026.</p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">About the school</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="school_type" className={label}>Type</label>
            <select id="school_type" value={form.school_type ?? ""} onChange={set("school_type")} className={input}>
              <option value="">Not set</option>
              {Object.entries(TYPE_LABELS).map(([value, text]) => (
                <option key={value} value={value}>{text}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gender" className={label}>Pupils</label>
            <select id="gender" value={form.gender ?? ""} onChange={set("gender")} className={input}>
              <option value="">Not set</option>
              {Object.entries(GENDER_LABELS).map(([value, text]) => (
                <option key={value} value={value}>{text}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="boarding" className={label}>Day or boarding</label>
            <select id="boarding" value={form.boarding ?? ""} onChange={set("boarding")} className={input}>
              <option value="">Not set</option>
              {Object.entries(BOARDING_LABELS).map(([value, text]) => (
                <option key={value} value={value}>{text}</option>
              ))}
            </select>
          </div>
        </div>
        <fieldset>
          <legend className={label}>Curriculum</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {CURRICULUM_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 text-slate-800">
                <input type="checkbox" checked={curriculum.includes(option)} onChange={() => toggleCurriculum(option)} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key} className={field.long ? "sm:col-span-2" : ""}>
              <label htmlFor={field.key} className={label}>{field.label}</label>
              {field.long ? (
                <textarea id={field.key} rows={3} value={form[field.key] ?? ""} onChange={set(field.key)} className={input} />
              ) : (
                <input id={field.key} value={form[field.key] ?? ""} onChange={set(field.key)} className={input} />
              )}
              {field.hint && <p className={hint}>{field.hint}</p>}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <Link href="/admin/schools" className="text-slate-600 underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
