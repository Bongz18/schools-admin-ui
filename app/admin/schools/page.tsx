"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";
import { feeSummary, locationLine } from "@/lib/schools";

type SchoolRow = {
  id: string;
  name: string;
  slug: string | null;
  suburb: string | null;
  city: string | null;
  fees_text: string | null;
  fee_term_min_usd: number | null;
  fee_term_max_usd: number | null;
  verified: boolean;
  status: string;
};

type Stats = { views: number; compare_adds: number; enquiries: number };

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, Stats>>({});

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("schools")
      .select("id, name, slug, suburb, city, fees_text, fee_term_min_usd, fee_term_max_usd, verified, status")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch schools:", error);
      toast.error("Schools couldn't be loaded. Refresh to try again.");
      setSchools([]);
    } else {
      setSchools((data ?? []) as SchoolRow[]);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data, error } = await supabase.rpc("school_stats", { days: 30 });
    if (error) {
      console.error("Failed to load stats:", error.message);
      return;
    }
    const next: Record<string, Stats> = {};
    for (const row of (data ?? []) as { school_id: string; views: number; compare_adds: number; enquiries: number }[]) {
      next[row.school_id] = {
        views: Number(row.views),
        compare_adds: Number(row.compare_adds),
        enquiries: Number(row.enquiries),
      };
    }
    setStats(next);
  };

  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  const update = async (school: SchoolRow, change: { verified?: boolean; status?: string }, message: string) => {
    setSavingId(school.id);
    const response = await adminFetch(`/api/admin/schools/${school.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change),
    });
    const result = await response.json().catch(() => ({}));
    setSavingId(null);

    if (!response.ok) {
      toast.error(result?.error ?? "That change wasn't saved.");
      return;
    }
    toast.success(message);
    setSchools((current) =>
      current.map((row) => (row.id === school.id ? { ...row, verified: result.verified, status: result.status } : row)),
    );
  };

  const filtered = schools.filter((school) => school.name.toLowerCase().includes(search.toLowerCase()));
  const publishedCount = schools.filter((s) => s.status === "published").length;
  const verifiedCount = schools.filter((s) => s.verified).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Schools</h1>
          <p className="mt-1 text-sm text-slate-600">
            {schools.length} schools · {verifiedCount} verified · {publishedCount} live on SchoolSpot · views,
            compares and enquiries are for the last 30 days
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search schools"
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 md:max-w-xs"
        />
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Check a school&apos;s details with the school first, then click <strong>Mark verified</strong>. Only verified
        schools can be published. Use <strong>Preview</strong> to see a draft exactly as parents will.
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Fees</th>
                <th className="px-4 py-3" title="Last 30 days">Views</th>
                <th className="px-4 py-3" title="Last 30 days">Compares</th>
                <th className="px-4 py-3" title="Last 30 days">Enquiries</th>
                <th className="px-4 py-3">Checked</th>
                <th className="px-4 py-3">On SchoolSpot</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((school) => {
                const busy = savingId === school.id;
                const live = school.status === "published";
                return (
                  <tr key={school.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{school.name}</div>
                      <div className="text-slate-500">{locationLine(school)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{feeSummary(school)}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">{stats[school.id]?.views ?? 0}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">{stats[school.id]?.compare_adds ?? 0}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">{stats[school.id]?.enquiries ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          school.verified ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {school.verified ? "Verified" : "Not verified"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {live && school.slug ? (
                        <a href={`/schools/${school.slug}`} target="_blank" rel="noopener noreferrer" className="text-sky-700 underline">
                          Live
                        </a>
                      ) : (
                        <span className="text-slate-500">Hidden draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/admin/schools/${school.id}/edit`}
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/schools/${school.id}/preview`}
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Preview
                        </Link>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            school.verified
                              ? window.confirm(
                                  live
                                    ? `Unverifying ${school.name} will also hide it from SchoolSpot. Continue?`
                                    : `Mark ${school.name} as not verified?`,
                                ) && update(school, { verified: false }, "Marked not verified")
                              : window.confirm(`Have you checked ${school.name}'s details with the school?`) &&
                                update(school, { verified: true }, "Marked verified")
                          }
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {school.verified ? "Unverify" : "Mark verified"}
                        </button>
                        <button
                          type="button"
                          disabled={busy || (!school.verified && !live)}
                          title={!school.verified && !live ? "Verify this school first" : undefined}
                          onClick={() =>
                            live
                              ? update(school, { status: "draft" }, "Hidden from SchoolSpot")
                              : window.confirm(`Publish ${school.name}? Parents will be able to see it.`) &&
                                update(school, { status: "published" }, "Published")
                          }
                          className={`rounded px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
                            live ? "border border-slate-300 text-slate-700 hover:bg-slate-50" : "bg-emerald-700 text-white hover:bg-emerald-800"
                          }`}
                        >
                          {live ? "Hide" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No schools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
