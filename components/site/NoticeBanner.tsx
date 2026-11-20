import type { SchoolNotice } from "@/lib/schools";
import { daysUntil } from "@/lib/schools";

function longDate(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

// A time-limited announcement at the top of a profile (e.g. "Lower Sixth 2027, applications
// close 30 November"). Brass-edged porcelain card with a live dot, a Caslon title and a
// countdown. The profile only passes an active notice; after its closing date it disappears.
export default function NoticeBanner({ notice }: { notice: SchoolNotice }) {
  const days = notice.closes_on ? daysUntil(notice.closes_on) : null;
  const countdown =
    days == null ? null : days <= 0 ? "Closes today" : days === 1 ? "1 day left" : `${days} days left`;
  const urgent = days != null && days <= 14;
  const link = notice.link_url && /^https:\/\//.test(notice.link_url) ? notice.link_url : null;

  return (
    <section
      aria-labelledby="notice-title"
      className="relative overflow-hidden rounded-2xl border border-brass/45 bg-brass-soft shadow-[0_24px_50px_-30px_rgba(15,42,34,0.45)]"
    >
      {/* fine brass inset frame */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[6px] rounded-[0.9rem] border border-brass/20" />
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#d9bb84] via-brass to-[#7d5f31]" />

      <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-9 sm:py-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-leaf">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf/40 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" />
            </span>
            {notice.label || "Now enrolling"}
          </p>
          <h2 id="notice-title" className="mt-2 font-display text-[2rem] leading-[1.08] tracking-tight text-ink sm:text-[2.5rem]">
            {notice.title}
          </h2>
          {notice.body && <p className="mt-3 max-w-xl leading-relaxed text-ink/75">{notice.body}</p>}
        </div>

        {(countdown || link) && (
          <div className="flex shrink-0 flex-col items-start gap-4 md:items-end md:text-right">
            {countdown && notice.closes_on && (
              <div>
                <p className={`font-display text-[2.1rem] leading-none ${urgent ? "text-[#8a2f1f]" : "text-ink"}`}>{countdown}</p>
                <p className="mt-1.5 text-sm text-granite">
                  Applications close <span className="font-semibold text-ink">{longDate(notice.closes_on)}</span>
                </p>
              </div>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-dark"
              >
                {notice.link_label || "Find out more"}
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
