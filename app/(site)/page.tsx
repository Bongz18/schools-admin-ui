import Link from "next/link";
import { publicSupabase } from "@/lib/supabaseServer";
import { FEE_OPTIONS, formatUsd } from "@/lib/schools";

export const revalidate = 60;

async function getStats() {
  const { data } = await publicSupabase().from("schools").select("city").eq("status", "published");
  const rows = (data ?? []) as { city: string | null }[];
  const cities = Array.from(new Set(rows.map((row) => row.city).filter((c): c is string => !!c))).sort();
  return { count: rows.length, cities };
}

// The search reads as a sentence; each choice is an underlined word the parent can change.
const select =
  "mx-1 inline-block cursor-pointer appearance-none rounded-none border-0 border-b border-brass bg-transparent px-1 pb-0.5 font-display text-leaf hover:border-leaf focus:border-leaf focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf/30";

const STEPS = [
  { title: "Search", body: "Filter by city, fees, boarding and whether the school takes girls, boys or both." },
  { title: "Compare", body: "Put up to three schools side by side: fees, curriculum, boarding and results on one screen." },
  { title: "Enquire", body: "Send one message from SchoolSpot and hear back about places, fees and open days." },
];

const PROFILE_INCLUDES = [
  "Fees for every level, with boarding set out clearly",
  "Exam results, year by year",
  "Highlights: new subjects, sports and cultural achievements",
  "Direct emails for admissions and each division",
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
          <p className="font-display text-[1.6rem] leading-[1.9] text-ink sm:text-[2rem] sm:leading-[1.8]">
            I&apos;m looking for a
            <label className="sr-only" htmlFor="gender">Girls, boys or co-ed</label>
            <select id="gender" name="gender" defaultValue="" className={select}>
              <option value="">any</option>
              <option value="girls">girls&apos;</option>
              <option value="boys">boys&apos;</option>
              <option value="coed">co-ed</option>
            </select>
            <label className="sr-only" htmlFor="boarding">Day or boarding</label>
            <select id="boarding" name="boarding" defaultValue="" className={select}>
              <option value="">day or boarding</option>
              <option value="day">day</option>
              <option value="boarding">boarding</option>
            </select>
            school in
            <label className="sr-only" htmlFor="city">City</label>
            <select id="city" name="city" defaultValue="" className={select}>
              <option value="">any city</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            costing under
            <label className="sr-only" htmlFor="maxfee">Maximum fees per term</label>
            <select id="maxfee" name="maxfee" defaultValue="" className={select}>
              <option value="">any amount</option>
              {FEE_OPTIONS.map((fee) => (
                <option key={fee} value={fee}>{formatUsd(fee)}</option>
              ))}
            </select>
            a term.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
      </section>

      <section aria-labelledby="how" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 id="how" className="font-display text-[1.75rem] leading-tight text-ink">
            How SchoolSpot works
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {STEPS.map((step) => (
              <li key={step.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <h3 className="font-display text-2xl text-leaf">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="for-schools" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <h2 id="for-schools" className="font-display text-[2.25rem] leading-[1.1] tracking-tight text-ink sm:text-[2.75rem]">
              Your school, presented properly.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">
              Listing is free. We build your profile from the details you send us, and you approve every word before it
              goes live.
            </p>
            <a
              href="mailto:schoolspotzw@gmail.com?subject=List%20our%20school%20on%20SchoolSpot"
              className="mt-8 inline-block rounded-full border border-leaf px-6 py-3 font-semibold text-leaf hover:bg-leaf hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              List your school free
            </a>
          </div>
          <div className="rounded-2xl border border-line bg-white p-7 sm:p-9">
            <h3 className="font-semibold text-ink">Every profile includes</h3>
            <ul className="mt-5 space-y-4">
              {PROFILE_INCLUDES.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-ink/80">
                  <span aria-hidden="true" className="mt-[0.75rem] h-px w-4 shrink-0 bg-brass" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-granite">
              Fees change from term to term, so every profile shows where its figures came from. Schools marked as
              confirmed have checked their own details.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
