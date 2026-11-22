import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/guides";
import { TERMS_2027 as TERMS } from "@/lib/schoolCalendar";

const UPDATED = "2026-11-21";

export const metadata: Metadata = {
  title: "2027 school calendar: term dates for Zimbabwe | SchoolSpot Zimbabwe",
  description:
    "Zimbabwe's 2027 school term dates: Term 1 opens 12 January, Term 2 opens 4 May and Term 3 opens 7 September 2027. Holidays, school days per term and what to check with your school.",
};

const HOLIDAYS = [
  { label: "After Term 1", dates: "26 March – 3 May 2027" },
  { label: "After Term 2", dates: "6 August – 6 September 2027" },
  { label: "After Term 3", dates: "3 December 2027 – 10 January 2028" },
];

const QUESTIONS = [
  "Does the school follow the national calendar, or set its own term dates?",
  "When do boarders need to arrive, and when can they go home?",
  "When are fees for each term due?",
  "Are there any extra days off, such as a mid-term break or sports day?",
];

const SOURCES = [
  {
    href: "https://www.thezimbabwean.co/2026/10/2027-school-calendar-released-first-term-commences-on-12-january/",
    label: "The Zimbabwean (Pindula News): 2027 school calendar released (7 October 2026)",
  },
  { href: "https://www.heraldonline.co.zw/2027-school-calendar-out/", label: "The Herald: 2027 school calendar out" },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink">{children}</h2>;
}

export default function SchoolCalendar2027Guide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <Link href="/guides" className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
        2027 school calendar: term dates for Zimbabwe
      </h1>
      <p className="mt-4 text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Schools open for 2027 on Tuesday 12 January.</li>
          <li>Three terms, with 181 school days in total. The year ends on Thursday 2 December 2027.</li>
          <li>Schools reopen for 2028 on Tuesday 11 January 2028.</li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>Term dates</H2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[30rem] text-left text-[0.98rem]">
            <thead className="border-b border-line bg-paper text-sm text-granite">
              <tr>
                <th className="px-5 py-3 font-semibold">Term</th>
                <th className="px-5 py-3 font-semibold">Opens</th>
                <th className="px-5 py-3 font-semibold">Closes</th>
                <th className="px-5 py-3 text-right font-semibold">School days</th>
              </tr>
            </thead>
            <tbody>
              {TERMS.map((row) => (
                <tr key={row.term} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-semibold text-ink">{row.term}</td>
                  <td className="px-5 py-3">{row.opens}</td>
                  <td className="px-5 py-3">{row.closes}</td>
                  <td className="px-5 py-3 text-right">{row.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          The dates were announced by the Ministry of Primary and Secondary Education. Its Permanent Secretary, Moses Mhike,
          asked parents, teachers and learners to note them and plan ahead.
        </p>

        <H2>School holidays</H2>
        <ul className="mt-4 space-y-3">
          {HOLIDAYS.map((holiday) => (
            <li key={holiday.label} className="flex flex-wrap justify-between gap-x-6 rounded-xl border border-line bg-white px-5 py-3">
              <span className="font-semibold text-ink">{holiday.label}</span>
              <span>{holiday.dates}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          These are the days between the published closing and opening dates. Easter falls in the first holiday (Good Friday is
          26 March 2027).
        </p>

        <H2>Good to know</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            These dates come from news reports of the Ministry&apos;s announcement. We have not yet seen the Ministry&apos;s
            circular itself, and will update this guide if any date changes.
          </li>
          <li>
            Government and council schools follow the national calendar. Private and trust schools often keep similar dates, but
            some set their own, especially for boarders and Cambridge exam classes.
          </li>
          <li>
            2027 is also the first year that ZIMSEC is compulsory for every school.{" "}
            <Link href="/guides/zimsec-2027" className="text-leaf underline decoration-leaf/30 underline-offset-4">
              Read our ZIMSEC 2027 guide
            </Link>
            .
          </li>
        </ul>

        <H2>What to ask your school</H2>
        <ul className="mt-4 space-y-3">
          {QUESTIONS.map((question) => (
            <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
              {question}
            </li>
          ))}
        </ul>
        <p className="mt-4">Each school&apos;s page on SchoolSpot has its email and phone so you can ask directly.</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/schools" className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark">
            Find a school
          </Link>
          <Link href="/compare" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
            Compare schools
          </Link>
        </div>

        <H2>Where this information comes from</H2>
        <ul className="mt-4 space-y-2 text-[0.98rem]">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-leaf underline decoration-leaf/30 underline-offset-4">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 rounded-xl bg-paper p-5 text-sm text-granite ring-1 ring-line">
          SchoolSpot Zimbabwe is an independent directory, not part of the Ministry of Primary and Secondary Education. This
          guide summarises public announcements and is not official advice. Always confirm dates with your child&apos;s school.
        </p>
      </div>
    </article>
  );
}
