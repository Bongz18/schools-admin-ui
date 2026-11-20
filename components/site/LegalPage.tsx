// Shared layout for SchoolSpot's legal pages (Privacy Policy, Terms of Use): a Caslon title,
// a "last updated" line and a readable column of sections.

export const LEGAL_LAST_UPDATED = "20 November 2026";
export const CONTACT_EMAIL = "schoolspotzw@gmail.com";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <span aria-hidden="true" className="mb-4 block h-px w-10 bg-brass" />
      <h1 className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-[3.2rem]">{title}</h1>
      <p className="mt-3 text-sm text-granite">Last updated {LEGAL_LAST_UPDATED}</p>
      <p className="mt-8 text-lg leading-relaxed text-ink/80">{intro}</p>
      <div className="mt-10 space-y-10">{children}</div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.6rem] leading-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink/80 [&_a]:text-leaf [&_a]:underline [&_a]:decoration-leaf/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-leaf [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
