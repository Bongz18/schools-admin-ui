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

const select =
  "mx-1 my-1 inline-block appearance-none rounded-lg border-b-2 border-leaf bg-leaf-soft px-3 py-1 font-display font-semibold text-leaf-dark focus:outline-none focus:ring-2 focus:ring-leaf/40 cursor-pointer";

export default async function HomePage() {
  const { count, cities } = await getStats();
  const cityOptions = cities.length ? cities : ["Harare"];

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl">
          Find the right school in Zimbabwe, then compare before you apply.
        </h1>

        <form action="/schools" method="get" className="mt-10 max-w-4xl rounded-3xl border border-line bg-white p-6 sm:p-8">
          <p className="text-xl leading-loose text-ink sm:text-2xl sm:leading-loose">
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
          <button
            type="submit"
            className="mt-6 rounded-full bg-msasa px-7 py-3 font-semibold text-white hover:bg-[#721c29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-msasa"
          >
            Show me schools
          </button>
        </form>

        <p className="mt-5 text-granite">
          {count > 0
            ? `${count} ${count === 1 ? "school" : "schools"} listed so far, with more being added every week.`
            : "We're checking our first schools now. Listings open soon."}
        </p>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-3">
          {[
            {
              title: "Search",
              body: "Filter by city, fees, boarding and whether the school takes girls, boys or both.",
            },
            {
              title: "Compare",
              body: "Put up to three schools side by side: fees, curriculum, boarding and more on one screen.",
            },
            {
              title: "Enquire",
              body: "Send one message from SchoolSpot and get a reply about places, fees and open days.",
            },
          ].map((step, index) => (
            <div key={step.title}>
              <p className="font-display text-5xl font-bold text-leaf/25" aria-hidden="true">{index + 1}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-ink/80">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Where our information comes from</h2>
          <p className="mt-3 leading-relaxed text-ink/80">
            We gather school details from the schools themselves and from public sources, and we show you where each fee
            figure came from. Schools marked as checked have confirmed their own details. Fees change from term to term,
            so always confirm with the school before you apply.
          </p>
          <Link href="/schools" className="mt-6 inline-block font-semibold text-leaf underline hover:text-leaf-dark">
            Browse all schools
          </Link>
        </div>
      </section>
    </>
  );
}
