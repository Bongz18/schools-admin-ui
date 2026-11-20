// Parent guides shown at /guides. Add new guides here, newest first.
export type GuideSummary = {
  slug: string;
  title: string;
  summary: string;
  updated: string; // ISO date the facts were last checked
};

export const GUIDES: GuideSummary[] = [
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
