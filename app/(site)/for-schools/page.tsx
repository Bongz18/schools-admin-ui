import type { Metadata } from "next";
import { VerifiedSeal } from "@/components/site/VerifiedBadge";
import {
  PREMIUM_CARD,
  PREMIUM_CORNER_BR,
  PREMIUM_CORNER_TL,
  PREMIUM_FRAME,
  PREMIUM_ROUNDEL,
  PREMIUM_SHEEN,
  PREMIUM_WATERMARK,
} from "@/components/site/premiumTheme";

export const metadata: Metadata = {
  title: "For schools: list your school free | SchoolSpot Zimbabwe",
  description:
    "List your school on SchoolSpot Zimbabwe for free. We build your profile from the details you send, and you approve every word before it goes live.",
};

const EMAIL = "schoolspotzw@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=List%20our%20school%20on%20SchoolSpot`;

const PROMISES = ["Free to list", "You approve every word", "Nothing to set up"];

const STEPS = [
  {
    title: "Send what you have",
    body: "Email us your fee schedule, prospectus or results summary. Existing documents are perfect.",
  },
  {
    title: "Check a private preview",
    body: "We build your profile and send you a private link. It stays hidden while you review it.",
  },
  {
    title: "Approve and go live",
    body: "Once you approve, your profile goes live and parents can contact you directly.",
  },
];

const INCLUDES = [
  { title: "Fees, clearly set out", body: "Day fees for every level, with boarding shown separately." },
  { title: "Exam results", body: "Pass rates year by year, with top grades where you report them." },
  { title: "Highlights", body: "Subjects, sport and cultural achievements, in your own words." },
  { title: "Direct contacts", body: "Admissions and division emails, phone and your social pages." },
  { title: "The verified seal", body: "A gold seal once you have confirmed your own details." },
  { title: "Notices", body: "Enrolment dates and open days, shown at the top of your page." },
];

const WE_ASK_FOR = [
  "Current term fees (day and boarding, by level)",
  "O and A Level results for recent years",
  "Up to eight highlights",
  "Admissions email and phone",
  "Street address, website and social pages",
  "Whether you offer ZIMSEC, Cambridge or both from 2027",
];

const FAQ = [
  { q: "Is it really free?", a: "Yes. There is no charge to be listed on SchoolSpot." },
  {
    q: "Who sees our profile before it goes live?",
    a: "Only you. The preview link is private, and nothing is published until you approve it.",
  },
  {
    q: "Can we update or remove our profile later?",
    a: "Yes. Email us new fees or results at any time, or ask us to take the profile down.",
  },
  {
    q: "Do parents contact us through SchoolSpot?",
    a: "No. Parents email or call you directly using the details on your page. We don't see or keep their messages.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm font-semibold tracking-wide text-brass">
      <span aria-hidden="true" className="block h-px w-8 bg-brass" />
      {children}
    </p>
  );
}

function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.35rem]">
      {children}
    </h2>
  );
}

export default function ForSchoolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-leaf-dark text-white">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <Eyebrow>For schools</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-[2.5rem] leading-[1.05] tracking-tight sm:text-[3.5rem]">
            Your school, presented properly.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            A clear, accurate profile that parents can trust. We build it from the details you send, and you approve every
            word before it goes live.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm text-white/90"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass" />
                {promise}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={MAILTO}
              className="rounded-full bg-brass px-7 py-3 font-semibold text-leaf-dark transition hover:bg-[#bb9558] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              List your school free
            </a>
          </div>
          <p className="mt-5 text-sm text-white/60">
            Or email <span className="select-all font-semibold text-white/85">{EMAIL}</span>
          </p>
        </div>
      </section>

      {/* How listing works */}
      <section aria-labelledby="steps" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Eyebrow>How listing works</Eyebrow>
        <SectionTitle id="steps">Three steps, no logins</SectionTitle>
        <ol className="mt-8 grid gap-3 sm:mt-10 md:grid-cols-3 md:gap-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5 md:block md:p-7">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-soft font-display text-[1.35rem] text-leaf">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-[1.35rem] leading-snug text-ink md:mt-5 md:text-[1.45rem]">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-granite md:mt-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Every profile includes */}
      <section aria-labelledby="includes" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>What parents see</Eyebrow>
          <SectionTitle id="includes">Every profile includes</SectionTitle>
          <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {INCLUDES.map((item, i) => (
              <li key={item.title}>
                <div className={`${PREMIUM_CARD} px-6 pb-7 pt-7 sm:px-7`}>
                  <span className={PREMIUM_FRAME} aria-hidden="true" />
                  <span className={PREMIUM_SHEEN} aria-hidden="true" />
                  <span className={PREMIUM_CORNER_TL} aria-hidden="true" />
                  <span className={PREMIUM_CORNER_BR} aria-hidden="true" />
                  <span aria-hidden="true" className={`${PREMIUM_WATERMARK} -bottom-7 right-6 text-[6.5rem]`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-3">
                    {item.title === "The verified seal" ? (
                      <VerifiedSeal className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <span aria-hidden="true" className={`${PREMIUM_ROUNDEL} h-9 w-9 group-hover:scale-110`}>
                        <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-brass" />
                      </span>
                    )}
                    <h3 className="font-display text-[1.3rem] leading-snug text-ink">{item.title}</h3>
                  </div>
                  <span aria-hidden="true" className="mt-4 block h-px w-8 bg-brass/50 transition-all duration-300 group-hover:w-14" />
                  <p className="mt-3 leading-relaxed text-granite">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-granite">Fees change from term to term, so every profile shows where its figures came from.</p>
        </div>
      </section>

      {/* What we ask for + common questions */}
      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>What to send</Eyebrow>
          <SectionTitle>What we ask for</SectionTitle>
          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
            {WE_ASK_FOR.map((item) => (
              <li key={item} className="flex items-start gap-3 px-5 py-4 leading-relaxed text-ink/85">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="mt-1 h-4 w-4 shrink-0 text-leaf"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-granite">Send what you have. We can fill any gaps later.</p>
        </div>

        <div>
          <Eyebrow>Questions</Eyebrow>
          <SectionTitle>Common questions</SectionTitle>
          <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-xl leading-none text-brass transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-granite">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="rounded-3xl bg-leaf-soft px-7 py-10 text-center ring-1 ring-inset ring-leaf/10 sm:px-12 sm:py-14">
          <h2 className="font-display text-[1.9rem] leading-tight text-ink sm:text-[2.3rem]">Ready to list your school?</h2>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink/75">
            Email us your fee schedule or prospectus. We&apos;ll send you a private preview to approve.
          </p>
          <a
            href={MAILTO}
            className="mt-7 inline-flex rounded-full bg-leaf px-7 py-3 font-semibold text-white transition hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            List your school free
          </a>
          <p className="mt-4 text-sm text-granite">
            Or email <span className="select-all font-semibold text-ink">{EMAIL}</span>
          </p>
        </div>
      </section>
    </>
  );
}
