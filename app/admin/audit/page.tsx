"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";

type AuditEntry = {
  id: number;
  event: string;
  entity_type: string;
  entity_id: string;
  actor: string;
  details: string | null;
  created_at: string;
};

const fallbackEntries: AuditEntry[] = [
  {
    id: 1,
    event: "ai_review_generated",
    entity_type: "application",
    entity_id: "12",
    actor: "admin-user",
    details: '{"status":"submitted","school":"Northview Academy"}',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 2,
    event: "status_updated",
    entity_type: "application",
    entity_id: "12",
    actor: "admin-user",
    details: '{"next_status":"in_review","source":"ai_recommendation"}',
    created_at: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
  },
  {
    id: 3,
    event: "ai_review_generated",
    entity_type: "application",
    entity_id: "23",
    actor: "admin-user",
    details: '{"status":"accepted","school":"Summit School"}',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudit = async () => {
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Audit fetch failed, using fallback data:", error);
          setEntries(fallbackEntries);
          return;
        }

        setEntries((data as AuditEntry[]) || fallbackEntries);
      } catch (error) {
        console.error("Unexpected audit load error:", error);
        setEntries(fallbackEntries);
      } finally {
        setLoading(false);
      }
    };

    loadAudit();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">System activity</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Audit log</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-800">{entry.event}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {entry.entity_type} #{entry.entity_id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{entry.actor}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {entry.details ? JSON.parse(entry.details).next_status || JSON.parse(entry.details).status || entry.details : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}













































































































































































































audit"}]}    
