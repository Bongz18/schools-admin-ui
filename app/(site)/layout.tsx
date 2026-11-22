import Link from "next/link";
import CompareBar from "@/components/site/CompareBar";
import MobileMenu from "@/components/site/MobileMenu";

function Wordmark({ light = false, withMark = false }: { light?: boolean; withMark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 min-[400px]:gap-2.5">
      {withMark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo-mark.png" alt="" width={36} height={36} className="h-8 w-8 shrink-0 min-[400px]:h-9 min-[400px]:w-9" />
      )}
      <span className="inline-flex items-baseline gap-2">
        <span className={`font-display text-[1.45rem] leading-none tracking-tight min-[400px]:text-[1.65rem] ${light ? "text-white" : "text-ink"}`}>
          SchoolSpot
        </span>
        <span className={`text-[0.8rem] font-medium max-[359px]:hidden min-[400px]:text-sm ${light ? "text-white/60" : "text-brass"}`}>Zimbabwe</span>
      </span>
    </span>
  );
}

const NAV = [
  { href: "/", label: "Home" },
  { href: "/schools", label: "Find a school" },
  { href: "/compare", label: "Compare" },
  { href: "/school-term", label: "School term" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides", label: "Guides" },
  { href: "/for-schools", label: "For schools" },
];

// Public SchoolSpot Zimbabwe pages (the admin dashboard has its own layout).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex min-h-screen flex-col overflow-x-clip bg-paper print:bg-white font-body text-[1.0625rem] text-ink antialiased`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 print:hidden border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 min-[400px]:px-5 sm:px-8">
          <Link href="/" aria-label="SchoolSpot Zimbabwe home" className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf">
            <Wordmark withMark />
          </Link>

          {/* Desktop (full bar from xl, as there are seven items) */}
          <nav aria-label="Main" className="hidden items-center gap-1 text-[0.95rem] font-medium xl:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-ink/80 transition hover:bg-leaf-soft hover:text-ink">
                {item.label}
              </Link>
            ))}
            <Link
              href="/schools"
              className="ml-2 rounded-full bg-leaf px-4 py-2 font-semibold text-white transition hover:bg-leaf-dark"
            >
              Search schools
            </Link>
          </nav>

          {/* Phones and tablets */}
          <MobileMenu items={NAV} />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="bg-leaf-dark text-white print:hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark light withMark />
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/70">
              A guide to schools across Zimbabwe, made with the schools themselves. Fees and places change, so always
              confirm with the school before you apply.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/50">For parents</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li><Link href="/schools" className="text-white/85 hover:text-white">Find a school</Link></li>
              <li><Link href="/compare" className="text-white/85 hover:text-white">Compare schools</Link></li>
              <li><Link href="/how-it-works" className="text-white/85 hover:text-white">How it works</Link></li>
              <li><Link href="/school-term" className="text-white/85 hover:text-white">School term</Link></li>
              <li><Link href="/guides" className="text-white/85 hover:text-white">Guides for parents</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/50">For schools</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li><Link href="/for-schools" className="text-white/85 hover:text-white">List your school free</Link></li>
              <li><Link href="/login" className="text-white/85 hover:text-white">Staff sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>© {new Date().getFullYear()} SchoolSpot Zimbabwe. An independent school directory, not run by any school.</p>
            <nav aria-label="Legal" className="flex gap-5">
              <Link href="/privacy" className="text-white/70 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-white/70 hover:text-white">Terms of Use</Link>
            </nav>
          </div>
        </div>
      </footer>

      <CompareBar />
    </div>
  );
}
