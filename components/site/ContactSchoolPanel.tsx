"use client";

import { trackSchoolEvent, type SchoolEventType } from "@/lib/track";
import {
  PREMIUM_CARD,
  PREMIUM_CORNER_BR,
  PREMIUM_CORNER_TL,
  PREMIUM_FRAME,
  PREMIUM_ROUNDEL,
  PREMIUM_SHEEN,
} from "@/components/site/premiumTheme";

// Small line icons for the three contact cards (gold, inside a roundel).
function ContactIcon({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      {kind === "email" && (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...common} />
          <path d="M4.5 7l7.5 6 7.5-6" {...common} />
        </>
      )}
      {kind === "phone" && (
        <path
          d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11 11 0 005.2 5.2l1.3-1.9 4 1.4v2.6a2 2 0 01-2.2 2A15.8 15.8 0 014.6 6a2 2 0 012-2.2z"
          {...common}
        />
      )}
      {kind === "web" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5s1.1-6.1 3.5-8.5z" {...common} />
        </>
      )}
    </svg>
  );
}

// "Contact the school": buttons that go straight to the school (email, phone, website).
// SchoolSpot never sees or stores what parents send; we only count clicks, anonymously,
// so we can show schools how many parents SchoolSpot sends their way.

/** "+263 242 796176/7" -> "+263242796176" (the first number, digits only). */
export function telHref(phone: string) {
  const first = phone.split(/[\/,;]| or /i)[0];
  const digits = first.replace(/[^\d+]/g, "");
  return digits.length >= 6 ? `tel:${digits}` : null;
}

function mailtoHref(email: string, schoolName: string) {
  const subject = `Enquiry via SchoolSpot Zimbabwe`;
  const body = `Hello,\n\nI found ${schoolName} on SchoolSpot Zimbabwe and would like to ask about:\n\n`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function websiteHref(website: string) {
  return website.startsWith("http") ? website : `https://${website}`;
}

export default function ContactSchoolPanel({
  schoolId,
  schoolName,
  email,
  phone,
  website,
}: {
  schoolId: string;
  schoolName: string;
  email: string | null;
  phone: string | null;
  website: string | null;
}) {
  const tel = phone ? telHref(phone) : null;
  const track = (type: SchoolEventType) => () => trackSchoolEvent(schoolId, type);

  const buttons: { key: string; href: string; label: string; detail: string; type: SchoolEventType; external?: boolean }[] = [];
  if (email) buttons.push({ key: "email", href: mailtoHref(email, schoolName), label: "Email the school", detail: email, type: "contact_email" });
  if (tel && phone) buttons.push({ key: "phone", href: tel, label: "Call the school", detail: phone, type: "contact_phone" });
  if (website)
    buttons.push({
      key: "web",
      href: websiteHref(website),
      label: "Visit the school's website",
      detail: website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      type: "contact_website",
      external: true,
    });

  if (!buttons.length) {
    return <p className="text-granite">We don&apos;t have contact details for this school yet.</p>;
  }

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {buttons.map((button) => (
          <li key={button.key}>
            <a
              href={button.href}
              onClick={track(button.type)}
              {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`${PREMIUM_CARD} px-5 pb-5 pt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass`}
            >
              <span className={PREMIUM_FRAME} aria-hidden="true" />
              <span className={PREMIUM_SHEEN} aria-hidden="true" />
              <span className={PREMIUM_CORNER_TL} aria-hidden="true" />
              <span className={PREMIUM_CORNER_BR} aria-hidden="true" />
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className={`${PREMIUM_ROUNDEL} h-9 w-9 group-hover:scale-110`}>
                  <ContactIcon kind={button.key} />
                </span>
                <span className="font-display text-[1.15rem] leading-snug text-ink">{button.label}</span>
              </span>
              <span aria-hidden="true" className="mt-4 block h-px w-8 bg-brass/50 transition-all duration-300 group-hover:w-14" />
              <span className="mt-3 flex items-end justify-between gap-3">
                <span className="break-all text-sm text-granite">{button.detail}</span>
                <span
                  aria-hidden="true"
                  className={`${PREMIUM_ROUNDEL} mr-2 h-8 w-8 text-sm group-hover:translate-x-0.5 group-hover:bg-brass group-hover:text-white`}
                >
                  {button.external ? "↗" : "→"}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-granite">
        Your message goes straight to {schoolName}. SchoolSpot doesn&apos;t see or keep it. Contacting a school is not an
        application for a place. Please mention SchoolSpot so the school knows where you found it.
      </p>
    </div>
  );
}
