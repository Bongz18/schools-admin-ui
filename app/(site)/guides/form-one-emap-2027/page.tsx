import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/guides";

const UPDATED = "2026-11-22";
const PORTAL = "http://www.emap.co.zw/Form1Enrol/";

export const metadata: Metadata = {
  title: "Form One boarding places 2027: how to apply on eMAP | SchoolSpot Zimbabwe",
  description:
    "How to apply for a 2027 Form One boarding place in Zimbabwe on the Ministry's eMAP portal: dates, how many schools you can choose, what you need and what happens after you apply.",
};

const STEPS = [
  {
    title: "Open the eMAP portal",
    body: "Go to the Ministry's Form One enrolment site and choose the option to sign up for a new account.",
  },
  {
    title: "Create one account for your child",
    body: "You enter your child's Grade 7 exam centre number, candidate number and date of birth, plus your mobile number and a password. Each child should have only one account.",
  },
  {
    title: "Choose your schools",
    body: "Log in, choose Apply for a Form 1 place, then pick a province, a district and a school. Repeat for each school. The schools are not ranked, so pick only ones you would accept.",
  },
  {
    title: "Wait for an offer",
    body: "Schools look at the applications and offer places. You are told by SMS and can see the status of each application when you log in.",
  },
  {
    title: "Accept or decline quickly",
    body: "Reply to an offer as soon as you can. A place you turn down goes to another child and may not be offered again.",
  },
];

const QUESTIONS = [
  "Do you take Form One boarders through eMAP, or do we apply to you directly?",
  "How do you choose between applicants: Grade 7 results, an interview, or something else?",
  "When will you start making offers, and how long do we have to accept?",
  "What are the 2027 boarding fees, and what must be paid to secure the place?",
  "Do you also have day places, and how do we apply for those?",
];

const SOURCES = [
  {
    href: "https://www.heraldonline.co.zw/36-234-form-one-boarding-places-available/",
    label: "The Herald: 36 234 Form One boarding places available (22 November 2026)",
  },
  {
    href: "https://www.zimbabwesituation.com/news/36-234-form-one-boarding-places-available/",
    label: "Zimbabwe Situation: the same Herald report, republished (22 November 2026)",
  },
  {
    href: "https://www.techzim.co.zw/2025/11/emap-2026-form-1-places-online-platform-opens/",
    label: "Techzim: how eMAP worked for the 2026 intake (6 November 2025)",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink">{children}</h2>;
}

const linkClass = "text-leaf underline decoration-leaf/30 underline-offset-4";

export default function FormOneEmap2027Guide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <Link href="/guides" className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
        Form One boarding places for 2027: how to apply on eMAP
      </h1>
      <p className="mt-4 text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Applications for 2027 Form One boarding places are made online, on the Ministry&apos;s eMAP portal.</li>
          <li>It opened on 6 November 2026 and is expected to close on 31 December 2026.</li>
          <li>You can choose up to three schools for now. The Ministry says this will rise to five, then seven, for learners who have not been placed.</li>
          <li>There are about 36,000 boarding places, so apply early and choose carefully.</li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>What eMAP is</H2>
        <p className="mt-4">
          eMAP (the Electronic Ministry Application Platform) is the Ministry of Primary and Secondary Education&apos;s website
          for Form One boarding applications. Parents apply online instead of queuing at schools, and can follow each
          application from home.
        </p>
        <p className="mt-4">
          For 2027 there are 36,234 boarding places at 320 schools: 17,777 for boys and 18,457 for girls. That is less than one
          place for every ten children who sat Grade 7 this year. In the first week, parents made almost 34,000 applications for
          more than 13,000 children.
        </p>

        <H2>How to apply</H2>
        <ol className="mt-5 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-xl border border-line bg-white px-5 py-4">
              <span className="font-display text-2xl leading-none text-brass">{index + 1}</span>
              <span>
                <span className="block font-semibold text-ink">{step.title}</span>
                <span className="mt-1 block">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4">
          The portal is at{" "}
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className={`break-all ${linkClass}`}>
            emap.co.zw/Form1Enrol
          </a>
          . No application fee has been reported. Be wary of anyone who asks you to pay to apply or promises a place.
        </p>

        <H2>Good to know</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            You do not need the Grade 7 results to apply. The 2026 results are expected soon, and schools usually start
            offering places once the results are out.
          </li>
          <li>
            eMAP covers boarding places at government and mission schools that have signed up. Most private and trust schools
            take applications directly, often with their own forms and deadlines, so check each school.
          </li>
          <li>
            Form One entrance tests are banned. Schools should not ask your child to sit one, and places are meant to be based
            on Grade 7 results.
          </li>
          <li>
            The dates and choice limits come from news reports quoting the Ministry. We have not seen a Ministry circular, and
            will update this guide if anything changes.
          </li>
        </ul>

        <H2>What to ask a school</H2>
        <ul className="mt-4 space-y-3">
          {QUESTIONS.map((question) => (
            <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
              {question}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Each school&apos;s page on SchoolSpot shows whether it has boarding, its fees, and its email and phone so you can ask
          directly.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/schools?boarding=boarding" className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark">
            Find a boarding school
          </Link>
          <Link href="/guides/boarding-packing-list" className={`font-semibold ${linkClass}`}>
            Boarding packing list
          </Link>
          <Link href="/guides/school-calendar-2027" className={`font-semibold ${linkClass}`}>
            2027 term dates
          </Link>
        </div>

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
          SchoolSpot Zimbabwe is an independent directory, not part of the Ministry of Primary and Secondary Education, and is
          not connected to eMAP. This guide summarises public reports and is not official advice. Always check details on the
          portal and with the school.
        </p>
      </div>
    </article>
  );
}
