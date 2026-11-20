import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | SchoolSpot Zimbabwe",
  description: "How SchoolSpot Zimbabwe collects, uses, stores and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="SchoolSpot Zimbabwe helps parents find and compare schools. This policy explains what personal information we collect, why, who we share it with, how long we keep it and the rights you have. We aim to follow Zimbabwe's Cyber and Data Protection Act [Chapter 12:07]."
    >
      <LegalSection title="Who we are">
        <p>
          SchoolSpot Zimbabwe (schoolspot.co.zw) is an independent school directory. We are not part of, or run by, any of
          the schools listed. For any question about this policy or your information, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul>
          <li>
            <strong>Enquiries you send through a school&apos;s page:</strong> your name, email address and/or phone number,
            the grade or form you are asking about, when your child would start, and your question.
          </li>
          <li>
            <strong>Information from schools:</strong> the details schools give us for their profiles, which can include the
            names, job titles and work contact details of staff, and our correspondence with them.
          </li>
          <li>
            <strong>Staff accounts:</strong> the email address of people who sign in to manage SchoolSpot.
          </li>
          <li>
            <strong>Anonymous usage counts:</strong> when a school&apos;s page is viewed or added to a comparison, we record
            which school and when. These counts contain no names, contact details or advertising cookies.
          </li>
          <li>
            <strong>Your comparison list</strong> is saved only in your own browser, on your device. We cannot see it.
          </li>
          <li>
            Like most websites, our hosting provider keeps short-lived technical logs (such as IP addresses) to run the site
            securely.
          </li>
        </ul>
        <p>
          Please don&apos;t include sensitive information, such as health details, in an enquiry. A school can collect what it
          needs directly once you are in touch.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it">
        <ul>
          <li>To pass your enquiry to the school you asked about, so that the school can reply to you.</li>
          <li>To contact you about your enquiry, if needed.</li>
          <li>To build and keep school profiles accurate, working with the schools themselves.</li>
          <li>To understand, in total, which schools parents are interested in, and to improve the site.</li>
          <li>To keep the site secure and to meet our legal obligations.</li>
        </ul>
        <p>
          We use your enquiry details because you agree to it when you tick the consent box before sending. We never sell
          personal information, and we don&apos;t use it for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <ul>
          <li>
            <strong>The school you asked about.</strong> We send your enquiry to that school only. Once the school has it,
            the school&apos;s own privacy practices apply to its copy.
          </li>
          <li>
            <strong>Service providers who run the site for us,</strong> only as needed to provide their service: Supabase
            (our database, stored in Ireland in the European Union), Vercel (website hosting) and Resend (email
            notifications).
          </li>
          <li>Authorities, if the law requires us to.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Storage outside Zimbabwe">
        <p>
          Our service providers store and process information outside Zimbabwe. Our database is in the European Union, where
          data protection law gives a high level of protection. We choose providers that keep information secure and only use
          it to provide their service to us.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <ul>
          <li>Enquiries are deleted automatically 12 months after they are sent.</li>
          <li>School profile information is kept while the school is listed, and removed when a school asks to be taken off.</li>
          <li>Anonymous usage counts contain no personal information.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we protect it">
        <p>
          Enquiries can only be read by SchoolSpot staff, in our signed-in admin area and in the alert emails sent to our team inbox. Information is sent over encrypted
          connections, and access to our database is restricted. If a breach ever affected your information, we would tell
          you and the Data Protection Authority as the law requires.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>You can ask us at any time to:</p>
        <ul>
          <li>tell you what personal information we hold about you and give you a copy;</li>
          <li>correct information that is wrong;</li>
          <li>delete your information, or stop using it;</li>
          <li>withdraw your consent. This won&apos;t affect anything we did before you withdrew it.</li>
        </ul>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will reply as soon as we can. If you are
          unhappy with how we have handled your information, you can complain to the Data Protection Authority, the Postal
          and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ).
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          SchoolSpot is for parents and guardians. Enquiries should be sent by a parent, guardian or other adult, not by
          children.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy. The date at the top shows when it last changed. Please also read our{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
