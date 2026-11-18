import type { SocialLink } from "@/lib/schools";

// "Follow the school" tiles in a profile's contact panel. Simple generic icons rather than
// the platforms' own logos; the platform name sits beside each icon.

function Icon({ label }: { label: string }) {
  const name = label.toLowerCase();
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name.includes("instagram")) {
    // a camera
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <rect x="3.5" y="6.5" width="17" height="13" rx="3.5" {...common} />
        <path d="M8.5 6.5l1.2-2h4.6l1.2 2" {...common} />
        <circle cx="12" cy="13" r="3.4" {...common} />
      </svg>
    );
  }
  if (name.includes("facebook")) {
    // a speech bubble
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17h-7.5L7 20.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5z" {...common} />
        <path d="M8 10h8M8 13h5" {...common} />
      </svg>
    );
  }
  // any other page: a globe
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="8.5" {...common} />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" {...common} />
    </svg>
  );
}

/** "@handle" for Instagram-style links, otherwise a plain prompt. */
function subtitle(link: SocialLink) {
  try {
    const url = new URL(link.url);
    const first = url.pathname.split("/").filter(Boolean)[0];
    if (url.hostname.includes("instagram.com") && first) return `@${first}`;
  } catch {
    // not a valid URL: fall through
  }
  return "Visit our page";
}

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;
  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="text-[0.8rem] font-semibold text-leaf">Follow the school</p>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center gap-3 rounded-xl border border-line bg-paper/60 px-3 py-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-leaf hover:bg-white hover:shadow-[0_10px_24px_-14px_rgba(15,42,34,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf motion-reduce:transform-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf">
                <Icon label={link.label} />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-sm font-semibold text-ink">{link.label}</span>
                <span className="block truncate text-xs text-granite">{subtitle(link)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
