// A quiet, crest-like monogram for a school: its initials in Caslon inside a fine double
// brass ring. Every school gets one automatically, so profiles look finished even before
// a school sends us its own badge.

const SKIP = new Set([
  "the", "of", "and", "high", "school", "college", "senior", "junior", "primary", "secondary",
  "academy", "international", "girls", "boys", "girls'", "boys'", "&",
]);

export function schoolInitials(name: string) {
  const words = name.replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
  const meaningful = words.filter((w) => !SKIP.has(w.toLowerCase()));
  const pick = (meaningful.length ? meaningful : words).slice(0, 2);
  return pick.map((w) => w.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase()).join("");
}

export default function SchoolCrest({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const outer = size === "lg" ? "h-20 w-20 sm:h-24 sm:w-24" : "h-11 w-11";
  const text = size === "lg" ? "text-3xl sm:text-4xl" : "text-lg";
  return (
    <span
      aria-hidden="true"
      className={`${outer} inline-flex shrink-0 items-center justify-center rounded-full border border-brass/70 bg-white p-[3px]`}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full border border-brass/40">
        <span className={`font-display ${text} leading-none tracking-wide text-leaf`}>{schoolInitials(name)}</span>
      </span>
    </span>
  );
}
