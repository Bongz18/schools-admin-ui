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
  feeSummary,
  formatUsd,
  locationLine,
  readFilters,
  schoolHref,
} from "@/lib/schools";
import CompareToggle from "@/components/site/CompareToggle";

export const metadata: Metadata = {
  title: "Find a school | SchoolSpot Zimbabwe",
  description: "Search and filter schools in Zimbabwe by city, fees, boarding and curriculum.",
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
  const cities = Array.from(new Set(all.map((s) => s.city).filter((c): c is string => !!c))).sort();
  const hasFilters = Object.entries(filters).some(([key, value]) => key !== "sort" && value);

  const field =
    "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-ink focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/30";
  const label = "block text-sm font-semibold text-ink";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Find a school</h1>

      <form method="get" className="mt-6 grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3 lg:grid-cols-6">
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
        <div className="flex items-end gap-3 sm:col-span-3 lg:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-leaf px-6 py-2.5 font-semibold text-white hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
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

      <p className="mt-6 text-granite" aria-live="polite">
        {error
          ? "Schools couldn't be loaded just now. Refresh the page to try again."
          : `${schools.length} ${schools.length === 1 ? "school" : "schools"}${hasFilters ? " match your search" : ""}`}
      </p>

      {schools.length > 0 ? (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {schools.map((school) => (
            <li key={school.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  href={schoolHref(school)}
                  className="font-display text-xl font-semibold text-ink underline-offset-4 hover:text-leaf hover:underline"
                >
                  {school.name}
                </Link>
                <p className="mt-0.5 text-granite">{locationLine(school)}</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {school.gender && (
                    <li className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-leaf-dark">
                      {GENDER_LABELS[school.gender] ?? school.gender}
                    </li>
                  )}
                  {school.boarding && (
                    <li className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-leaf-dark">
                      {BOARDING_LABELS[school.boarding] ?? school.boarding}
                    </li>
                  )}
                  {(school.curriculum ?? []).map((c) => (
                    <li key={c} className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-leaf-dark">{c}</li>
                  ))}
                </ul>
              </div>
              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <p className="font-display text-lg font-semibold text-ink">{feeSummary(school)}</p>
                <CompareToggle schoolId={school.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              {all.length === 0 ? "Listings open soon" : "No schools match all of those"}
            </h2>
            <p className="mt-2 text-ink/80">
              {all.length === 0
                ? "We're checking our first schools with the schools themselves. Come back soon."
                : "Try a higher fee limit, or remove one of the filters."}
            </p>
          </div>
        )
      )}
    </div>
  );
}
