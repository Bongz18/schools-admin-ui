"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

type NavItem = { href: string; label: string };

// Phone and tablet menu. Closes when an option is chosen, when the page changes,
// on Escape, and when the dimmed area below it is tapped.
export default function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Close whenever the page changes (covers back/forward too).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; the page behind doesn't scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`group flex shrink-0 items-center gap-2.5 rounded-full border bg-white/80 py-2 pl-3 pr-3.5 text-sm font-semibold tracking-wide text-ink shadow-[0_1px_2px_rgba(15,42,34,0.06)] transition duration-300 min-[400px]:pl-3.5 min-[400px]:pr-4 ${
          open ? "border-brass/70 bg-white" : "border-brass/30 hover:border-brass/60"
        }`}
      >
        <span aria-hidden="true" className="relative block h-3 w-4">
          <span className={`absolute left-0 top-0 block h-[1.5px] w-4 rounded-full bg-ink transition duration-300 ${open ? "translate-y-[5.25px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[5.25px] block h-[1.5px] rounded-full bg-brass transition-all duration-300 ${open ? "w-0 opacity-0" : "w-2.5"}`} />
          <span className={`absolute left-0 top-[10.5px] block h-[1.5px] w-4 rounded-full bg-ink transition duration-300 ${open ? "-translate-y-[5.25px] -rotate-45" : ""}`} />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      {/* Dimmed page below the header; tapping it closes the menu */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`absolute inset-x-0 top-full h-[100dvh] bg-ink/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        id={panelId}
        aria-label="Main"
        className={`absolute inset-x-0 top-full origin-top border-b border-brass/30 bg-gradient-to-b from-white to-[#fbf8f1] shadow-[0_30px_60px_-30px_rgba(15,42,34,0.5)] transition duration-300 ease-out ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent opacity-70" />
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-3 min-[400px]:px-5 sm:px-8">
          <ul className="divide-y divide-brass/15">
            {items.map((item, index) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className="group/item flex items-center gap-4 py-3.5"
                  >
                    <span className="w-6 font-display text-sm text-brass/70 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 font-display text-[1.35rem] leading-tight tracking-tight ${current ? "text-leaf" : "text-ink"}`}>
                      {item.label}
                    </span>
                    {current ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">You&apos;re here</span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brass ring-1 ring-brass/40 transition duration-300 group-hover/item:bg-brass group-hover/item:text-white group-active/item:bg-brass group-active/item:text-white"
                      >
                        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/schools"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3.5 font-semibold text-white shadow-[0_12px_24px_-14px_rgba(15,42,34,0.7)] ring-1 ring-brass/40 transition hover:bg-leaf-dark"
          >
            Search schools
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 text-brass-soft">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="mt-4 text-center text-xs tracking-wide text-granite">Free for parents · No sign-up</p>
        </div>
      </nav>
    </div>
  );
}
