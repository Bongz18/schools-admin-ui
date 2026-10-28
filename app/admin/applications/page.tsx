"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { adminFetch } from "@/lib/adminFetch";
import { toast } from "react-hot-toast";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

type Review = {
  mode?: string;
  summary?: string;
  recommended_status?: string;
  risk_flags?: string[];
  score?: number;
};

type Application = {
  id: string; // uuid
  parent_id: number | string;
  school_id: number | string;
  status: string;
  notes?: string | null;
  created_at?: string;
};

type Parent = {
  id: number | string;
  email?: string | null;
};

type School = {
  id: number | string;
  name?: string | null;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewResults, setReviewResults] = useState<Record<string, Review>>({});
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const pageSize = 10;

  const fetchApplications = async () => {
    const { data, error } = await supabase.from("applications").select("*").order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      return;
    }

    setApplications((data ?? []) as Application[]);
  };

  const fetchParents = async () => {
    const { data, error } = await supabase.from("users").select("id, email");

    if (error) {
      console.error("Error fetching parents:", error);
      setParents([]);
      return;
    }

    setParents((data ?? []) as Parent[]);
  };

  const fetchSchools = async () => {
    const { data, error } = await supabase.from("schools").select("id, name");

    if (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
      return;
    }

    setSchools((data ?? []) as School[]);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchApplications(), fetchParents(), fetchSchools()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const parentMap = new Map(parents.map((p) => [String(p.id), p.email ?? "Unknown parent"]));
  const schoolMap = new Map(schools.map((s) => [String(s.id), s.name ?? "Unknown school"]));

  const filteredApplications = applications.filter((app) => {
    const parentEmail = parentMap.get(String(app.parent_id)) ?? "";
    const schoolName = schoolMap.get(String(app.school_id)) ?? "";

    const matchesSearch =
      !searchQuery ||
      parentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schoolName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSchool = schoolFilter === "all" || String(app.school_id) === String(schoolFilter);

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );

  const totalPages = Math.max(1, Math.ceil(sortedApplications.length / pageSize));
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAiReview = async (application: Application) => {
    setReviewingId(application.id);
    try {
      // Only the school name is added; the parent's email stays out of the AI request.
      const response = await adminFetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: {
            ...application,
            school_name: schoolMap.get(String(application.school_id)) ?? "",
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? "AI review failed");
      }

      setReviewResults((prev) => ({
        ...prev,
        [String(application.id)]: result as Review,
      }));

      toast.success(result?.mode === "fallback" ? "AI not configured: review manually" : "AI review generated");
    } catch (error) {
      console.error("AI review error:", error);
      toast.error(error instanceof Error ? error.message : "AI review failed");
    } finally {
      setReviewingId(null);
    }
  };

  // Status changes go through the server so they are permission-checked and audit-logged.
  const updateApplicationStatus = async (
    application: Application,
    nextStatus: string,
    source: "manual" | "ai_recommendation" = "manual",
  ) => {
    if (nextStatus === application.status) return;

    const confirmed = window.confirm(
      `Change this application from "${STATUS_LABELS[application.status] ?? application.status}" to "${
        STATUS_LABELS[nextStatus] ?? nextStatus
      }"?`,
    );
    if (!confirmed) return;

    const response = await adminFetch(`/api/admin/applications/${application.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, source }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Status update failed:", result?.error);
      toast.error(result?.error ?? "Status update failed");
      return;
    }

    toast.success("Application status updated");
    await fetchApplications();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Admissions</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Applications</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by parent or school"
          className="w-full rounded border border-slate-300 px-3 py-2 md:max-w-xs"
        />

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded border border-slate-300 px-3 py-2"
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={schoolFilter}
            onChange={(event) => {
              setSchoolFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded border border-slate-300 px-3 py-2"
          >
            <option value="all">All schools</option>
            {schools.map((school) => (
              <option key={String(school.id)} value={String(school.id)}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
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
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map((application) => {
                const review = reviewResults[String(application.id)];
                const parentEmail = parentMap.get(String(application.parent_id)) ?? "Unknown parent";
                const schoolName = schoolMap.get(String(application.school_id)) ?? "Unknown school";

                return (
                  <tr key={application.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 text-slate-800">{parentEmail}</td>
                    <td className="px-4 py-3 text-slate-800">{schoolName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {application.created_at ? new Date(application.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAiReview(application)}
                          disabled={reviewingId === application.id}
                          className="rounded border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 disabled:opacity-60"
                        >
                          {reviewingId === application.id ? "Reviewing..." : "AI review"}
                        </button>
                        <select
                          value={application.status}
                          onChange={(event) => updateApplicationStatus(application, event.target.value)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="in_review">In review</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {review && (
                        <div className="mt-2 max-w-md rounded border border-emerald-200 bg-emerald-50 p-2 text-left text-xs text-emerald-800 ml-auto">
                          <div className="font-semibold">{review.summary ?? "AI review"}</div>
                          {review.risk_flags && review.risk_flags.length > 0 && (
                            <ul className="mt-1 list-disc pl-4">
                              {review.risk_flags.map((flag) => (
                                <li key={flag}>{flag}</li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span>
                              Suggested:{" "}
                              <span className="font-medium">
                                {STATUS_LABELS[review.recommended_status ?? ""] ?? review.recommended_status}
                              </span>
                            </span>
                            {review.mode === "live" &&
                              review.recommended_status &&
                              review.recommended_status !== application.status && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application,
                                      review.recommended_status as string,
                                      "ai_recommendation",
                                    )
                                  }
                                  className="rounded border border-emerald-300 bg-white px-2 py-0.5 font-medium"
                                >
                                  Review &amp; apply
                                </button>
                              )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded border border-slate-300 bg-white px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="rounded border border-slate-300 bg-white px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
