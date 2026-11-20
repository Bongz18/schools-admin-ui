import type { School } from "@/lib/schools";
import Link from "next/link";
import { monthYear } from "@/components/site/VerifiedBadge";

function officialSite(website: string | null) {
  if (!website) return null;
  const href = website.startsWith("http") ? website : `https://${website}`;
  const label = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return { href, label };
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.3" r="0.95" fill="currentColor" />
    </svg>
  );
}

// A clear line at the top of every profile: this is SchoolSpot's independent listing, not the
// school's own website, with a link to the official site where we have one.
export function IndependentListingNote({ school }: { school: Pick<School, "name" | "website"> }) {
  const site = officialSite(school.website);
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 py-3 text-[0.85rem] text-granite sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <p className="flex items-start gap-2 sm:items-center">
          <InfoIcon className="mt-[0.15rem] h-4 w-4 shrink-0 text-brass sm:mt-0" />
          <span>
            <span className="font-semibold text-ink">Independent listing by SchoolSpot Zimbabwe.</span>{" "}
            This is not the official website of {school.name}.
          </span>
        </p>
        {site && (
          <a
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 pl-6 font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf sm:pl-0"
          >
            Official school website: {site.label} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}

// "About this listing" at the foot of every profile: who runs the page, where the details came
// from, and that parents should confirm everything with the school.
export default function ListingDisclaimer({
  school,
}: {
  school: Pick<School, "name" | "website" | "verified" | "verified_at">;
}) {
  const when = monthYear(school.verified_at);
  const site = officialSite(school.website);
  return (
    <section aria-labelledby="about-listing" className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <h2 id="about-listing" className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-leaf">
          <InfoIcon className="h-4 w-4 text-brass" />
          About this listing
        </h2>
        <div className="mt-4 grid gap-4 text-[0.9rem] leading-relaxed text-granite md:grid-cols-2 md:gap-x-10">
          <p>
            SchoolSpot Zimbabwe is an independent school directory. This page is not the official website of {school.name},
            and it is not run by or on behalf of the school.
            {site && (
              <>
                {" "}For official information, visit{" "}
                <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">
                  {site.label}
                </a>
                .
              </>
            )}
          </p>
          <p>
            {school.verified
              ? `The school confirmed these details${when ? ` in ${when}` : ""}. `
              : "These details come from public sources and have not yet been confirmed by the school. "}
            Fees, results, dates and other details can change, so always confirm them directly with the school before applying,
            paying or making a decision. SchoolSpot Zimbabwe cannot accept responsibility for decisions based on this page.
          </p>
          <p className="md:col-span-2">
            School names, crests and trademarks belong to their owners. Is something on this page wrong? Email{" "}
            <a href="mailto:schoolspotzw@gmail.com" className="text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">
              schoolspotzw@gmail.com
            </a>{" "}
            and we will correct it. See our{" "}
            <Link href="/terms" className="text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">Terms of Use</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
