import type { School } from "@/lib/schools";
import { BOARDING_LABELS, GENDER_LABELS, TYPE_LABELS, feeSummary, locationLine } from "@/lib/schools";
import CompareToggle from "@/components/site/CompareToggle";

// The body of a school profile. Used by the public page and by the admin draft preview.
export default function SchoolProfileView({ school, children }: { school: School; children?: React.ReactNode }) {
  const facts: { label: string; value: string | null }[] = [
    { label: "Levels", value: school.levels },
    {
      label: "Pupils",
      value: school.gender
        ? `${GENDER_LABELS[school.gender] ?? school.gender}${school.gender_note ? ` (${school.gender_note})` : ""}`
        : null,
    },
    { label: "Day or boarding", value: school.boarding ? BOARDING_LABELS[school.boarding] ?? school.boarding : null },
    { label: "Curriculum", value: school.curriculum && school.curriculum.length ? school.curriculum.join(", ") : null },
    { label: "Type of school", value: school.school_type ? TYPE_LABELS[school.school_type] ?? school.school_type : null },
    { label: "Religious ethos", value: school.religion },
    { label: "Founded", value: school.founded },
    { label: "Location", value: locationLine(school) },
  ];

  const website = school.website
    ? school.website.startsWith("http")
      ? school.website
      : `https://${school.website}`
    : null;

  return (
    <article className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:pt-14">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-granite">{locationLine(school)}</p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {school.name}
          </h1>
          {school.description && <p className="mt-4 text-lg leading-relaxed text-ink/85">{school.description}</p>}
        </div>
        <CompareToggle schoolId={school.id} size="md" />
      </header>

      <section aria-labelledby="fees" className="mt-10 rounded-2xl bg-leaf-dark p-6 text-white sm:p-8">
        <h2 id="fees" className="font-display text-lg font-semibold text-white/80">
          Fees
        </h2>
        <p className="mt-1 font-display text-3xl font-bold sm:text-4xl">{feeSummary(school)}</p>
        {school.fees_text && <p className="mt-3 max-w-2xl text-white/85">{school.fees_text}</p>}
        <p className="mt-4 text-sm text-white/70">
          {school.fees_source ? `Source: ${school.fees_source}. ` : ""}
          Fees change often, so confirm the current amount with the school before you apply.
        </p>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <section aria-labelledby="facts">
          <h2 id="facts" className="font-display text-2xl font-semibold text-ink">
            At a glance
          </h2>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
                <dt className="text-granite">{fact.label}</dt>
                <dd className={fact.value ? "text-ink" : "text-granite/70 italic"}>{fact.value ?? "Not listed yet"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Contact the school</h2>
            <ul className="mt-3 space-y-2 text-ink">
              {website && (
                <li>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="text-leaf underline hover:text-leaf-dark">
                    Visit the school&apos;s website
                  </a>
                </li>
              )}
              {school.phone && <li>Phone: {school.phone}</li>}
              {school.email && <li>Email: {school.email}</li>}
              {!website && !school.phone && !school.email && (
                <li className="text-granite">Use the enquiry form and we&apos;ll put you in touch.</li>
              )}
            </ul>
          </div>
          <p
            className={`rounded-2xl p-5 text-sm ${
              school.verified ? "bg-leaf-soft text-leaf-dark" : "bg-msasa-soft text-msasa"
            }`}
          >
            {school.verified
              ? "SchoolSpot has checked these details with the school."
              : "These details come from public sources and haven't been confirmed by the school yet."}
          </p>
        </aside>
      </div>

      {children}
    </article>
  );
}
