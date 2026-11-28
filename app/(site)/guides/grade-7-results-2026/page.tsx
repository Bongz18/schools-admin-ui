import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/guides";

const UPDATED = "2026-11-28";

export const metadata: Metadata = {
  title: "Grade 7 results 2026: next steps for Form 1 | SchoolSpot Zimbabwe",
  description:
    "The 2026 ZIMSEC Grade 7 results are out, with a 50.94% pass rate. How to get them before the portal closes, how Form 1 places for 2027 are decided, eMAP boarding applications, and what to ask secondary schools.",
};

const STEPS = [
  {
    title: "Get the results",
    body: "Check the results on the ZIMSEC results portal (results.zimsec.co.zw) and choose your province. Reports say the portal is open for five days from 27 November, so until about Wednesday 2 December. Save or print a copy. After that, collect the result slip from the centre where your child sat the exam.",
  },
  {
    title: "Shortlist secondary schools",
    body: "Form 1 entrance tests are banned, so schools must decide places on Grade 7 results. Use SchoolSpot to compare schools by city, type, boarding and fees, and to find each school's contacts.",
  },
  {
    title: "Boarding: apply on eMAP before it closes",
    body: "Boarding places at government and registered schools go through the Ministry's online eMAP system, which is reported to close on 31 December 2026. You pick three schools at first. Learners not placed can pick up to five, then seven.",
  },
  {
    title: "Day places: contact schools directly",
    body: "Day places are applied for in person at each school. Some schools say they are already full, so don't wait. Ask how and when to apply, what documents to bring and when the school will confirm a place. The Ministry says every learner who sat Grade 7 will get a Form 1 place for 2027.",
  },
];

const QUESTIONS = [
  "How do you decide Form 1 places, and what Grade 7 units do you usually look for?",
  "When will you confirm a place, and is there a waiting list?",
  "Is there an application or acceptance fee? Has the fee for 2027 been approved by the Ministry?",
  "Do you accept fees in ZiG as well as US dollars?",
  "Which exams will Form 1s sit: ZIMSEC only, or Cambridge as well with Ministry permission?",
  "What uniform and books are needed, and can they be bought anywhere?",
];

const SOURCES = [
  {
    href: "https://www.newzimbabwe.com/zimsec-grade-7-results-out-records-50-94-pass-rate/",
    label: "NewZimbabwe: ZIMSEC Grade 7 results out, records 50.94% pass rate (27 November 2026)",
  },
  {
    href: "https://www.zimbabwesituation.com/news/grade-7-pass-rate-rises-to-5094-percent/",
    label: "The Herald (via Zimbabwe Situation): Grade 7 pass rate rises to 50,94 percent (28 November 2026)",
  },
  { href: "https://results.zimsec.co.zw/", label: "ZIMSEC results portal" },
  {
    href: "https://www.newzimbabwe.com/zimsec-to-release-2026-grade-7-results-on-friday/",
    label: "NewZimbabwe: ZIMSEC to release 2026 Grade 7 results on Friday (25 November 2026)",
  },
  { href: "https://www.heraldonline.co.zw/grade-7-results-out-this-friday/", label: "The Herald: Grade 7 results out this Friday" },
  {
    href: "https://www.heraldonline.co.zw/36-234-form-one-boarding-places-available/",
    label: "The Herald: 36,234 Form One boarding places available (22 November 2026)",
  },
  {
    href: "https://www.heraldonline.co.zw/marginal-decline-in-2025-grade-7-pass-rate/",
    label: "The Herald: Marginal decline in 2025 Grade 7 pass rate (how 2025 results were released)",
  },
  { href: "https://www.heraldonline.co.zw/form-one-entrance-tests-outlawed/", label: "The Herald: Form One entrance tests outlawed" },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink">{children}</h2>;
}

export default function Grade7Results2026Guide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <Link href="/guides" className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
        Grade 7 results 2026: what to do next for Form 1
      </h1>
      <p className="mt-4 text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            The 2026 Grade 7 results came out on Friday 27 November 2026. The national pass rate is 50.94%. Check them on the{" "}
            <a href="https://results.zimsec.co.zw/" target="_blank" rel="noopener noreferrer" className="text-leaf underline decoration-leaf/30 underline-offset-4">
              ZIMSEC results portal
            </a>{" "}
            by about Wednesday 2 December.
          </li>
          <li>Form 1 places for 2027 are based on Grade 7 results. Entrance tests are not allowed.</li>
          <li>Boarding applications are on eMAP, reported to close on 31 December 2026. Apply for day places with each school.</li>
          <li>Schools open for 2027 on Tuesday 12 January.</li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>When the results come out</H2>
        <p className="mt-4">
          ZIMSEC released the 2026 Grade 7 results on Friday 27 November 2026. The national pass rate is 50.94%, up from 48.49%
          in 2025. 395,530 learners sat the exams. Girls passed at 56.39% and boys at 45.18%. These are the first Grade 7 exams
          under the Heritage-Based Curriculum. The Minister, Torerayi Moyo, said the early release gives parents time to look for
          2027 Form 1 places.
        </p>

        <H2>Your next steps</H2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-line bg-white px-5 py-4">
              <p className="font-semibold text-ink">
                {i + 1}. {step.title}
              </p>
              <p className="mt-1">{step.body}</p>
            </li>
          ))}
        </ol>

        <H2>About eMAP boarding places</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>About 36,000 Form 1 boarding places are available at 320 registered schools, for more than 400,000 Grade 7 learners.</li>
          <li>Boarding places are limited, so it is wise to plan for a day school too.</li>
          <li>
            <Link href="/guides/emap-form-1-2027" className="text-leaf underline decoration-leaf/30 underline-offset-4">
              Read our step-by-step eMAP guide
            </Link>
            .
          </li>
          <li>
            Starting boarding in January?{" "}
            <Link href="/guides/boarding-packing-list" className="text-leaf underline decoration-leaf/30 underline-offset-4">
              See our boarding packing list
            </Link>
            .
          </li>
        </ul>

        <H2>What to ask a secondary school</H2>
        <ul className="mt-4 space-y-3">
          {QUESTIONS.map((question) => (
            <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
              {question}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          From 2027, every school must enter learners for ZIMSEC.{" "}
          <Link href="/guides/zimsec-2027" className="text-leaf underline decoration-leaf/30 underline-offset-4">
            Read our ZIMSEC 2027 guide
          </Link>{" "}
          and the{" "}
          <Link href="/guides/school-calendar-2027" className="text-leaf underline decoration-leaf/30 underline-offset-4">
            2027 term dates
          </Link>
          .
        </p>
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
          SchoolSpot Zimbabwe is an independent directory, not part of the Ministry of Primary and Secondary Education or ZIMSEC.
          This guide summarises news reports of public announcements and is not official advice. Check dates and rules with
          ZIMSEC and your child&apos;s school.
        </p>
      </div>
    </article>
  );
}
