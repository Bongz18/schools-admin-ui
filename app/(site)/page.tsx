import Link from "next/link";
import { publicSupabase } from "@/lib/supabaseServer";
import { BOARDING_LABELS, FEE_OPTIONS, GENDER_LABELS, feeSummary, formatUsd, locationLine } from "@/lib/schools";
import SchoolCrest from "@/components/site/SchoolCrest";
import SentenceChoice from "@/components/site/SentenceChoice";
import { VerifiedSeal } from "@/components/site/VerifiedBadge";
import { PREMIUM_CARD, PREMIUM_SHEEN, PREMIUM_THEMES, premiumTheme } from "@/components/site/premiumTheme";

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

// Each launch city has its own colour and region line; other cities take the next colour in turn.
const CITY_STYLE: Record<string, { theme: number; region: string }> = {
  Harare: { theme: 1, region: "Harare Province" },
  Bulawayo: { theme: 2, region: "Matabeleland" },
  Gweru: { theme: 0, region: "Midlands" },
};

const HERO_POINTS = ["Fees and exam results in one place", "Details confirmed by the schools", "Free for parents, no sign-up"];

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
        <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {cities.map((city, i) => {
            const count = cityCounts.get(city) ?? 0;
            const style = CITY_STYLE[city];
            const theme = style ? PREMIUM_THEMES[style.theme] : premiumTheme(i);
            const inner = (
              <>
                <span className={PREMIUM_SHEEN} aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-8 -right-2 -z-10 font-display text-[9rem] leading-none transition-transform duration-500 group-hover:-translate-y-2 ${theme.initial}`}
                >
                  {city.charAt(0)}
                </span>
                {style && (
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#e2c58f]">
                    {style.region}
                  </span>
                )}
                <span className="mt-2 block font-display text-[1.9rem] leading-none">{city}</span>
                <span className="mt-6 flex items-center justify-between gap-3 text-sm">
                  <span className={count ? "font-semibold text-white" : "text-white/70"}>
                    {count ? `${count} ${count === 1 ? "school" : "schools"}` : "More schools are joining"}
                  </span>
                  {count > 0 && (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#e2c58f] ring-1 ring-brass/50 transition duration-300 group-hover:translate-x-1 group-hover:bg-brass group-hover:text-white"
                    >
                      →
                    </span>
                  )}
                </span>
              </>
            );
            const cardClass = `${PREMIUM_CARD} ${theme.card} ${theme.glow} px-6 pb-6 pt-7`;
            return (
              <li key={city}>
                {count ? (
                  <Link href={`/schools?city=${encodeURIComponent(city)}`} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
