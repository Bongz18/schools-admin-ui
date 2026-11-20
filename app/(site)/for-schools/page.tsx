import type { Metadata } from "next";
import HighlightList from "@/components/site/HighlightList";

export const metadata: Metadata = {
  title: "For schools: list your school free | SchoolSpot Zimbabwe",
  description: "List your school on SchoolSpot Zimbabwe for free. We build your profile from the details you send, and you approve every word before it goes live.",
};

// Shown as headed points ("Heading: description").
const PROFILE_INCLUDES = [
  "Fees, clearly set out: Day fees for every level, with boarding shown separately.",
  "Exam results: Pass rates year by year, with top grades where the school reports them.",
  "Highlights: New subjects, sports and cultural achievements, in the school's own words.",
  "Direct contacts: Emails for admissions and each division, plus the school's social pages.",
  "The verified seal: A gold seal once the school has confirmed its own details.",
  "Your approval first: Nothing goes live until the school has checked and approved its profile.",
];

export default function ForSchoolsPage() {
  return (
    <section aria-labelledby="for-schools" className="bg-leaf-soft/55">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div>
            <span aria-hidden="true" className="block h-px w-10 bg-brass" />
            <h1 id="for-schools" className="mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
              Your school, presented properly.
            </h1>
          </div>
          <div>
            <p className="max-w-md text-lg leading-relaxed text-ink/75">
              Listing is free. We build your profile from the details you send us, and you approve every word before it
              goes live.
            </p>
            <a
              href="mailto:schoolspotzw@gmail.com?subject=List%20our%20school%20on%20SchoolSpot"
              className="mt-7 inline-flex rounded-full bg-leaf px-7 py-3 font-semibold text-white shadow-[0_8px_20px_-10px_rgba(18,48,31,0.6)] transition-colors hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              List your school free
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-leaf/15 pt-12">
          <h2 className="font-display text-[1.6rem] leading-tight text-ink">Every profile includes</h2>
          <HighlightList items={PROFILE_INCLUDES} tone="light" className="mt-6 lg:grid-cols-3" />
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-granite">
            Fees change from term to term, so every profile shows where its figures came from.
          </p>
        </div>
      </div>
    </section>
  );
}
