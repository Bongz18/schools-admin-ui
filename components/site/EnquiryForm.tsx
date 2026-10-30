"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function EnquiryForm({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    if (!payload.email && !payload.phone) {
      setStatus("error");
      setError("Add an email address or a phone number so the school can reply.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, schoolId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "Your enquiry wasn't sent. Try again.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Your enquiry wasn't sent. Try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-leaf bg-leaf-soft p-6" role="status">
        <h3 className="font-display text-xl font-semibold text-ink">Enquiry sent</h3>
        <p className="mt-2 text-ink">
          SchoolSpot will pass your question to {schoolName}. Expect a reply by email or phone.
        </p>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/30";
  const label = "block text-sm font-semibold text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Hidden from people; bots tend to fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="parentName" className={label}>Your name</label>
        <input id="parentName" name="parentName" required maxLength={120} autoComplete="name" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" maxLength={160} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone or WhatsApp</label>
          <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="childGrade" className={label}>Grade or form you&apos;re applying for</label>
          <input id="childGrade" name="childGrade" maxLength={60} placeholder="e.g. Form 1" className={field} />
        </div>
        <div>
          <label htmlFor="intake" className={label}>When would they start?</label>
          <input id="intake" name="intake" maxLength={60} placeholder="e.g. January 2027" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>Your question</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Ask about fees, places, boarding, open days…"
          className={field}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-msasa-soft px-3 py-2 text-sm text-msasa" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-msasa px-6 py-3 font-semibold text-white hover:bg-[#721c29] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-msasa sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-xs text-granite">
        We only use your details to pass your enquiry to this school.
      </p>
    </form>
  );
}
