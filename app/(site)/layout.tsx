import Link from "next/link";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import CompareBar from "@/components/site/CompareBar";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

// Public SchoolSpot Zimbabwe pages (the admin dashboard has its own layout).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${atkinson.variable} flex min-h-screen flex-col bg-paper font-body text-ink`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink">
            School<span className="text-leaf">Spot</span>
            <span className="ml-1.5 text-sm font-medium text-granite">Zimbabwe</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-3">
            <Link href="/schools" className="rounded-full px-3 py-2 text-ink hover:bg-leaf-soft">
              Find a school
            </Link>
            <Link href="/compare" className="rounded-full px-3 py-2 text-ink hover:bg-leaf-soft">
              Compare
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-granite sm:flex-row sm:justify-between">
          <p className="max-w-md">
            SchoolSpot Zimbabwe helps parents find and compare schools. School details come from public sources and the
            schools themselves. Always confirm fees and places with the school.
          </p>
          <div className="flex gap-4">
            <Link href="/schools" className="hover:text-ink">All schools</Link>
            <Link href="/login" className="hover:text-ink">Staff sign in</Link>
          </div>
        </div>
      </footer>

      <CompareBar />
    </div>
  );
}
