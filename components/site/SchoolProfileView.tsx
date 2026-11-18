import type { ExamResult, School } from "@/lib/schools";
import { BOARDING_LABELS, GENDER_LABELS, TYPE_LABELS, locationLine } from "@/lib/schools";
import CompareToggle from "@/components/site/CompareToggle";
import ExamResultsSection from "@/components/site/ExamResultsSection";
import FeesSection from "@/components/site/FeesSection";
import SchoolCrest from "@/components/site/SchoolCrest";
import VerifiedBadge from "@/components/site/VerifiedBadge";
import { sectionClass } from "@/lib/ui";
import SectionTitle from "@/components/site/SectionTitle";


// The body of a school profile. Used by the public page, the admin preview and the school's private preview link.
export default function SchoolProfileView({
  school,
  results = [],
  children,
}: {
  school: School;
  results?: ExamResult[];
  children?: React.ReactNode;
}) {
  const pupils = school.gender
    ? `${GENDER_LABELS[school.gender] ?? school.gender}${school.gender_note ? ` (${school.gender_note})` : ""}`
    : null;
  const keyFacts: { label: string; value: string | null }[] = [
    { label: "Levels", value: school.levels },
    { label: "Pupils", value: pupils },
    { label: "Day or boarding", value: school.boarding ? BOARDING_LABELS[school.boarding] ?? school.boarding : null },
    { label: "Curriculum", value: school.curriculum && school.curriculum.length ? school.curriculum.join(", ") : null },
  ];
  const about: { label: string; value: string | null }[] = [
    { label: "Type of school", value: school.school_type ? TYPE_LABELS[school.school_type] ?? school.school_type : null },
    { label: "Religious ethos", value: school.religion },
    { label: "Founded", value: school.founded },
    { label: "Location", value: locationLine(school) },
  ];

  const website = school.website ? (school.website.startsWith("http") ? school.website : `https://${school.website}`) : null;
  const websiteLabel = school.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const contactRows: { label: string; value: React.ReactNode }[] = [];
  if (school.address) contactRows.push({ label: "Address", value: school.address });
  if (school.phone) contactRows.push({ label: "Phone", value: school.phone });
  if (school.email)
    contactRows.push({
      label: "Email",
      value: <a href={`mailto:${school.email}`} className="break-all underline decoration-line underline-offset-4 hover:decoration-leaf">{school.email}</a>,
    });
  for (const contact of school.contacts ?? []) {
    contactRows.push({
      label: contact.label,
      value: <a href={`mailto:${contact.email}`} className="break-all underline decoration-line underline-offset-4 hover:decoration-leaf">{contact.email}</a>,
    });
  }
  if (website)
    contactRows.push({
      label: "Website",
      value: (
        <a href={website} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-line underline-offset-4 hover:decoration-leaf">
          {websiteLabel}
        </a>
      ),
    });

  return (
    <article className="pb-24">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <SchoolCrest name={school.name} verified={school.verified} />
            <div className="min-w-0">
              <p className="text-[0.95rem] text-granite">{locationLine(school)}</p>
              <h1 className="mt-1 font-display text-[2.4rem] leading-[1.08] tracking-tight text-ink sm:text-[3.4rem]">
                {school.name}
              </h1>
              <div className="mt-4">
                <VerifiedBadge verified={school.verified} verifiedAt={school.verified_at} />
              </div>
            </div>
          </div>

          {school.description && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">{school.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CompareToggle schoolId={school.id} size="md" />
            {children && (
              <a
                href="#enquire"
                className="rounded-full px-4 py-2 text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf"
              >
                Ask the school a question
              </a>
            )}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 lg:grid-cols-4 lg:divide-x lg:divide-line [&>div]:lg:pl-6 [&>div:first-child]:lg:pl-0">
            {keyFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.8rem] font-semibold text-leaf">{fact.label}</dt>
                <dd className={`mt-1.5 leading-snug ${fact.value ? "font-display text-[1.2rem] text-ink" : "text-granite/70"}`}>
                  {fact.value ?? "Not listed yet"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0">
          <FeesSection school={school} />

          {school.highlights && school.highlights.length > 0 && (
            <section aria-labelledby="highlights" className={`${sectionClass} rounded-2xl bg-leaf-dark p-7 sm:p-10`}>
              <SectionTitle id="highlights" title="Highlights" lede="What sets the school apart, in its own words." light rule={false} />
              <ul className="mt-7 grid gap-x-10 gap-y-5 md:grid-cols-2">
                {school.highlights.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-white/90">
                    <span aria-hidden="true" className="mt-[0.7rem] h-px w-5 shrink-0 bg-brass" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ExamResultsSection results={results} />

          <section aria-labelledby="about" className={sectionClass}>
            <SectionTitle id="about" title="About the school" />
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {about.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[9.5rem_1fr] gap-4 py-3">
                  <dt className="text-[0.9rem] font-semibold text-leaf">{fact.label}</dt>
                  <dd className={fact.value ? "text-ink" : "text-granite/70"}>{fact.value ?? "Not listed yet"}</dd>
                </div>
              ))}
            </dl>
          </section>

          {children}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6">
            <span aria-hidden="true" className="block h-px w-8 bg-brass" />
            <h2 className="mt-3 font-display text-[1.5rem] leading-tight text-ink">Contact the school</h2>
            {contactRows.length ? (
              <dl className="mt-5 space-y-4 text-[0.95rem]">
                {contactRows.map((row, index) => (
                  <div key={index}>
                    <dt className="text-[0.8rem] font-semibold text-leaf">{row.label}</dt>
                    <dd className="mt-0.5 text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-[0.95rem] text-granite">Use the enquiry form and we&apos;ll put you in touch.</p>
            )}
            {(school.social_links ?? []).length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[0.8rem] font-semibold text-leaf">Follow the school</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {(school.social_links ?? []).map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-leaf/25 px-3.5 py-1.5 text-sm font-medium text-leaf hover:border-leaf hover:bg-leaf-soft"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
