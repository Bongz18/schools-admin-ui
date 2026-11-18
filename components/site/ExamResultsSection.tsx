import { type ExamResult, formatPercent, groupExamResults } from "@/lib/schools";
import { sectionClass } from "@/lib/ui";
import SectionTitle from "@/components/site/SectionTitle";

// Exam results table on a school profile: one row per exam, one column per year (newest first).
export default function ExamResultsSection({ results }: { results: ExamResult[] }) {
  if (!results.length) return null;
  const { years, rows } = groupExamResults(results);
  const source = results.find((r) => r.source)?.source;

  return (
    <section aria-labelledby="results" className={sectionClass}>
      <SectionTitle
        id="results"
        title="Exam results"
        lede="Pass rates by year. Where the school reports top grades, the share of pupils who reached them is shown underneath."
      />

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[34rem] text-left text-[0.95rem]">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="px-4 py-3 text-sm font-medium text-granite">
                Exam
              </th>
              {years.map((year) => (
                <th key={year} scope="col" className="px-4 py-3 text-right text-sm font-medium text-granite">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="px-4 py-3 align-top font-normal">
                  <span className="block font-semibold text-ink">{row.label}</span>
                  <span className="block text-sm text-granite">
                    Pass rate{row.topGradeLabel ? `, then % with ${row.topGradeLabel}` : ""}
                  </span>
                </th>
                {years.map((year) => {
                  const result = row.byYear.get(year);
                  const pass = formatPercent(result?.pass_rate ?? null);
                  const top = formatPercent(result?.top_grade_rate ?? null);
                  return (
                    <td key={year} className="px-4 py-3 text-right align-top tabular-nums">
                      <span className={pass ? "block font-semibold text-ink" : "block text-granite/70"}>
                        {pass ?? "–"}
                      </span>
                      {top && <span className="block text-sm text-granite">{top}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-granite">
        {source ? `${source}. ` : ""}
        Schools may work out pass rates in different ways, so ask the school how a figure was calculated if it matters to
        your decision.
      </p>
    </section>
  );
}
