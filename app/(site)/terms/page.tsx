import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | SchoolSpot Zimbabwe",
  description: "The terms for using SchoolSpot Zimbabwe, an independent school directory.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms apply to everyone who uses schoolspot.co.zw. By using the site you agree to them. If you don't agree, please don't use the site."
    >
      <LegalSection title="What SchoolSpot is">
        <p>
          SchoolSpot Zimbabwe is an independent directory that helps parents find and compare schools. It is an information
          service only. SchoolSpot is not a school, does not run admissions, and is not the official website of any school
          listed. A school profile does not mean the school endorses SchoolSpot, or that SchoolSpot endorses the school.
        </p>
      </LegalSection>

      <LegalSection title="Information on the site">
        <ul>
          <li>
            School information comes from the schools themselves or, where marked, from public sources. A &quot;Verified
            school&quot; profile has been confirmed by the school on the date shown.
          </li>
          <li>
            Fees, exam results, places, dates and other details can change at any time. We work to keep profiles accurate,
            but we can&apos;t guarantee that everything is complete, correct or up to date.
          </li>
          <li>
            Always confirm details directly with the school before you apply, pay any money or make a decision. Nothing on
            SchoolSpot is professional, financial or legal advice.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Enquiries">
        <ul>
          <li>
            When you send an enquiry, it comes to SchoolSpot first and we pass it on to the school. Please allow time for
            this.
          </li>
          <li>An enquiry is not an application for a place, and it does not reserve a place.</li>
          <li>
            We can&apos;t guarantee that a school will reply, or the outcome of any application. Admissions decisions are made
            by the school alone.
          </li>
          <li>Please only send genuine enquiries, and only with your own contact details.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Our responsibility">
        <p>
          SchoolSpot is provided &quot;as is&quot;. To the fullest extent the law allows, SchoolSpot Zimbabwe is not
          responsible for any loss or damage arising from your use of the site, from information supplied by schools or third
          parties, or from decisions you make based on it. Nothing in these terms limits any responsibility that cannot be
          limited by law.
        </p>
      </LegalSection>

      <LegalSection title="For schools">
        <ul>
          <li>
            When a school sends us information for its profile, the school confirms that it is accurate and that it has the
            right to share it, including any staff names and contact details.
          </li>
          <li>We may edit wording so that profiles are clear and consistent, without changing the meaning.</li>
          <li>
            A school can ask us at any time to correct its profile or remove it. Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
          <li>A basic listing is free. Any paid features will be clearly labelled and agreed separately.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Names, logos and content">
        <p>
          School names, crests, logos and trademarks belong to their owners. The SchoolSpot name, design and the way profiles
          are presented belong to SchoolSpot Zimbabwe. Please don&apos;t copy the site&apos;s content in bulk, or use automated
          tools to collect it, without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="Links to other websites">
        <p>
          We link to schools&apos; own websites and social media pages. We are not responsible for the content or privacy
          practices of those sites.
        </p>
      </LegalSection>

      <LegalSection title="Your personal information">
        <p>
          Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal information, including enquiries.
        </p>
      </LegalSection>

      <LegalSection title="Changes and governing law">
        <p>
          We may update these terms. The date at the top shows when they last changed. These terms are governed by the laws
          of Zimbabwe. Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
