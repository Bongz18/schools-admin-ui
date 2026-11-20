import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, formatGuideDate } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides for parents | SchoolSpot Zimbabwe",
  description: "Plain-English guides for parents choosing a school in Zimbabwe: exams, fees, enrolment and Ministry rules.",
};

export default function GuidesPage() {
  return (
    <section aria-labelledby="guides" className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
      <span aria-hidden="true" className="block h-px w-10 bg-brass" />
      <h1 id="guides" className="mt-5 font-display text-[2.4rem] leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
        Guides for parents
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
        Plain-English explanations of exams, fees and school rules in Zimbabwe, with links to where the information came from.
      </p>
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_22px_44px_-26px_rgba(15,42,34,0.45)]"
            >
              <span className="text-sm text-granite">Updated {formatGuideDate(guide.updated)}</span>
              <span className="mt-2 font-display text-[1.6rem] leading-snug text-ink group-hover:text-leaf">{guide.title}</span>
              <span className="mt-3 leading-relaxed text-ink/75">{guide.summary}</span>
              <span className="mt-5 font-semibold text-leaf">Read the guide →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
