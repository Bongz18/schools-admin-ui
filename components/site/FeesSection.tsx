import type { School } from "@/lib/schools";
import { feeSummary } from "@/lib/schools";
import { formatAmount, lowestBaseFee } from "@/lib/fees";

// Fees on a school profile. Styled like the other sections ("At a glance", "Exam results"):
// a section heading with a small "From ... a term" tag, then one compact table per fee group
// (side by side on wide screens), then where the figures came from.
export default function FeesSection({ school }: { school: School }) {
  const groups = school.fee_groups ?? [];
  const currency = school.fee_currency;
  const base = lowestBaseFee(groups);

  let summary: string | null = null;
  if (base != null) summary = `From ${formatAmount(base, currency)} a term`;
  else if (school.fee_term_min_usd != null) summary = feeSummary(school);

  const currencyPending = groups.length > 0 && !currency;

  return (
    <section aria-labelledby="fees" className="mt-12">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id="fees" className="font-display text-2xl font-semibold text-ink">
          Fees per term
        </h2>
        {summary && (
          <span className="rounded-full bg-leaf-soft px-3 py-1 text-sm font-semibold text-leaf-dark">{summary}</span>
        )}
        {currencyPending && (
          <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-granite">
            Currency to be confirmed
          </span>
        )}
      </div>

      {groups.length > 0 && (
        <div className={`mt-4 grid gap-4 ${groups.length > 1 ? "md:grid-cols-2" : ""}`}>
          {groups.map((group) => {
            const showHeader = group.columns.length > 1;
            const width = Math.max(1, group.columns.length, ...group.rows.map((r) => r.amounts.length));
            return (
              <div key={group.title} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-base font-semibold text-ink">{group.title}</h3>
                {group.note && <p className="mt-1 text-sm leading-snug text-granite">{group.note}</p>}
                <table className="mt-3 w-full text-left text-sm">
                  {showHeader && (
                    <thead>
                      <tr className="border-b border-line">
                        <th scope="col" className="pb-2 pr-3 text-xs font-medium text-granite">
                          <span className="sr-only">Level</span>
                        </th>
                        {group.columns.map((column) => (
                          <th key={column} scope="col" className="pb-2 pl-3 text-right text-xs font-medium text-granite">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-line">
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="py-2 pr-3 font-normal text-ink/85">
                          {row.label}
                        </th>
                        {Array.from({ length: width }, (_, i) => (
                          <td key={i} className="whitespace-nowrap py-2 pl-3 text-right font-semibold tabular-nums text-ink">
                            {formatAmount(row.amounts[i] ?? null, currency)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {school.fees_text && (
        <p className={`max-w-3xl text-ink/85 ${groups.length ? "mt-4 text-sm" : "mt-3"}`}>{school.fees_text}</p>
      )}
      {!groups.length && !school.fees_text && !summary && <p className="mt-3 text-granite">Fees not listed yet.</p>}

      <p className="mt-3 text-xs text-granite">
        {school.fees_source ? `Source: ${school.fees_source}. ` : ""}
        Fees change often, so confirm the current amount with the school before you apply.
      </p>
    </section>
  );
}
