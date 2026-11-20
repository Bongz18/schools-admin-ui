"use client";

import { trackSchoolEvent, type SchoolEventType } from "@/lib/track";

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
      <ul className="grid gap-3 sm:grid-cols-3">
        {buttons.map((button, index) => (
          <li key={button.key}>
            <a
              href={button.href}
              onClick={track(button.type)}
              {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group flex h-full flex-col rounded-2xl border px-5 py-4 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf ${
                index === 0
                  ? "border-leaf bg-leaf text-white hover:bg-leaf-dark"
                  : "border-line bg-white text-ink hover:border-leaf/40 hover:shadow-[0_14px_30px_-20px_rgba(15,42,34,0.35)]"
              }`}
            >
              <span className="flex items-center justify-between gap-2 font-semibold">
                {button.label}
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                  {button.external ? "↗" : "→"}
                </span>
              </span>
              <span className={`mt-1 break-all text-sm ${index === 0 ? "text-white/75" : "text-granite"}`}>{button.detail}</span>
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
