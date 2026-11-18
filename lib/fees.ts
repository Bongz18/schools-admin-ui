// Fee tables on school profiles.
//
// A school's fees are stored as groups, e.g. "Day fees and levies" with one amount per row,
// or "Veritas Boarding" with two columns (full / weekly). Admins edit them as plain text:
//
//   ## Day fees and levies
//   ECD to Grade 7 | 2400
//   Forms 1–2 | 3315
//
//   ## Veritas Boarding | Full boarding | Weekly boarding
//   > On top of day fees. Room for 90 boarders.
//   Forms 1–6 | 2400 | 2100
//
// "## Title | Column | Column" starts a group (columns optional), "> text" adds a note,
// "Label | amount | amount" adds a row. Amounts are per term.

export type FeeRow = { label: string; amounts: (number | null)[] };
export type FeeGroup = { title: string; columns: string[]; note: string | null; rows: FeeRow[] };

export const FEE_CURRENCIES: Record<string, string> = { USD: "US$", ZiG: "ZiG " };

export function formatAmount(amount: number | null, currency: string | null) {
  if (amount == null) return "–";
  const prefix = currency ? FEE_CURRENCIES[currency] ?? "" : "";
  return `${prefix}${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** The lowest amount in the first group (the base fee; later groups are usually add-ons like boarding). */
export function lowestBaseFee(groups: FeeGroup[]) {
  const amounts = (groups[0]?.rows ?? []).flatMap((row) => row.amounts).filter((n): n is number => n != null);
  return amounts.length ? Math.min(...amounts) : null;
}

function toAmount(raw: string) {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function parseFeeGroups(text: string): FeeGroup[] {
  const groups: FeeGroup[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("##")) {
      const [title, ...columns] = line.replace(/^#+/, "").split("|").map((part) => part.trim());
      groups.push({ title, columns: columns.filter(Boolean), note: null, rows: [] });
      continue;
    }
    if (!groups.length) groups.push({ title: "Fees", columns: [], note: null, rows: [] });
    const group = groups[groups.length - 1];
    if (line.startsWith(">")) {
      const note = line.replace(/^>\s*/, "");
      group.note = group.note ? `${group.note} ${note}` : note;
      continue;
    }
    const [label, ...amounts] = line.split("|").map((part) => part.trim());
    group.rows.push({ label, amounts: amounts.map(toAmount) });
  }
  return groups;
}

export function formatFeeGroups(groups: FeeGroup[]) {
  return groups
    .map((group) =>
      [
        `## ${[group.title, ...group.columns].join(" | ")}`,
        ...(group.note ? [`> ${group.note}`] : []),
        ...group.rows.map((row) => [row.label, ...row.amounts.map((a) => (a == null ? "" : String(a)))].join(" | ")),
      ].join("\n"),
    )
    .join("\n\n");
}

/** Server-side check of fee groups sent by the admin form. Returns null if invalid. */
export function cleanFeeGroups(value: unknown): FeeGroup[] | null {
  if (!Array.isArray(value) || value.length > 8) return null;
  const groups: FeeGroup[] = [];
  for (const g of value) {
    if (!g || typeof g.title !== "string" || !Array.isArray(g.rows) || g.rows.length > 20) return null;
    const columns = Array.isArray(g.columns) ? g.columns.filter((c: unknown) => typeof c === "string").slice(0, 4) : [];
    const rows: FeeRow[] = [];
    for (const r of g.rows) {
      if (!r || typeof r.label !== "string" || !Array.isArray(r.amounts) || r.amounts.length > 4) return null;
      const amounts = r.amounts.map((a: unknown) => (typeof a === "number" && Number.isFinite(a) && a >= 0 && a < 1_000_000 ? a : null));
      rows.push({ label: r.label.trim().slice(0, 80), amounts });
    }
    groups.push({
      title: g.title.trim().slice(0, 100) || "Fees",
      columns: columns.map((c: string) => c.trim().slice(0, 40)),
      note: typeof g.note === "string" && g.note.trim() ? g.note.trim().slice(0, 300) : null,
      rows,
    });
  }
  return groups;
}
