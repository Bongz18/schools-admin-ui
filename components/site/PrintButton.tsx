"use client";

// A small button that opens the browser's print dialog, so parents can print a checklist or save it as a PDF.
export default function PrintButton({ label = "Print this list" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-brass/60 px-5 py-2 text-sm font-semibold text-ink hover:bg-brass/10 print:hidden"
    >
      {label}
    </button>
  );
}
