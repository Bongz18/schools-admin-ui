// Shared "premium" card styling for Browse by city (home) and Every profile includes (/for-schools).
// Light cards with soft corners, a fine gold double border, gold corner marks and a gentle lift on hover.
// Class strings are written out in full so Tailwind can find them.

// The card itself: porcelain background, hairline gold border, soft shadow, lift on hover/tap.
export const PREMIUM_CARD =
  "group relative isolate block h-full overflow-hidden rounded-[1.25rem] border border-brass/35 bg-gradient-to-b from-white to-[#fbf8f1] text-ink shadow-[0_1px_2px_rgba(15,42,34,0.04),0_12px_28px_-20px_rgba(15,42,34,0.35)] transition duration-300 ease-out hover:border-brass/70 hover:shadow-[0_2px_4px_rgba(15,42,34,0.04),0_26px_44px_-22px_rgba(120,90,40,0.45)] motion-safe:hover:-translate-y-1.5 motion-safe:active:scale-[0.99]";

// A second, finer gold frame just inside the edge (the "double rule" of fine stationery).
export const PREMIUM_FRAME =
  "pointer-events-none absolute inset-[6px] rounded-[0.95rem] border border-brass/15 transition-colors duration-300 group-hover:border-brass/35";

// Gold light along the top edge that brightens on hover.
export const PREMIUM_SHEEN =
  "pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100";

// Small gold L-shaped marks in the top-left and bottom-right corners.
export const PREMIUM_CORNER_TL =
  "pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 rounded-tl-[5px] border-l border-t border-brass/60 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-brass";
export const PREMIUM_CORNER_BR =
  "pointer-events-none absolute bottom-3 right-3 h-3.5 w-3.5 rounded-br-[5px] border-b border-r border-brass/60 transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-brass";

// Large faint gold letter or number in the corner.
export const PREMIUM_WATERMARK =
  "pointer-events-none absolute -z-10 font-display leading-none text-brass/[0.09] transition-transform duration-500 group-hover:-translate-y-2";

// Gold roundel for icons and the arrow.
export const PREMIUM_ROUNDEL =
  "flex shrink-0 items-center justify-center rounded-full bg-brass-soft text-brass ring-1 ring-brass/45 transition duration-300";
