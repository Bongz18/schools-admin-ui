// A list of highlights on a dark evergreen panel: a soft brass dot, a Caslon heading and the
// description below. On hover each item lifts into a rounded card with fine brass corners.
// Items written as "Heading: description" are split; other items show as plain text.
// Used for a school's Highlights and for "Every profile includes" on the home page.

export function splitHighlight(item: string) {
  const at = item.indexOf(": ");
  if (at > 0 && at <= 60) {
    const body = item.slice(at + 2).trim();
    return { heading: item.slice(0, at).trim(), body: body.charAt(0).toUpperCase() + body.slice(1) };
  }
  return { heading: null, body: item };
}

export default function HighlightList({
  items,
  className = "",
  tone = "dark",
}: {
  items: string[];
  className?: string;
  /** "dark" for an evergreen panel (white text); "light" for a pale background (ink text). */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <ul className={`-mx-4 grid gap-x-6 gap-y-2 md:grid-cols-2 ${className}`}>
      {items.map((item) => {
        const { heading, body } = splitHighlight(item);
        return (
          <li
            key={item}
            className={`group relative flex origin-left gap-4 rounded-2xl px-4 py-3.5 leading-relaxed ${light ? "text-ink/85" : "text-white/90"} transition duration-300 ease-out before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-5 before:w-5 before:rounded-tl-2xl before:border-l before:border-t before:border-brass before:opacity-0 before:transition-opacity before:duration-300 after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-5 after:w-5 after:rounded-br-2xl after:border-b after:border-r after:border-brass after:opacity-0 after:transition-opacity after:duration-300 hover:scale-[1.03] ${light ? "hover:bg-white hover:shadow-[0_18px_40px_-22px_rgba(15,42,34,0.35)]" : "hover:bg-white/[0.06] hover:text-white hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]"} hover:before:opacity-100 hover:after:opacity-100 motion-reduce:transform-none`}
          >
            <span
              aria-hidden="true"
              className="mt-[0.4rem] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brass/20 ring-1 ring-brass/40 transition duration-300 group-hover:bg-brass/35 group-hover:ring-brass/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            </span>
            {heading ? (
              <span className="min-w-0">
                <span className={`block font-display text-[1.2rem] leading-snug ${light ? "text-ink" : "text-white"}`}>{heading}</span>
                <span className={`mt-1.5 block text-[0.95rem] leading-relaxed ${light ? "text-granite" : "text-white/75 group-hover:text-white/85"}`}>
                  {body}
                </span>
              </span>
            ) : (
              <span>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
