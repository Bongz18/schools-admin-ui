"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { SCHOOL_COLUMNS, type School } from "@/lib/schools";
import SchoolProfileView from "@/components/site/SchoolProfileView";

// Shows a school (draft or live) exactly as parents will see it. Admins only:
// the database only returns drafts to signed-in admins.
export default function SchoolPreviewPage() {
  const params = useParams<{ id: string }>();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("schools").select(SCHOOL_COLUMNS).eq("id", params.id).maybeSingle();
      setSchool((data as unknown as School | null) ?? null);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) return <p className="text-slate-600">Loading preview…</p>;
  if (!school) return <p className="text-slate-600">School not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <span>
          Preview of <strong>{school.name}</strong>:{" "}
          {school.status === "published" ? "this school is live." : "parents can't see this draft yet."}
        </span>
        <Link href="/admin/schools" className="font-medium underline">
          Back to schools
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-paper font-body text-ink">
        <SchoolProfileView school={school} />
      </div>
    </div>
  );
}
