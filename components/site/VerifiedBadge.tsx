// SchoolSpot's verification seal: a small brass rosette with a white tick, shown for schools
// that have confirmed their own details with us.

export function VerifiedSeal({ className = "h-5 w-5", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <polygon
        points="12.00,1.00 14.51,2.63 17.50,2.47 18.86,5.14 21.53,6.50 21.37,9.49 23.00,12.00 21.37,14.51 21.53,17.50 18.86,18.86 17.50,21.53 14.51,21.37 12.00,23.00 9.49,21.37 6.50,21.53 5.14,18.86 2.47,17.50 2.63,14.51 1.00,12.00 2.63,9.49 2.47,6.50 5.14,5.14 6.50,2.47 9.49,2.63"
        className="fill-brass"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="0.8" />
      <path d="M8.4 12.3l2.4 2.4 4.9-5.2" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function monthYear(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// The badge under a school's name on its profile.
export default function VerifiedBadge({ verified, verifiedAt }: { verified: boolean; verifiedAt: string | null }) {
  if (!verified) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-granite">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-granite/50" />
        Details from public sources, not yet confirmed by the school
      </p>
    );
  }
  const when = monthYear(verifiedAt);
  return (
    <p className="inline-flex items-center gap-3 rounded-full border border-brass/35 bg-brass-soft py-1.5 pl-1.5 pr-4">
      <VerifiedSeal className="h-7 w-7 shrink-0" />
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-ink">Verified school</span>
        <span className="block text-xs text-granite">
          Details confirmed by the school{when ? ` in ${when}` : ""}
        </span>
      </span>
    </p>
  );
}
