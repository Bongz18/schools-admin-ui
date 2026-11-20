import type { Metadata } from "next";
import Link from "next/link";
import { publicSupabase } from "@/lib/supabaseServer";
import {
  BOARDING_LABELS,
  CURRICULUM_OPTIONS,
  FEE_OPTIONS,
  GENDER_LABELS,
  SCHOOL_COLUMNS,
  type School,
  applyFilters,
  SECTOR_OPTIONS,
  feeSummary,
  formatUsd,
  locationLine,
  readFilters,
  schoolHref,
} from "@/lib/schools";
import CompareToggle from "@/components/site/CompareToggle";
import SchoolCrest from "@/components/site/SchoolCrest";
import { VerifiedSeal } from "@/components/site/VerifiedBadge";

export const metadata: Metadata = {
  title: "Find a school | SchoolSpot Zimbabwe",
  description: "Search and filter schools in Zimbabwe by city, fees, boarding, curriculum and type of school.",
};

export const revalidate = 60;

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = readFilters(await searchParams);
  const { data, error } = await publicSupabase()
    .from("schools")
    .select(SCHOOL_COLUMNS)
    .eq("status", "published")
    .limit(1000);

  const all = (data ?? []) as unknown as School[];
  const schools = applyFilters(all, filters);
  const cities = Array.from(new Set(["Harare", ...all.map((s) => s.city).filter((c): c is string => !!c)])).sort();
  const hasFilters = Object.entries(filters).some(([key, value]) => key !== "sort" && value);

  const field =
    "mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-ink focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20";
  const label = "block text-sm font-medium text-granite";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-16">
      <h1 className="font-display text-[2.6rem] leading-tight tracking-tight text-ink sm:text-[3.25rem]">Find a school</h1>

      <form method="get" className="mt-8 grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-3 sm:p-7 lg:grid-cols-4">
        <div className="sm:col-span-3 lg:col-span-2">
          <label htmlFor="q" className={label}>School name or area</label>
          <input id="q" name="q" defaultValue={filters.q ?? ""} placeholder="e.g. Borrowdale" className={field} />
        </div>
        <div>
          <label htmlFor="city" className={label}>City</label>
          <select id="city" name="city" defaultValue={filters.city ?? ""} className={field}>
            <option value="">Any</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className={label}>Pupils</label>
          <select id="gender" name="gender" defaultValue={filters.gender ?? ""} className={field}>
            <option value="">Any</option>
            {Object.entries(GENDER_LABELS).map(([value, text]) => (
              <option key={value} value={value}>{text}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="boarding" className={label}>Day or boarding</label>
          <select id="boarding" name="boarding" defaultValue={filters.boarding ?? ""} className={field}>
            <option value="">Either</option>
            <option value="day">Day places</option>
            <option value="boarding">Boarding places</option>
          </select>
        </div>
        <div>
          <label htmlFor="sector" className={label}>Type of school</label>
          <select id="sector" name="sector" defaultValue={filters.sector ?? ""} className={field}>
            <option value="">Any</option>
            {SECTOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="maxfee" className={label}>Fees up to (a term)</label>
          <select id="maxfee" name="maxfee" defaultValue={filters.maxfee ?? ""} className={field}>
            <option value="">Any</option>
            {FEE_OPTIONS.map((fee) => (
              <option key={fee} value={fee}>{formatUsd(fee)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="curriculum" className={label}>Curriculum</label>
          <select id="curriculum" name="curriculum" defaultValue={filters.curriculum ?? ""} className={field}>
            <option value="">Any</option>
            {CURRICULUM_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className={label}>Sort by</label>
          <select id="sort" name="sort" defaultValue={filters.sort ?? ""} className={field}>
            <option value="">Name</option>
            <option value="fee">Lowest fees first</option>
          </select>
        </div>
        <div className="flex items-end gap-3 sm:col-span-3 lg:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-leaf px-7 py-2.5 font-semibold text-white hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            Show schools
          </button>
          {hasFilters && (
            <Link href="/schools" className="py-2.5 text-granite underline hover:text-ink">
              Clear filters
            </Link>
          )}
        </div>
      </form>

      <p className="mt-10 text-[0.95rem] text-granite" aria-live="polite">
        {error
          ? "Schools couldn't be loaded just now. Refresh the page to try again."
          : `${schools.length} ${schools.length === 1 ? "school" : "schools"}${hasFilters ? " match your search" : ""}`}
      </p>

      {schools.length > 0 ? (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {schools.map((school) => (
            <li key={school.id} className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-5">
                <SchoolCrest name={school.name} size="sm" verified={school.verified} />
                <div className="min-w-0">
                  <Link
                    href={schoolHref(school)}
                    className="font-display text-[1.6rem] leading-tight text-ink decoration-brass underline-offset-4 hover:underline"
                  >
                    {school.name}
                  </Link>
                  <p className="mt-1 text-[0.95rem] text-granite">
                    {locationLine(school)}
                    {school.verified && (
                      <span className="ml-3 inline-flex items-center gap-1.5 align-middle text-sm font-medium text-leaf">
                        <VerifiedSeal className="h-4 w-4" />
                        Verified
                      </span>
                    )}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                    {[
                      school.gender ? GENDER_LABELS[school.gender] ?? school.gender : null,
                      school.boarding ? BOARDING_LABELS[school.boarding] ?? school.boarding : null,
                      ...(school.curriculum ?? []),
                    ]
                      .filter((tag): tag is string => !!tag)
                      .map((tag) => (
                        <li key={tag} className="rounded-full border border-line bg-white px-3 py-0.5 text-ink/75">
                          {tag}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-16 sm:flex-col sm:items-end sm:gap-3 sm:pl-0">
                <p className="font-medium text-ink">{feeSummary(school)}</p>
                <CompareToggle schoolId={school.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <div className="mt-6 rounded-2xl border border-line bg-white p-8 sm:p-10">
            <h2 className="font-display text-[1.75rem] leading-tight text-ink">
              {all.length === 0 ? "More schools are joining SchoolSpot" : "No schools match all of those"}
            </h2>
            <p className="mt-3 max-w-lg text-ink/75">
              {all.length === 0
                ? "We add each school once it has checked and approved its own profile."
                : "Try a higher fee limit, or remove one of the filters."}
            </p>
          </div>
        )
      )}
    </div>
  );
}
