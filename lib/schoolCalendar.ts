// 2027 national school calendar (Ministry of Primary and Secondary Education, as reported 7 October 2026).
// Used by the 2027 calendar guide and the School term page. Update both dates here if the Ministry changes them.
export type TermRow = { term: string; opens: string; closes: string; days: number; opensOn: string /* ISO date */ };

export const TERMS_2027: TermRow[] = [
  { term: "Term 1", opens: "Tuesday 12 January 2027", closes: "Thursday 25 March 2027", days: 52, opensOn: "2027-01-12" },
  { term: "Term 2", opens: "Tuesday 4 May 2027", closes: "Thursday 5 August 2027", days: 67, opensOn: "2027-05-04" },
  { term: "Term 3", opens: "Tuesday 7 September 2027", closes: "Thursday 2 December 2027", days: 62, opensOn: "2027-09-07" },
];

// The next term to open within `withinDays` days (Zimbabwe time), or null. Used for the home page term line,
// so it appears about two months before each term starts and hides itself once the term has begun.
export function upcomingTerm(withinDays = 60, now = new Date()): TermRow | null {
  const today = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Harare" }));
  today.setHours(0, 0, 0, 0);
  for (const row of TERMS_2027) {
    const opens = new Date(`${row.opensOn}T00:00:00`);
    const days = Math.round((opens.getTime() - today.getTime()) / 86_400_000);
    if (days > 0 && days <= withinDays) return row;
  }
  return null;
}
