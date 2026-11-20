import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | SchoolSpot Zimbabwe",
  description: "How SchoolSpot Zimbabwe handles personal information. Parents contact schools directly, and we don't collect their details.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="SchoolSpot Zimbabwe helps parents find and compare schools. We are designed to collect as little personal information as possible: you can use the whole site without telling us who you are, and when you contact a school, you contact it directly, not through us. This policy explains the small amount of information we do handle. We aim to follow Zimbabwe's Cyber and Data Protection Act [Chapter 12:07]."
    >
      <LegalSection title="Who we are">
        <p>
          SchoolSpot Zimbabwe (schoolspot.co.zw) is an independent school directory. We are not part of, or run by, any of
          the schools listed. For any question about this policy, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Parents and visitors">
        <ul>
          <li>
            <strong>You don&apos;t need an account,</strong> and we don&apos;t ask for your name, email or phone number.
          </li>
          <li>
            <strong>Contacting a school:</strong> the &quot;Email&quot;, &quot;Call&quot; and &quot;Website&quot; buttons on a
            school&apos;s page take you straight to that school, using your own email, phone or browser. Your message goes from
            you to the school. SchoolSpot doesn&apos;t see, receive or keep it, and the school&apos;s own privacy practices apply.
          </li>
          <li>
            <strong>Anonymous usage counts:</strong> when a school&apos;s page is viewed, added to a comparison, or one of its
            contact buttons is clicked, we record which school, what happened and when. These counts contain no names, contact
            details or advertising cookies, and they can&apos;t be linked back to you. We use them to see which schools parents
            are interested in and to show schools, in total, how many parents SchoolSpot sends their way.
          </li>
          <li>
            <strong>Your comparison list</strong> is saved only in your own browser, on your device. We cannot see it.
          </li>
          <li>
            Like most websites, our hosting provider keeps short-lived technical logs (such as IP addresses) to run the site
            securely.
          </li>
          <li>If you email us, we use your email only to reply to you, and we don&apos;t share it.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Schools">
        <p>
          We publish the details schools give us for their profiles. We list general school contact addresses (such as
          admissions or bursar addresses) rather than the names of individual staff. We keep our correspondence with schools
          so that profiles stay accurate, and we remove a school&apos;s profile when it asks us to.
        </p>
      </LegalSection>

      <LegalSection title="Staff accounts">
        <p>We keep the email addresses of the people who sign in to manage SchoolSpot.</p>
      </LegalSection>

      <LegalSection title="Who we share information with">
        <p>
          We never sell personal information or use it for advertising. Service providers run the site for us and only handle
          information as needed to provide their service: Supabase (our database, stored in Ireland in the European Union) and
          Vercel (website hosting). We may also share information with authorities if the law requires it.
        </p>
      </LegalSection>

      <LegalSection title="Storage outside Zimbabwe">
        <p>
          Our service providers store and process information outside Zimbabwe. Our database is in the European Union, where
          data protection law gives a high level of protection. Because parents contact schools directly, we don&apos;t store
          parents&apos; personal details there.
        </p>
      </LegalSection>

      <LegalSection title="How we protect it">
        <p>
          Information is sent over encrypted connections, and only signed-in SchoolSpot staff can change the database. If a
          breach ever affected personal information we hold, we would tell the people affected and the Data Protection
          Authority as the law requires.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can ask us at any time what personal information we hold about you, and ask us to correct or delete it. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If you are unhappy with how we have handled your
          information, you can complain to the Data Protection Authority, the Postal and Telecommunications Regulatory
          Authority of Zimbabwe (POTRAZ).
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy, for example if we add new features. The date at the top shows when it last changed.
          Please also read our <Link href="/terms">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
