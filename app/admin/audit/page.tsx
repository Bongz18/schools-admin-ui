"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type AuditEntry = {
  id: string; // uuid
  event: string;
  entity_type: string;
  entity_id: string;
  actor: string;
  details: unknown;
  created_at: string;
};

// details is jsonb: usually an object, but older rows may hold a JSON string.
const parseDetails = (raw: unknown): Record<string, unknown> => {
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw !== "string" || !raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadAudit = async () => {
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Audit fetch failed:", error);
          setLoadError(error.message || "Could not load the audit log");
          return;
        }

        setEntries((data as AuditEntry[]) ?? []);
      } catch (error) {
        console.error("Unexpected audit load error:", error);
        setLoadError("Could not load the audit log");
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
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
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
              {entries.map((entry) => {
                const details = parseDetails(entry.details);
                const summary =
                  details.next_status ||
                  details.status ||
                  details.school ||
                  details.parent ||
                  details.source ||
                  "—";

                return (
                  <tr key={entry.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 font-medium text-slate-800">{entry.event}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {entry.entity_type} #{entry.entity_id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{entry.actor}</td>
                    <td className="px-4 py-3 text-slate-600">{String(summary)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {!entries.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No activity recorded yet.
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
