import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, formatGuideDate } from "@/lib/guides";
import { TERMS_2027 } from "@/lib/schoolCalendar";
import {
  PREMIUM_CARD,
  PREMIUM_CORNER_BR,
  PREMIUM_CORNER_TL,
  PREMIUM_FRAME,
  PREMIUM_ROUNDEL,
  PREMIUM_SHEEN,
} from "@/components/site/premiumTheme";

export const metadata: Metadata = {
  title: "School term: 2027 term dates and back-to-school help | SchoolSpot Zimbabwe",
  description:
    "Everything for the school term in Zimbabwe in one place: the 2027 term dates and a printable boarding school packing list.",
};

// Guides tagged "school-term" in lib/guides.ts appear here automatically.
const TERM_GUIDES = GUIDES.filter((guide) => guide.topics?.includes("school-term"));

export default function SchoolTermPage() {
  return (
    <section aria-labelledby="school-term" className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <span aria-hidden="true" className="block h-px w-10 bg-brass" />
      <h1 id="school-term" className="mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
        School term
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
        Term dates and back-to-school help for parents in Zimbabwe, in one place.
      </p>

      <div className="mt-10 rounded-2xl border border-brass/40 bg-brass/10 p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink">2027 term dates</h2>
          <Link
            href="/guides/school-calendar-2027"
            className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4"
          >
            Holidays and what to ask your school →
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {TERMS_2027.map((row) => (
            <li key={row.term} className="rounded-xl border border-line bg-white px-5 py-4">
              <p className="font-display text-xl text-ink">{row.term}</p>
              <p className="mt-2 text-[0.98rem] text-ink/80">
                <span className="text-granite">Opens</span> {row.opens}
              </p>
              <p className="mt-1 text-[0.98rem] text-ink/80">
                <span className="text-granite">Closes</span> {row.closes}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-granite">
          National dates from the Ministry of Primary and Secondary Education, as reported. Private and trust schools may set
          their own, so always check with your school.
        </p>
      </div>

      <h2 className="mt-14 font-display text-[1.75rem] leading-tight text-ink">Getting ready for term</h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-2">
        {TERM_GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guides/${guide.slug}`} className={`${PREMIUM_CARD} p-7`}>
              <span aria-hidden="true" className={PREMIUM_FRAME} />
              <span aria-hidden="true" className={PREMIUM_SHEEN} />
              <span aria-hidden="true" className={PREMIUM_CORNER_TL} />
              <span aria-hidden="true" className={PREMIUM_CORNER_BR} />
              <span className="flex h-full flex-col">
                <span className="text-sm text-granite">Updated {formatGuideDate(guide.updated)}</span>
                <span className="mt-2 font-display text-[1.6rem] leading-snug text-ink group-hover:text-leaf">{guide.title}</span>
                <span className="mt-3 leading-relaxed text-ink/75">{guide.summary}</span>
                <span className="mt-5 flex items-center gap-3 font-semibold text-leaf">
                  Read the guide
                  <span aria-hidden="true" className={`${PREMIUM_ROUNDEL} h-8 w-8 group-hover:bg-brass group-hover:text-white`}>
                    →
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-ink/75">
        Looking for a school for next term?{" "}
        <Link href="/schools" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
          Find a school
        </Link>{" "}
        or browse{" "}
        <Link href="/guides" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
          all our guides
        </Link>
        .
      </p>
    </section>
  );
}
