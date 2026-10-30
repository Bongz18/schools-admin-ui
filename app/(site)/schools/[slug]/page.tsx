import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabaseServer";
import { SCHOOL_COLUMNS, type School, feeSummary, locationLine } from "@/lib/schools";
import SchoolProfileView from "@/components/site/SchoolProfileView";
import EnquiryForm from "@/components/site/EnquiryForm";

export const revalidate = 60;

async function getSchool(slug: string) {
  const { data } = await publicSupabase()
    .from("schools")
    .select(SCHOOL_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return (data as unknown as School | null) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchool(slug);
  if (!school) return { title: "School not found | SchoolSpot Zimbabwe" };
  return {
    title: `${school.name}: fees and details | SchoolSpot Zimbabwe`,
    description: `${school.name}, ${locationLine(school)}. ${feeSummary(school)}. Compare it with other schools on SchoolSpot Zimbabwe.`,
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = await getSchool(slug);
  if (!school) notFound();

  return (
    <SchoolProfileView school={school}>
      <section aria-labelledby="enquire" className="mt-14 max-w-2xl">
        <h2 id="enquire" className="font-display text-2xl font-semibold text-ink">
          Ask {school.name} a question
        </h2>
        <p className="mt-2 text-ink/80">Ask about places, fees, boarding or open days. It takes a minute.</p>
        <div className="mt-6">
          <EnquiryForm schoolId={school.id} schoolName={school.name} />
        </div>
      </section>
    </SchoolProfileView>
  );
}
