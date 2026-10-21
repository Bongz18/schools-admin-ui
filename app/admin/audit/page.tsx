"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";

type Application = {
  id: number;
  parent_id: string | number | null;
  school_id: string | number | null;
  status: string;
  notes: string | null;
  created_at: string;
};

type ParentRecord = {
  id: string | number;
  email?: string | null;
};

type SchoolRecord = {
  id: string | number;
  name?: string | null;
};

type ReviewResult = {
  summary: string;
  recommended_status: string;
  confidence: number;
  flags: string[];
};

const safeParseDetails = (raw: string | null) => {
  if (!raw) return {} as Record<string, unknown>;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
};

const logAuditEvent = async (
  event: string,
  entityType: string,
  entityId: string | number,
  details: Record<string, unknown> = {}
) => {
  try {
    await fetch("/api/audit-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        entityType,
        entityId,
        actor: "admin-user",
        details,
      }),
    });
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewResults, setReviewResults] = useState<Record<number, ReviewResult>>({});

  const loadData = async () => {
    setLoading(true);

    try {
      const [applicationsRes, parentsRes, schoolsRes] = await Promise.all([
        supabase.from("applications").select("*").order("created_at", { ascending: false }),
        supabase.from("users").select("id, email"),
        supabase.from("schools").select("id, name"),
      ]);

      if (applicationsRes.error) {
        console.error("Applications fetch error:", applicationsRes.error);
      }
      if (parentsRes.error) {
        console.error("Parents fetch error:", parentsRes.error);
      }
      if (schoolsRes.error) {
        console.error("Schools fetch error:", schoolsRes.error);
      }

      setApplications((applicationsRes.data || []) as Application[]);
      setParents((parentsRes.data || []) as ParentRecord[]);
      setSchools((schoolsRes.data || []) as SchoolRecord[]);
    } catch (error) {
      console.error("Unable to load applications data:", error);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getParentEmail = (parentId: string | number | null) => {
    const parent = parents.find((item) => String(item.id) === String(parentId));
    return parent?.email || "Unknown parent";
  };

  const getSchoolName = (schoolId: string | number | null) => {
    const school = schools.find((item) => String(item.id) === String(schoolId));
    return school?.name || "Unknown school";
  };

  const handleReview = async (app: Application) => {
    setReviewingId(app.id);

    try {
      const parent = parents.find((item) => String(item.id) === String(app.parent_id));
      const school = schools.find((item) => String(item.id) === String(app.school_id));

      const response = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: app,
          parent,
          school,
        }),
      });

      const result = (await response.json()) as ReviewResult;
      setReviewResults((current) => ({ ...current, [app.id]: result }));

      await logAuditEvent("ai_review_generated", "application", app.id, {
        status: app.status,
        school: school?.name || "unknown",
        parent: parent?.email || "unknown",
      });

      toast.success("AI review generated");
    } catch (error) {
      console.error("AI review failed:", error);
      toast.error("Unable to generate AI review.");
    } finally {
      setReviewingId(null);
    }
  };

  const handleStatusUpdate = async (appId: number, nextStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: nextStatus })
      .eq("id", appId);

    if (error) {
      console.error("Error updating application status:", error);
      toast.error("Status update failed.");
      return;
    }

    await logAuditEvent("status_updated", "application", appId, {
      next_status: nextStatus,
      source: "ai_recommendation",
    });

    toast.success(`Application marked as ${nextStatus}`);
    setApplications((current) =>
      current.map((application) =>
        application.id === appId ? { ...application, status: nextStatus } : application
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Applications</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Parent</th>
                <th className="px-4 py-3 font-medium">School</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const review = reviewResults[application.id];
                return (
                  <tr key={application.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 text-slate-700">{getParentEmail(application.parent_id)}</td>
                    <td className="px-4 py-3 text-slate-700">{getSchoolName(application.school_id)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleReview(application)}
                          disabled={reviewingId === application.id}
                          className="rounded-md bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {reviewingId === application.id ? "Reviewing..." : "AI Review"}
                        </button>

                        {review && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(application.id, review.recommended_status)}
                            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Apply {review.recommended_status}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {Object.entries(reviewResults).length > 0 && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">AI review results</h2>

          {Object.entries(reviewResults).map(([appId, review]) => (
            <div key={appId} className="rounded-xl border border-sky-100 bg-sky-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">
                  Application #{appId}
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-sky-700">
                  confidence {review.confidence.toFixed(2)}
                </span>
              </div>

              <p className="text-slate-700">{review.summary}</p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">Recommended status</p>
                <p className="mt-1 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {review.recommended_status}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">Flags</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {review.flags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




































































































































{"audit"} 






























































