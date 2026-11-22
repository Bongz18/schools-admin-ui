// 2027 national school calendar (Ministry of Primary and Secondary Education, as reported 7 October 2026).
// Used by the 2027 calendar guide and the School term page. Update both dates here if the Ministry changes them.
export type TermRow = { term: string; opens: string; closes: string; days: number };

export const TERMS_2027: TermRow[] = [
  { term: "Term 1", opens: "Tuesday 12 January 2027", closes: "Thursday 25 March 2027", days: 52 },
  { term: "Term 2", opens: "Tuesday 4 May 2027", closes: "Thursday 5 August 2027", days: 67 },
  { term: "Term 3", opens: "Tuesday 7 September 2027", closes: "Thursday 2 December 2027", days: 62 },
];
