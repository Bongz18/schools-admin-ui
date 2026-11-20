import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicSupabase } from "@/lib/supabaseServer";
import {
  EXAM_RESULT_COLUMNS,
  SCHOOL_COLUMNS,
  type ExamResult,
  type School,
  feeSummary,
  locationLine,
} from "@/lib/schools";
import SchoolProfileView from "@/components/site/SchoolProfileView";
import ContactSchoolPanel from "@/components/site/ContactSchoolPanel";
import TrackView from "@/components/site/TrackView";
import { sectionClass } from "@/lib/ui";
import SectionTitle from "@/components/site/SectionTitle";

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

async function getResults(schoolId: string) {
  const { data } = await publicSupabase()
    .from("exam_results")
    .select(EXAM_RESULT_COLUMNS)
    .eq("school_id", schoolId)
    .order("sort_order")
    .order("year", { ascending: false });
  return (data as unknown as ExamResult[] | null) ?? [];
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
  const results = await getResults(school.id);

  return (
    <SchoolProfileView school={school} results={results}>
      <TrackView schoolId={school.id} />
      <section id="contact" aria-labelledby="contact-heading" className={sectionClass}>
        <div className="rounded-2xl bg-leaf-soft/60 p-6 sm:p-8">
          <SectionTitle
            id="contact-heading"
            title={`Contact ${school.name}`}
            lede="Ask the school directly about places, fees, boarding or open days."
          />
          <div className="mt-6">
            <ContactSchoolPanel
              schoolId={school.id}
              schoolName={school.name}
              email={school.email}
              phone={school.phone}
              website={school.website}
            />
          </div>
        </div>
      </section>
    </SchoolProfileView>
  );
}
