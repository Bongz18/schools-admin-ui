import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceClient } from "@/lib/adminAuth";
import { EXAM_RESULT_COLUMNS, SCHOOL_COLUMNS, type ExamResult, type School } from "@/lib/schools";
import SchoolProfileView from "@/components/site/SchoolProfileView";

// Private preview for a school: anyone with the secret link can see the school's
// profile (draft or live) without logging in, so the school can check it before
// we publish. The token is checked on the server with the service role; it is
// never exposed through the public API.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile preview | SchoolSpot Zimbabwe",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getPreview(token: string) {
  if (!UUID.test(token)) return null;
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data: link } = await supabase.from("school_previews").select("school_id").eq("token", token).maybeSingle();
  if (!link) return null;

  const [{ data: school }, { data: results }] = await Promise.all([
    supabase.from("schools").select(SCHOOL_COLUMNS).eq("id", link.school_id).maybeSingle(),
    supabase
      .from("exam_results")
      .select(EXAM_RESULT_COLUMNS)
      .eq("school_id", link.school_id)
      .order("sort_order")
      .order("year", { ascending: false }),
  ]);
  if (!school) return null;
  return {
    school: school as unknown as School,
    results: (results as unknown as ExamResult[] | null) ?? [],
  };
}

export default async function SchoolPreviewLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const preview = await getPreview(token);
  if (!preview) notFound();
  const { school, results } = preview;
  const live = school.status === "published";

  return (
    <>
      <div className="bg-leaf text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 text-sm sm:px-8">
          <p className="font-semibold">
            {live
              ? `This is ${school.name}'s live profile on SchoolSpot Zimbabwe.`
              : `Private preview of ${school.name}'s profile. It is not public yet.`}
          </p>
          <p className="text-white/80">
            Please check every detail. To approve it or ask for changes, reply to our email or write to{" "}
            <a href="mailto:schoolspotzw@gmail.com" className="font-semibold text-white underline underline-offset-2">
              schoolspotzw@gmail.com
            </a>
            . Please keep this link within the school.
          </p>
        </div>
      </div>
      <SchoolProfileView school={school} results={results} />
    </>
  );
}
