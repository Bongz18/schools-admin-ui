import type { ExamResult, School } from "@/lib/schools";
import { BOARDING_LABELS, GENDER_LABELS, TYPE_LABELS, locationLine } from "@/lib/schools";
import CompareToggle from "@/components/site/CompareToggle";
import ExamResultsSection from "@/components/site/ExamResultsSection";
import FeesSection from "@/components/site/FeesSection";
import SchoolCrest from "@/components/site/SchoolCrest";
import SocialLinks from "@/components/site/SocialLinks";
import VerifiedBadge from "@/components/site/VerifiedBadge";
import { sectionClass } from "@/lib/ui";
import SectionTitle from "@/components/site/SectionTitle";


// A highlight written as "Heading: description" is shown as a heading with the description below.
function splitHighlight(item: string) {
  const at = item.indexOf(": ");
  if (at > 0 && at <= 60) {
    const body = item.slice(at + 2).trim();
    return { heading: item.slice(0, at).trim(), body: body.charAt(0).toUpperCase() + body.slice(1) };
  }
  return { heading: null, body: item };
}

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
  // Full address: street, then area and city (e.g. "70 S.V. Muzenda Street, Causeway, Harare").
  if (school.address) {
    const fullAddress = [school.address, school.suburb, school.city].filter(Boolean).join(", ");
    contactRows.push({ label: "Address", value: fullAddress });
  }
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
              <ul className="-mx-4 mt-6 grid gap-x-6 gap-y-2 md:grid-cols-2">
                {school.highlights.map((item) => (
                  <li
                    key={item}
                    className="group relative flex origin-left gap-4 rounded-2xl px-4 py-3.5 leading-relaxed text-white/90 transition duration-300 ease-out before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-5 before:w-5 before:rounded-tl-2xl before:border-l before:border-t before:border-brass before:opacity-0 before:transition-opacity before:duration-300 after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-5 after:w-5 after:rounded-br-2xl after:border-b after:border-r after:border-brass after:opacity-0 after:transition-opacity after:duration-300 hover:scale-[1.03] hover:bg-white/[0.06] hover:text-white hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] hover:before:opacity-100 hover:after:opacity-100 motion-reduce:transform-none"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.4rem] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brass/20 ring-1 ring-brass/40 transition duration-300 group-hover:bg-brass/35 group-hover:ring-brass/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                    </span>
                    {(() => {
                      const { heading, body } = splitHighlight(item);
                      return heading ? (
                        <span className="min-w-0">
                          <span className="block font-display text-[1.2rem] leading-snug text-white">{heading}</span>
                          <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-white/75 group-hover:text-white/85">
                            {body}
                          </span>
                        </span>
                      ) : (
                        <span>{body}</span>
                      );
                    })()}
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
            <SocialLinks links={school.social_links ?? []} />
          </div>
        </aside>
      </div>
    </article>
  );
}
