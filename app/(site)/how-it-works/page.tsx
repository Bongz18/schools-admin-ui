import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How SchoolSpot works | SchoolSpot Zimbabwe",
  description: "Search, compare and contact schools in Zimbabwe in three steps. Free for parents, no sign-up.",
};

const STEPS = [
  { title: "Search", body: "Filter by city, fees, boarding and whether the school takes girls, boys or both." },
  { title: "Compare", body: "Put up to three schools side by side: fees, curriculum, boarding and results on one screen." },
  { title: "Contact", body: "Email or call the school directly about places, fees and open days, using the details on its page." },
];

export default function HowItWorksPage() {
  return (
    <section aria-labelledby="how" className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <span aria-hidden="true" className="block h-px w-10 bg-brass" />
      <h1 id="how" className="mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
        How SchoolSpot works
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
        From a first search to a reply from the school, in three steps. Free for parents, no sign-up.
      </p>
      <ol className="mt-14 grid gap-10 rounded-2xl border border-line bg-white p-8 sm:p-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
        {STEPS.map((step, index) => (
          <li key={step.title} className="md:px-10 md:first:pl-0 md:last:pr-0">
            <span className="font-display text-[2.6rem] leading-none text-brass">{index + 1}</span>
            <h2 className="mt-4 font-display text-[1.6rem] leading-tight text-leaf">{step.title}</h2>
            <p className="mt-3 leading-relaxed text-ink/75">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/schools"
          className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Search schools
        </Link>
        <Link href="/compare" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">
          Compare schools
        </Link>
      </div>
    </section>
  );
}
