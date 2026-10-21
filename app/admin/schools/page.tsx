"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

type School = {
  id: number | string;
  name?: string | null;
  created_at?: string | null;
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("schools").select("id, name, created_at").order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Failed to fetch schools:", error);
        toast.error("Failed to load schools");
        setSchools([]);
        return;
      }

      setSchools((data ?? []) as School[]);
    } catch (error) {
      console.error("Unexpected schools fetch error:", error);
      toast.error("Unexpected schools fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter((school) => {
    const name = school.name ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Schools</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search schools"
          className="w-full rounded border border-slate-300 px-3 py-2 md:max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={String(school.id)} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-800">#{String(school.id)}</td>
                  <td className="px-4 py-3 text-slate-700">{school.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {school.created_at ? new Date(school.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}

              {!filteredSchools.length && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
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
