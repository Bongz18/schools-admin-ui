import type { School } from "@/lib/schools";
import { feeSummary } from "@/lib/schools";
import { formatAmount, lowestBaseFee } from "@/lib/fees";

// Fees card on a school profile: a headline figure, then one small table per fee group
// (e.g. day fees, boarding), then where the figures came from.
export default function FeesSection({ school }: { school: School }) {
  const groups = school.fee_groups ?? [];
  const currency = school.fee_currency;
  const base = lowestBaseFee(groups);

  let headline: string;
  if (base != null) headline = `From ${formatAmount(base, currency)} a term`;
  else if (school.fee_term_min_usd != null) headline = feeSummary(school);
  else if (school.fees_text) headline = "Fees per term";
  else headline = "Fees not listed yet";

  const currencyPending = groups.length > 0 && !currency;

  return (
    <section aria-labelledby="fees" className="mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 bg-leaf-dark px-6 py-6 text-white sm:px-8">
        <div>
          <h2 id="fees" className="text-sm font-semibold uppercase tracking-wider text-white/70">
            Fees per term
          </h2>
          <p className="mt-1 font-display text-3xl font-bold sm:text-4xl">{headline}</p>
        </div>
        {currencyPending && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">Currency to be confirmed</span>
        )}
      </div>

      {groups.length > 0 && (
        <div className="divide-y divide-line">
          {groups.map((group) => {
            const showHeader = group.columns.length > 1;
            const width = Math.max(1, group.columns.length, ...group.rows.map((r) => r.amounts.length));
            return (
              <div key={group.title} className="px-6 py-6 sm:px-8">
                <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
                {group.note && <p className="mt-1 text-sm text-granite">{group.note}</p>}
                <table className="mt-4 w-full text-left">
                  {showHeader && (
                    <thead>
                      <tr className="border-b border-line">
                        <th scope="col" className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-granite">
                          Level
                        </th>
                        {group.columns.map((column) => (
                          <th
                            key={column}
                            scope="col"
                            className="pb-2 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-granite"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-line">
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="py-3 pr-4 font-normal text-ink">
                          {row.label}
                        </th>
                        {Array.from({ length: width }, (_, i) => (
                          <td key={i} className="whitespace-nowrap py-3 pl-4 text-right font-semibold tabular-nums text-ink">
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
        <p className={`px-6 py-5 text-ink/85 sm:px-8 ${groups.length ? "border-t border-line" : ""}`}>{school.fees_text}</p>
      )}

      <p className="border-t border-line bg-paper px-6 py-4 text-sm text-granite sm:px-8">
        {school.fees_source ? `Source: ${school.fees_source}. ` : ""}
        Fees change often, so confirm the current amount with the school before you apply.
      </p>
    </section>
  );
}
