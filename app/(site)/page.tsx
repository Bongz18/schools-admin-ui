import Link from "next/link";
import { publicSupabase } from "@/lib/supabaseServer";
import { BOARDING_LABELS, FEE_OPTIONS, GENDER_LABELS, feeSummary, formatUsd, locationLine } from "@/lib/schools";
import SchoolCrest from "@/components/site/SchoolCrest";
import SentenceChoice from "@/components/site/SentenceChoice";
import HighlightList from "@/components/site/HighlightList";
import { VerifiedSeal } from "@/components/site/VerifiedBadge";

export const revalidate = 60;

type FeaturedSchool = {
  id: string;
  slug: string | null;
  name: string;
  suburb: string | null;
  city: string | null;
  verified: boolean;
  gender: string | null;
  boarding: string | null;
  curriculum: string[] | null;
  fee_term_min_usd: number | null;
  fee_term_max_usd: number | null;
  fees_text: string | null;
};

async function getHomeData() {
  const { data } = await publicSupabase()
    .from("schools")
    .select("id,slug,name,suburb,city,verified,gender,boarding,curriculum,fee_term_min_usd,fee_term_max_usd,fees_text,updated_at")
    .eq("status", "published")
    .order("verified", { ascending: false })
    .order("updated_at", { ascending: false });
  const schools = (data ?? []) as unknown as FeaturedSchool[];
  const cityCounts = new Map<string, number>();
  for (const school of schools) if (school.city) cityCounts.set(school.city, (cityCounts.get(school.city) ?? 0) + 1);
  return { featured: schools.filter((s) => s.slug).slice(0, 6), cityCounts };
}

// Cities we are building listings for, in the order parents are most likely to look.
const LAUNCH_CITIES = ["Harare", "Bulawayo", "Gweru"];

const HERO_POINTS = ["Fees and exam results in one place", "Details confirmed by the schools", "Free for parents, no sign-up"];

const STEPS = [
  { title: "Search", body: "Filter by city, fees, boarding and whether the school takes girls, boys or both." },
  { title: "Compare", body: "Put up to three schools side by side: fees, curriculum, boarding and results on one screen." },
  { title: "Contact", body: "Email or call the school directly about places, fees and open days, using the details on its page." },
];

// Shown as headed points ("Heading: description") in the For schools band.
const PROFILE_INCLUDES = [
  "Fees, clearly set out: Day fees for every level, with boarding shown separately.",
  "Exam results: Pass rates year by year, with top grades where the school reports them.",
  "Highlights: New subjects, sports and cultural achievements, in the school's own words.",
  "Direct contacts: Emails for admissions and each division, plus the school's social pages.",
  "The verified seal: A gold seal once the school has confirmed its own details.",
  "Your approval first: Nothing goes live until the school has checked and approved its profile.",
];

export default async function HomePage() {
  const { featured, cityCounts } = await getHomeData();
  const cityOptions = Array.from(new Set([...LAUNCH_CITIES, ...cityCounts.keys()])).sort();
  const cities = Array.from(new Set([...LAUNCH_CITIES, ...cityCounts.keys()]));

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <h1 className="max-w-3xl font-display text-[2.75rem] leading-[1.05] tracking-tight text-ink sm:text-[4.25rem]">
          Find the right school in Zimbabwe.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          Fees, boarding, results and contacts for schools across the country, checked with the schools themselves.
        </p>
        <ul className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
          {HERO_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-[0.98rem] font-medium text-ink/85">
              <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brass/20 ring-1 ring-brass/50">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <form action="/schools" method="get" className="mt-10 max-w-4xl rounded-2xl border border-line bg-white p-7 shadow-[0_24px_50px_-34px_rgba(15,42,34,0.35)] sm:p-10">
          {/* The search reads as a sentence. Words and choices are laid out as one centred line
              with the same gap everywhere, wrapping neatly on small screens. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-4 font-display text-[1.45rem] leading-tight text-ink sm:gap-x-4 sm:text-[1.9rem]">
            <span>I&apos;m looking for</span>
            <SentenceChoice
              name="gender"
              label="Girls, boys or co-ed"
              placeholder="any type of"
              options={[
                { value: "girls", text: "a girls'" },
                { value: "boys", text: "a boys'" },
                { value: "coed", text: "a co-ed" },
              ]}
            />
            <SentenceChoice
              name="boarding"
              label="Day or boarding"
              placeholder="day or boarding"
              options={[
                { value: "day", text: "day" },
                { value: "boarding", text: "boarding" },
              ]}
            />
            <span>school in</span>
            <SentenceChoice
              name="city"
              label="City"
              placeholder="any city"
              options={cityOptions.map((city) => ({ value: city, text: city }))}
            />
            <span>with fees under</span>
            <SentenceChoice
              name="maxfee"
              label="Maximum fees per term"
              placeholder="any amount"
              options={FEE_OPTIONS.map((fee) => ({ value: String(fee), text: formatUsd(fee) }))}
            />
            <span>a term.</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="submit"
              className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              Show me schools
            </button>
            <Link href="/schools" className="text-[0.95rem] font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">
              Or browse all schools
            </Link>
          </div>
        </form>

        <p className="mt-6 flex items-center gap-2.5 text-[0.95rem] text-granite">
          <VerifiedSeal className="h-5 w-5 shrink-0" />
          Schools with the gold seal have confirmed their own details with us.
        </p>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span aria-hidden="true" className="block h-px w-10 bg-brass" />
              <h2 id="featured" className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.35rem]">
                Schools on SchoolSpot
              </h2>
              <p className="mt-2 max-w-xl text-granite">Full profiles, confirmed with the schools themselves.</p>
            </div>
            <Link href="/schools" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">
              See all schools →
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((school) => {
              const tags = [
                school.gender ? GENDER_LABELS[school.gender] ?? school.gender : null,
                school.boarding ? BOARDING_LABELS[school.boarding] ?? school.boarding : null,
                school.curriculum && school.curriculum.length ? school.curriculum.join(" · ") : null,
              ].filter(Boolean) as string[];
              return (
                <li key={school.id}>
                  <Link
                    href={`/schools/${school.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_22px_44px_-26px_rgba(15,42,34,0.45)]"
                  >
                    <div className="flex items-center gap-4">
                      <SchoolCrest name={school.name} size="sm" verified={school.verified} />
                      <div className="min-w-0">
                        <p className="font-display text-[1.3rem] leading-snug text-ink group-hover:text-leaf">{school.name}</p>
                        <p className="text-sm text-granite">{locationLine(school)}</p>
                      </div>
                    </div>
                    {tags.length > 0 && (
                      <ul className="mb-6 mt-5 flex flex-wrap gap-2 text-[0.8rem]">
                        {tags.map((tag) => (
                          <li key={tag} className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-ink/75">{tag}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                      <span className="font-semibold text-ink">{feeSummary(school)}</span>
                      {school.verified && (
                        <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-brass">
                          <VerifiedSeal className="h-4 w-4" /> Verified
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="cities" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <span aria-hidden="true" className="block h-px w-10 bg-brass" />
        <h2 id="cities" className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.35rem]">
          Browse by city
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {cities.map((city) => {
            const count = cityCounts.get(city) ?? 0;
            const inner = (
              <>
                <span className="font-display text-[1.7rem] leading-none">{city}</span>
                <span className={`mt-2 block text-sm ${count ? "text-white/75" : "text-granite"}`}>
                  {count ? `${count} ${count === 1 ? "school" : "schools"} →` : "More schools are joining"}
                </span>
              </>
            );
            return (
              <li key={city}>
                {count ? (
                  <Link
                    href={`/schools?city=${encodeURIComponent(city)}`}
                    className="block rounded-2xl bg-leaf-dark px-6 py-7 text-white ring-1 ring-inset ring-brass/30 transition hover:bg-leaf"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-7 text-ink">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="how" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <span aria-hidden="true" className="block h-px w-10 bg-brass" />
          <h2 id="how" className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.35rem]">
            How SchoolSpot works
          </h2>
          <p className="mt-2 max-w-xl text-granite">From a first search to a reply from the school, in three steps.</p>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {STEPS.map((step, index) => (
              <li key={step.title} className="md:px-10 md:first:pl-0 md:last:pr-0">
                <span className="font-display text-[2.6rem] leading-none text-brass">{index + 1}</span>
                <h3 className="mt-4 font-display text-[1.6rem] leading-tight text-leaf">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="for-schools" className="scroll-mt-20 border-b border-line bg-leaf-soft/55">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
            <div>
              <span aria-hidden="true" className="block h-px w-10 bg-brass" />
              <h2
                id="for-schools"
                className="scroll-mt-28 mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]"
              >
                Your school, presented properly.
              </h2>
            </div>
            <div>
              <p className="max-w-md text-lg leading-relaxed text-ink/75">
                Listing is free. We build your profile from the details you send us, and you approve every word before it
                goes live.
              </p>
              <a
                href="mailto:schoolspotzw@gmail.com?subject=List%20our%20school%20on%20SchoolSpot"
                className="mt-7 inline-flex rounded-full bg-leaf px-7 py-3 font-semibold text-white shadow-[0_8px_20px_-10px_rgba(18,48,31,0.6)] transition-colors hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                List your school free
              </a>
            </div>
          </div>

          <div className="mt-16 border-t border-leaf/15 pt-12">
            <h3 className="font-display text-[1.6rem] leading-tight text-ink">Every profile includes</h3>
            <HighlightList items={PROFILE_INCLUDES} tone="light" className="mt-6 lg:grid-cols-3" />
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-granite">
              Fees change from term to term, so every profile shows where its figures came from.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
