// Parent guides shown at /guides. Add new guides here, newest first.
export type GuideSummary = {
  slug: string;
  title: string;
  summary: string;
  updated: string; // ISO date the facts were last checked
  topics?: "school-term"[]; // extra pages the guide is listed on, e.g. the School term page
};

export const GUIDES: GuideSummary[] = [
  {
    slug: "emap-form-1-2027",
    title: "How to apply for Form 1 boarding places on eMAP (2027)",
    summary:
      "Grade 7 results are out. Key dates, how the school choices work, what you need before you start, and what to do if your child isn't placed for Form 1 boarding in 2027.",
    updated: "2026-11-28",
  },
  {
    slug: "boarding-packing-list",
    title: "Boarding school packing list for Zimbabwe",
    summary:
      "A printable checklist for new boarders: trunks and padlocks, bedding, uniform, toiletries, groceries and tuck, plus the items schools usually ban and what to ask before you shop.",
    updated: "2026-11-22",
    topics: ["school-term"],
  },
  {
    slug: "school-calendar-2027",
    title: "2027 school calendar: term dates for Zimbabwe",
    summary:
      "When schools open and close in 2027, the holidays in between, and how many school days each term has. Plus what to check with your school.",
    updated: "2026-11-21",
    topics: ["school-term"],
  },
  {
    slug: "zimsec-2027",
    title: "ZIMSEC from 2027: what it means for your child",
    summary:
      "Every school must register learners for ZIMSEC from 2027, and Cambridge becomes an extra that schools need permission to offer. What we know, what we don't yet, and what to ask your school.",
    updated: "2026-11-20",
  },
];

export function formatGuideDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
