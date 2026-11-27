import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/guides";

const UPDATED = "2026-11-27";

export const metadata: Metadata = {
  title: "How to apply for Form 1 boarding places on eMAP (2027) | SchoolSpot Zimbabwe",
  description:
    "Key dates, how the school choices work, and what to do if your child isn't placed for Form 1 boarding in 2027. A parent's guide to the Ministry's eMAP platform.",
};

const SOURCES = [
  {
    href: "https://www.zimbabwesituation.com/news/36-234-form-one-boarding-places-available/",
    label: "The Herald (via Zimbabwe Situation): 36 234 Form One boarding places available, 22 November 2026",
  },
  {
    href: "https://news.pindula.co.zw/2026/10/27/2027-form-one-boarding-applications-now-open-online/",
    label: "Pindula News: 2027 Form One boarding applications now open online, 27 October 2026",
  },
  { href: "http://www.emap.co.zw/Form1Enrol/", label: "eMAP Form 1 enrolment page (Ministry of Primary and Secondary Education)" },
  {
    href: "https://www.newzimbabwe.com/zimsec-to-release-2026-grade-7-results-on-friday/",
    label: "NewZimbabwe: ZIMSEC to release 2026 Grade 7 results on Friday, 25 November 2026",
  },
];

const NEED = [
  "Your child's Grade 7 centre number and candidate number",
  "Your child's date of birth, as it appears on their exam record",
  "A mobile number you check every day (offers and updates come by SMS)",
  "An email address (optional)",
  "A password you will remember. Write it down somewhere safe: you need it to check for offers.",
];

const STEPS = [
  "Go to www.emap.co.zw and open the Form 1 enrolment page.",
  "Register with your child's centre number, candidate number and date of birth, plus your phone number and a password.",
  "Choose to apply for a Form 1 place, then pick a province and district.",
  "Choose a boarding school and apply. Repeat until you have used your choices. Your schools can be in different provinces.",
  "Log in regularly and check the status of your application. Don't rely on the SMS alone.",
];

const CHECKS = [
  "Fees and levies: the total per term including boarding, not just tuition",
  "Distance and travel: how your child will get there and home at the start and end of each term",
  "Exam results: recent O and A Level results, if the school shares them",
  "Exams from 2027: ZIMSEC becomes compulsory for all schools",
  "Boys, girls or mixed: places are counted separately for boys and girls",
  "What boarders need to bring",
];

const STATUSES = [
  { name: "Pending", meaning: "the school hasn't decided yet" },
  { name: "Accepted", meaning: "the school has offered your child a place" },
  { name: "Processed", meaning: "another school has already accepted your child, so this application is closed" },
  { name: "Rejected", meaning: "the school has not offered a place" },
];

const QUESTIONS = [
  "What are the total fees for Form 1 boarders in Term 1 2027, and in which currencies can we pay?",
  "What must we pay or bring when we accept a place, and by when?",
  "When do new Form 1 boarders arrive? (Term 1 2027 starts on 12 January.)",
  "Will Form 1 in 2027 follow ZIMSEC only, or ZIMSEC and Cambridge?",
  "What does the school provide, and what must boarders bring?",
];

const linkClass = "text-leaf underline decoration-leaf/30 underline-offset-4";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink">{children}</h2>;
}

export default function EmapForm1Guide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <Link href="/guides" className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
        How to apply for Form 1 boarding places on eMAP (2027)
      </h1>
      <p className="mt-4 text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            eMAP is the Ministry of Primary and Secondary Education&apos;s online system for applying for Form 1 boarding places.
          </li>
          <li>It opened on 6 November 2026 and is expected to close on 31 December 2026.</li>
          <li>
            Apply at{" "}
            <a href="http://www.emap.co.zw/Form1Enrol/" target="_blank" rel="noopener noreferrer" className={linkClass}>
              www.emap.co.zw
            </a>
            . You can choose 3 schools for now. The Ministry says this will rise to 5, then 7, for learners not yet placed.
          </li>
          <li>
            We have not seen any fee for applying. Be wary of anyone who asks you to pay for a place or a &quot;guaranteed&quot; offer.
          </li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>Why it&apos;s worth applying early</H2>
        <p className="mt-4">
          There are about 36,234 Form 1 boarding places for 2027 (17,777 for boys and 18,457 for girls) at 320 boarding schools.
          More than 413,000 learners sat Grade 7 in 2026, so fewer than 1 in 10 can get a boarding place. More than 13,000
          learners applied in the first week alone.
        </p>
        <p className="mt-4">
          The 2026 Grade 7 results were due out on Friday 27 November 2026. Schools look at results when they make offers, so
          this is when activity on eMAP picks up.
        </p>

        <H2>What you need before you start</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {NEED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4">
          If your child finished primary school outside Zimbabwe, contact your nearest provincial education office first. They may
          need to see your child&apos;s papers.
        </p>

        <H2>How to apply, step by step</H2>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 rounded-xl border border-brass/40 bg-brass/10 px-5 py-4">
          <span className="font-semibold text-ink">Important:</span> reports say that once you apply to a school, you
          can&apos;t change that choice. Decide on your schools before you start.
        </p>

        <H2>Choosing your schools</H2>
        <p className="mt-4">With only three choices at first, each one counts. Before you apply, check for each school:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {CHECKS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4">
          See our guides on{" "}
          <Link href="/guides/zimsec-2027" className={linkClass}>
            ZIMSEC from 2027
          </Link>{" "}
          and the{" "}
          <Link href="/guides/boarding-packing-list" className={linkClass}>
            boarding school packing list
          </Link>
          . You can compare schools side by side on SchoolSpot. Schools marked Verified have confirmed their details with us.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/compare" className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark">
            Compare schools
          </Link>
          <Link href="/schools" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
            Find a school
          </Link>
        </div>

        <H2>Understanding your application status</H2>
        <p className="mt-4">Each school you applied to will show one of these:</p>
        <ul className="mt-4 space-y-3">
          {STATUSES.map((status) => (
            <li key={status.name} className="rounded-xl border border-line bg-white px-5 py-3">
              <span className="font-semibold text-ink">{status.name}:</span> {status.meaning}
            </li>
          ))}
        </ul>
        <p className="mt-4">Think carefully before turning down an offer. There is no guarantee of another one.</p>

        <H2>If your child isn&apos;t placed</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            Keep checking eMAP. The Ministry says the number of choices will go up to 5 and then 7 for learners who haven&apos;t
            been placed. Use the new choices as soon as they appear.
          </li>
          <li>Look beyond the best-known schools. They get far more applications than they have places.</li>
          <li>
            Consider day school. eMAP is for boarding only, and not every learner needs boarding. If day school works for your
            family, contact local schools directly about Form 1 places.
          </li>
          <li>Private and mission schools may run their own admissions alongside eMAP. Check with each school.</li>
        </ul>

        <H2>Questions to ask a school</H2>
        <ul className="mt-4 space-y-3">
          {QUESTIONS.map((question) => (
            <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
              {question}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Term dates are in our{" "}
          <Link href="/guides/school-calendar-2027" className={linkClass}>
            2027 school calendar
          </Link>
          .
        </p>

        <H2>Good to know</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            These details come from news reports and the eMAP website as of {formatGuideDate(UPDATED)}. We have not seen a
            Ministry circular for the 2027 intake. Dates and the number of choices may change, so check eMAP itself.
          </li>
          <li>The Ministry has banned Form 1 entrance tests. Places are based on Grade 7 results.</li>
          <li>
            SchoolSpot Zimbabwe is not part of the Ministry or eMAP. We can&apos;t apply for you or influence offers.
          </li>
        </ul>

        <H2>Where this information comes from</H2>
        <ul className="mt-4 space-y-2 text-[0.98rem]">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 rounded-xl bg-paper p-5 text-sm text-granite ring-1 ring-line">
          SchoolSpot Zimbabwe is an independent directory, not part of the Ministry or eMAP. This guide summarises public
          information and is not official advice. Always check eMAP and the school directly before making decisions.
        </p>
      </div>
    </article>
  );
}
