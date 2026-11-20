import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/guides";

const UPDATED = "2026-11-20";

export const metadata: Metadata = {
  title: "ZIMSEC from 2027: what it means for your child | SchoolSpot Zimbabwe",
  description:
    "From 2027 every school in Zimbabwe must register learners for ZIMSEC, with Cambridge only as an approved extra. What parents need to know and what to ask the school.",
};

const SOURCES = [
  { href: "https://x.com/TorerayiMoyo/status/2050289320724942867", label: "Minister Torerayi Moyo, post on X (May 2026)" },
  { href: "https://www.newzimbabwe.com/government-declares-zimsec-mandatory-for-all-schools-from-2027/", label: "NewZimbabwe: Government declares ZIMSEC mandatory for all schools from 2027" },
  { href: "https://www.heraldonline.co.zw/govt-clarifies-transition-for-cambridge-learners-as-zimsec-becomes-compulsory/", label: "The Herald: Govt clarifies transition for Cambridge learners" },
  { href: "https://www.heraldonline.co.zw/heritage-based-curriculum-now-compulsory/", label: "The Herald: Heritage-based curriculum now compulsory" },
];

const QUESTIONS = [
  "Will you offer ZIMSEC, Cambridge or both in 2027?",
  "If you plan to keep Cambridge, has the Ministry approved it yet?",
  "Which year group will sit ZIMSEC first, and for which subjects?",
  "Will fees change because learners are entered for two sets of exams?",
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink">{children}</h2>;
}

export default function Zimsec2027Guide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <Link href="/guides" className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
        ZIMSEC from 2027: what it means for your child
      </h1>
      <p className="mt-4 text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>From 2027, every school in Zimbabwe, including private and trust schools, must register its learners for ZIMSEC exams.</li>
          <li>Cambridge is not banned. Schools that want to offer it alongside ZIMSEC must apply to the Ministry for permission.</li>
          <li>The detailed rules have not been published yet, so ask your school what it plans to do.</li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>What was announced</H2>
        <p className="mt-4">
          On 1 May 2026 the Minister of Primary and Secondary Education, Torerayi Moyo, told the Senate that from 2027 all
          schools must enter their learners for national exams set by the Zimbabwe School Examinations Council (ZIMSEC). He
          repeated this on his official X account, adding that Cambridge exams are not being banned, but that a school wanting
          to offer both must apply for permission and justify it.
        </p>
        <p className="mt-4">
          The change goes with the Heritage-Based Curriculum (2024–2030), which the Government says will be the core curriculum
          in every school, with international courses such as Cambridge as an optional extra.
        </p>

        <H2>Who is affected</H2>
        <p className="mt-4">
          Government, council and mission schools already use ZIMSEC, so little changes for them. The change matters most for
          private and trust schools that have entered learners only for Cambridge IGCSE, AS and A Level. Learners at those
          schools are likely to sit ZIMSEC, and possibly Cambridge as well.
        </p>

        <H2>What we don&apos;t know yet</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>How and by when schools apply to keep Cambridge.</li>
          <li>Which year groups sit ZIMSEC first, and whether learners part-way through a Cambridge course are treated differently.</li>
          <li>What happens to schools that do not comply.</li>
        </ul>
        <p className="mt-4">
          We have not yet seen a published Ministry circular setting out these details. We will update this guide when one is
          issued.
        </p>

        <H2>What to ask your school</H2>
        <ul className="mt-4 space-y-3">
          {QUESTIONS.map((question) => (
            <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
              {question}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Each school&apos;s page on SchoolSpot shows the curriculum it has confirmed with us, and its email and phone so you can
          ask directly.
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
          SchoolSpot Zimbabwe is an independent directory, not part of the Ministry or ZIMSEC. This guide summarises public
          announcements and is not official or legal advice. Always confirm with the school and the Ministry of Primary and
          Secondary Education.
        </p>
      </div>
    </article>
  );
}
