"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import supabase from "@/utils/supabaseClient";

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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewResults, setReviewResults] = useState<Record<number, ReviewResult>>({});

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return [] as Application[];
    }

    return (data || []) as Application[];
  };

  const fetchParents = async () => {
    const { data, error } = await supabase.from("users").select("id, email");
    if (error) {
      console.error("Error fetching users:", error);
      return [] as ParentRecord[];
    }
    return (data || []) as ParentRecord[];
  };

  const fetchSchools = async () => {
    const { data, error } = await supabase.from("schools").select("id, name");
    if (error) {
      console.error("Error fetching schools:", error);
      return [] as SchoolRecord[];
    }
    return (data || []) as SchoolRecord[];
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const [apps, parentsData, schoolsData] = await Promise.all([
        fetchApplications(),
        fetchParents(),
        fetchSchools(),
      ]);

      setApplications(apps);
      setParents(parentsData);
      setSchools(schoolsData);
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

      const res = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: app,
          parent,
          school,
        }),
      });

      const result = await res.json();
      setReviewResults((current) => ({ ...current, [app.id]: result }));
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

    toast.success(`Application marked as ${nextStatus}`);
    setApplications((current) =>
      current.map((application) =>
        application.id === appId ? { ...application, status: nextStatus } : application
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Operations</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Applications</h1>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">AI review results</h2>
          </div>

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
