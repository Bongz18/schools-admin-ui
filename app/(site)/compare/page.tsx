"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { useCompareList } from "@/lib/compare";
import {
  BOARDING_LABELS,
  GENDER_LABELS,
  SCHOOL_COLUMNS,
  TYPE_LABELS,
  type School,
  feeSummary,
  locationLine,
  schoolHref,
} from "@/lib/schools";

const ROWS: { label: string; value: (s: School) => string | null }[] = [
  { label: "Fees", value: (s) => feeSummary(s) },
  { label: "Location", value: (s) => locationLine(s) },
  { label: "Levels", value: (s) => s.levels },
  {
    label: "Pupils",
    value: (s) => (s.gender ? `${GENDER_LABELS[s.gender] ?? s.gender}${s.gender_note ? ` (${s.gender_note})` : ""}` : null),
  },
  { label: "Day or boarding", value: (s) => (s.boarding ? BOARDING_LABELS[s.boarding] ?? s.boarding : null) },
  { label: "Curriculum", value: (s) => (s.curriculum && s.curriculum.length ? s.curriculum.join(", ") : null) },
  { label: "Type of school", value: (s) => (s.school_type ? TYPE_LABELS[s.school_type] ?? s.school_type : null) },
  { label: "Religious ethos", value: (s) => s.religion },
  { label: "Founded", value: (s) => s.founded },
  { label: "Details checked by school", value: (s) => (s.verified ? "Yes" : "Not yet") },
];

export default function ComparePage() {
  const { ids, remove } = useCompareList();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (ids.length === 0) {
        setSchools([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase.from("schools").select(SCHOOL_COLUMNS).in("id", ids).eq("status", "published");
      if (cancelled) return;
      const rows = (data ?? []) as unknown as School[];
      setSchools(ids.map((id) => rows.find((s) => s.id === id)).filter((s): s is School => !!s));
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Compare schools</h1>

      {loading ? (
        <p className="mt-6 text-granite">Loading your schools…</p>
      ) : schools.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-8">
          <h2 className="font-display text-xl font-semibold text-ink">Pick schools to compare</h2>
          <p className="mt-2 text-ink/80">
            Tap &quot;Add to compare&quot; on up to three schools and they&apos;ll appear here side by side.
          </p>
          <Link
            href="/schools"
            className="mt-5 inline-block rounded-full bg-leaf px-6 py-2.5 font-semibold text-white hover:bg-leaf-dark"
          >
            Find schools
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Side-by-side comparison of the schools you picked</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-44 p-4 align-bottom text-sm font-normal text-granite">
                  {schools.length < 3 ? (
                    <Link href="/schools" className="text-leaf underline hover:text-leaf-dark">Add another school</Link>
                  ) : null}
                </th>
                {schools.map((school) => (
                  <th key={school.id} scope="col" className="p-4 align-bottom">
                    <Link
                      href={schoolHref(school)}
                      className="font-display text-lg font-semibold text-ink hover:text-leaf hover:underline"
                    >
                      {school.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(school.id)}
                      className="mt-1 block text-sm font-normal text-granite underline hover:text-msasa"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 align-top text-sm font-normal text-granite">{row.label}</th>
                  {schools.map((school) => {
                    const value = row.value(school);
                    return (
                      <td
                        key={school.id}
                        className={`p-4 align-top ${
                          row.label === "Fees" ? "font-display text-lg font-semibold text-ink" : "text-ink"
                        } ${value ? "" : "italic text-granite/70"}`}
                      >
                        {value ?? "Not listed yet"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {schools.length > 0 && (
        <p className="mt-4 text-sm text-granite">
          Fees change often. Confirm the current amount with each school before you apply.
        </p>
      )}
    </div>
  );
}
