import type { SocialLink } from "@/lib/schools";

// "Follow the school" tiles in a profile's contact panel. Instagram, Facebook, YouTube and X show
// the platform's own logo, unaltered, in one dark colour (the brands allow single-colour use; don't
// recolour them gold). Any other page gets a plain globe. The platform name sits beside each icon.

function Icon({ label }: { label: string }) {
  const name = label.toLowerCase();
  if (name.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="currentColor">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.25" />
      </svg>
    );
  }
  if (name.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="currentColor">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    );
  }
  if (name.includes("youtube")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"
        />
      </svg>
    );
  }
  if (name === "x" || name.includes("twitter") || name.startsWith("x ")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    );
  }
  // any other page: a globe
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="8.5" {...common} />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" {...common} />
    </svg>
  );
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
              className="group flex h-full items-center gap-3 rounded-xl border border-line bg-paper/60 px-3 py-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-brass/70 hover:bg-white hover:shadow-[0_10px_24px_-14px_rgba(15,42,34,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf motion-reduce:transform-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink ring-1 ring-brass/50 transition duration-200 group-hover:ring-brass">
                <Icon label={link.label} />
              </span>
              <span className="min-w-0 truncate text-sm font-semibold text-ink">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
