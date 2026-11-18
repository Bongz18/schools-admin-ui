import Link from "next/link";
import { publicSupabase } from "@/lib/supabaseServer";
import { FEE_OPTIONS, formatUsd } from "@/lib/schools";
import SentenceChoice from "@/components/site/SentenceChoice";
import HighlightList from "@/components/site/HighlightList";
import { VerifiedSeal } from "@/components/site/VerifiedBadge";

export const revalidate = 60;

async function getStats() {
  const { data } = await publicSupabase().from("schools").select("city").eq("status", "published");
  const rows = (data ?? []) as { city: string | null }[];
  const cities = Array.from(new Set(rows.map((row) => row.city).filter((c): c is string => !!c))).sort();
  return { count: rows.length, cities };
}

const STEPS = [
  { title: "Search", body: "Filter by city, fees, boarding and whether the school takes girls, boys or both." },
  { title: "Compare", body: "Put up to three schools side by side: fees, curriculum, boarding and results on one screen." },
  { title: "Enquire", body: "Send one message from SchoolSpot and hear back about places, fees and open days." },
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
  const { count, cities } = await getStats();
  const cityOptions = cities.length ? cities : ["Harare"];

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <h1 className="max-w-3xl font-display text-[2.75rem] leading-[1.05] tracking-tight text-ink sm:text-[4.25rem]">
          Find the right school in Zimbabwe.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          Fees, boarding, results and contacts for schools across the country, checked with the schools themselves.
        </p>

        <form action="/schools" method="get" className="mt-12 max-w-4xl rounded-2xl border border-line bg-white p-7 sm:p-10">
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
            <p className="text-[0.95rem] text-granite">
              {count > 0
                ? `${count} ${count === 1 ? "school" : "schools"} listed, with more added every week.`
                : "We're confirming our first schools with them now. Listings open soon."}
            </p>
          </div>
        </form>

        <p className="mt-6 flex items-center gap-2.5 text-[0.95rem] text-granite">
          <VerifiedSeal className="h-5 w-5 shrink-0" />
          Schools with the gold seal have confirmed their own details with us.
        </p>
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

      <section aria-labelledby="for-schools" className="bg-leaf text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
            <div>
              <span aria-hidden="true" className="block h-px w-10 bg-brass" />
              <h2
                id="for-schools"
                className="mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-white sm:text-[3.25rem]"
              >
                Your school, presented properly.
              </h2>
            </div>
            <div>
              <p className="max-w-md text-lg leading-relaxed text-white/75">
                Listing is free. We build your profile from the details you send us, and you approve every word before it
                goes live.
              </p>
              <a
                href="mailto:schoolspotzw@gmail.com?subject=List%20our%20school%20on%20SchoolSpot"
                className="mt-7 inline-flex rounded-full bg-brass px-7 py-3 font-semibold text-leaf-dark transition-colors hover:bg-[#bd9659] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
              >
                List your school free
              </a>
            </div>
          </div>

          <div className="mt-16 border-t border-white/15 pt-12">
            <h3 className="font-display text-[1.6rem] leading-tight text-white">Every profile includes</h3>
            <HighlightList items={PROFILE_INCLUDES} className="mt-6 lg:grid-cols-3" />
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60">
              Fees change from term to term, so every profile shows where its figures came from.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
