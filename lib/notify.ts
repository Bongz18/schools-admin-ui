// SERVER ONLY. Emails the SchoolSpot team when a parent sends an enquiry.
// Uses Resend (resend.com). Does nothing until RESEND_API_KEY and ENQUIRY_ALERT_EMAIL are set,
// and never blocks or fails the enquiry itself.

type EnquiryAlert = {
  schoolName: string;
  parentName: string;
  email: string | null;
  phone: string | null;
  childGrade: string | null;
  intake: string | null;
  message: string | null;
};

export async function sendEnquiryAlert(enquiry: EnquiryAlert) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_ALERT_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.ALERT_FROM_EMAIL || "SchoolSpot Zimbabwe <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://schools-admin-ui.vercel.app";

  const lines = [
    `New enquiry via SchoolSpot Zimbabwe`,
    ``,
    `School: ${enquiry.schoolName}`,
    `Parent: ${enquiry.parentName}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    enquiry.phone ? `Phone / WhatsApp: ${enquiry.phone}` : null,
    enquiry.childGrade ? `Applying for: ${enquiry.childGrade}` : null,
    enquiry.intake ? `Starting: ${enquiry.intake}` : null,
    ``,
    enquiry.message ? `Message:\n${enquiry.message}` : `No message added.`,
    ``,
    `All enquiries: ${siteUrl}/admin/enquiries`,
  ].filter((line): line is string => line !== null);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()).filter(Boolean),
        subject: `New enquiry: ${enquiry.schoolName} (${enquiry.parentName})`,
        text: lines.join("\n"),
        ...(enquiry.email ? { reply_to: enquiry.email } : {}),
      }),
      signal: controller.signal,
    });
    if (!response.ok) console.error("Enquiry alert failed:", response.status, (await response.text()).slice(0, 200));
  } catch (error) {
    console.error("Enquiry alert failed:", error instanceof Error ? error.message : error);
  } finally {
    clearTimeout(timer);
  }
}
