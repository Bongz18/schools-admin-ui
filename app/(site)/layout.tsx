import Link from "next/link";
import CompareBar from "@/components/site/CompareBar";

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-display text-[1.65rem] leading-none tracking-tight ${light ? "text-white" : "text-ink"}`}>
        SchoolSpot
      </span>
      <span className={`text-sm font-medium ${light ? "text-white/60" : "text-brass"}`}>Zimbabwe</span>
    </span>
  );
}

// Public SchoolSpot Zimbabwe pages (the admin dashboard has its own layout).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-paper font-body text-[1.0625rem] text-ink antialiased`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" aria-label="SchoolSpot Zimbabwe home" className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-1 text-[0.95rem] font-medium sm:gap-2">
            <Link href="/schools" className="rounded-full px-3 py-2 text-ink/80 hover:text-ink">
              Find a school
            </Link>
            <Link href="/compare" className="rounded-full px-3 py-2 text-ink/80 hover:text-ink">
              Compare
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="bg-leaf-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark light />
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
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/50">For schools</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li>
                <a href="mailto:schoolspotzw@gmail.com?subject=List%20our%20school%20on%20SchoolSpot" className="text-white/85 hover:text-white">
                  List your school free
                </a>
              </li>
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
