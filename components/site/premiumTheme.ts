// Shared "premium" card styling for Browse by city (home) and Every profile includes (/for-schools).
// Three rich colours, each with a brass ring, a soft glow and a lift on hover/tap.
// Class strings are written out in full so Tailwind can find them.

export type PremiumTheme = {
  card: string; // background gradient
  glow: string; // coloured shadow when the card lifts
  initial: string; // colour of the large faint letter in the corner
};

export const PREMIUM_THEMES: PremiumTheme[] = [
  // Evergreen
  {
    card: "bg-gradient-to-br from-[#1c4434] via-[#163a2b] to-[#0d261b]",
    glow: "hover:shadow-[0_22px_45px_-18px_rgba(28,68,52,0.75)]",
    initial: "text-[#6fa58b]/15",
  },
  // Jacaranda
  {
    card: "bg-gradient-to-br from-[#4f3474] via-[#3f285f] to-[#2a1a42]",
    glow: "hover:shadow-[0_22px_45px_-18px_rgba(79,52,116,0.75)]",
    initial: "text-[#c7a6ec]/15",
  },
  // Terracotta
  {
    card: "bg-gradient-to-br from-[#8a4329] via-[#73361f] to-[#4f2313]",
    glow: "hover:shadow-[0_22px_45px_-18px_rgba(138,67,41,0.75)]",
    initial: "text-[#f0b28f]/15",
  },
];

// The shell every premium card shares: shape, brass ring and the "pop up" motion.
export const PREMIUM_CARD =
  "group relative isolate block h-full overflow-hidden rounded-2xl text-white shadow-[0_10px_30px_-18px_rgba(15,42,34,0.6)] ring-1 ring-inset ring-brass/40 transition duration-300 ease-out motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.99] hover:ring-brass/80";

// Thin brass line along the top edge that brightens on hover.
export const PREMIUM_SHEEN =
  "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#e2c58f] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100";

export function premiumTheme(index: number): PremiumTheme {
  return PREMIUM_THEMES[index % PREMIUM_THEMES.length];
}
