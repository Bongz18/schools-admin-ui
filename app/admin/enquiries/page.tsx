"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type Enquiry = {
  id: string;
  school_id: string | null;
  parent_name: string;
  email: string | null;
  phone: string | null;
  child_grade: string | null;
  intake: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [schools, setSchools] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      const [enquiryResult, schoolResult] = await Promise.all([
        supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("schools").select("id, name"),
      ]);

      if (enquiryResult.error) {
        setLoadError(enquiryResult.error.message || "Enquiries couldn't be loaded.");
      } else {
        setEnquiries((enquiryResult.data ?? []) as Enquiry[]);
      }
      const names: Record<string, string> = {};
      for (const row of (schoolResult.data ?? []) as { id: string; name: string }[]) names[row.id] = row.name;
      setSchools(names);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enquiries</h1>
        <p className="mt-1 text-sm text-slate-600">Questions parents sent from SchoolSpot school pages, newest first.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
          No enquiries yet. They&apos;ll appear here once schools are published and parents start asking questions.
        </div>
      ) : (
        <ul className="space-y-3">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-slate-900">
                  {enquiry.parent_name}
                  <span className="font-normal text-slate-500">
                    {" "}about {enquiry.school_id ? schools[enquiry.school_id] ?? "a school" : "a removed school"}
                  </span>
                </p>
                <time className="text-sm text-slate-500" dateTime={enquiry.created_at}>
                  {new Date(enquiry.created_at).toLocaleString()}
                </time>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {[enquiry.email, enquiry.phone].filter(Boolean).join(" / ")}
                {enquiry.child_grade ? ` · For ${enquiry.child_grade}` : ""}
                {enquiry.intake ? ` · Starting ${enquiry.intake}` : ""}
              </p>
              {enquiry.message && <p className="mt-3 whitespace-pre-line text-slate-800">{enquiry.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
