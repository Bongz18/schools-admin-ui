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

// The search reads as a sentence. Each choice is a soft pill with a small arrow; it fills
// evergreen once the parent picks something. Empty choices are "invalid" (required, with an
// empty first option) purely so CSS can tell picked from unpicked; the form has noValidate,
// so leaving them empty still submits.
function Choice({
  id,
  name,
  label,
  placeholder,
  options,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; text: string }[];
}) {
  return (
    <span className="relative mx-1 my-1 inline-flex align-baseline">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        defaultValue=""
        required
        className="peer cursor-pointer appearance-none rounded-full border py-1 pl-5 pr-11 font-display leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 invalid:border-leaf/15 invalid:bg-leaf-soft invalid:text-leaf hover:invalid:border-leaf/40 valid:border-leaf valid:bg-leaf valid:text-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.text}</option>
        ))}
      </select>
      <svg
        viewBox="0 0 12 8"
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-2.5 w-3.5 -translate-y-1/2 text-leaf peer-valid:text-white"
      >
        <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

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

        <form action="/schools" method="get" noValidate className="mt-12 max-w-4xl rounded-2xl border border-line bg-white p-7 sm:p-10">
          <p className="font-display text-[1.45rem] leading-[2.1] text-ink sm:text-[1.9rem] sm:leading-[2]">
            I&apos;m looking for
            <Choice
              id="gender"
              name="gender"
              label="Girls, boys or co-ed"
              placeholder="any type of"
              options={[
                { value: "girls", text: "a girls'" },
                { value: "boys", text: "a boys'" },
                { value: "coed", text: "a co-ed" },
              ]}
            />
            <Choice
              id="boarding"
              name="boarding"
              label="Day or boarding"
              placeholder="day or boarding"
              options={[
                { value: "day", text: "day" },
                { value: "boarding", text: "boarding" },
              ]}
            />
            school in
            <Choice
              id="city"
              name="city"
              label="City"
              placeholder="any city"
              options={cityOptions.map((city) => ({ value: city, text: city }))}
            />
            with fees under
            <Choice
              id="maxfee"
              name="maxfee"
              label="Maximum fees per term"
              placeholder="any amount"
              options={FEE_OPTIONS.map((fee) => ({ value: String(fee), text: formatUsd(fee) }))}
            />
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
