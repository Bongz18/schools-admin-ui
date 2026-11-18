import type { School } from "@/lib/schools";
import { feeSummary } from "@/lib/schools";
import { formatAmount, lowestBaseFee } from "@/lib/fees";
import { sectionClass } from "@/lib/ui";
import SectionTitle from "@/components/site/SectionTitle";

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
    <section aria-labelledby="fees" className={sectionClass}>
      <SectionTitle id="fees" title="Fees per term" lede="What the school charges each term, as supplied by the school." />
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        {summary && (
          <span className="rounded-full bg-leaf px-3.5 py-1 text-sm font-medium text-white">{summary}</span>
        )}
        {currencyPending && (
          <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-granite">
            Currency to be confirmed
          </span>
        )}
      </div>

      {groups.length > 0 && (
        <div className={`mt-6 grid gap-4 ${groups.length > 1 ? "xl:grid-cols-2" : ""}`}>
          {groups.map((group) => {
            const columns = group.columns.length ? group.columns : ["Per term"];
            const width = Math.max(1, columns.length, ...group.rows.map((r) => r.amounts.length));
            return (
              <div key={group.title} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="px-6 pb-4 pt-6">
                  <h3 className="font-display text-[1.4rem] leading-tight text-ink">{group.title}</h3>
                  {group.note && <p className="mt-1.5 text-sm leading-snug text-granite">{group.note}</p>}
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-leaf-soft/80 text-leaf">
                      <th scope="col" className="py-2.5 pl-6 pr-3 text-[0.8rem] font-semibold">
                        Level
                      </th>
                      {Array.from({ length: width }, (_, i) => (
                        <th key={i} scope="col" className="py-2.5 pl-3 pr-3 text-right text-[0.8rem] font-semibold last:pr-6">
                          {columns[i] ?? ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="py-3 pl-6 pr-3 font-normal text-ink/85">
                          {row.label}
                        </th>
                        {Array.from({ length: width }, (_, i) => (
                          <td key={i} className="whitespace-nowrap py-3 pl-3 pr-3 text-right font-semibold tabular-nums text-ink last:pr-6">
                            {formatAmount(row.amounts[i] ?? null, currency)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="h-2" />
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
