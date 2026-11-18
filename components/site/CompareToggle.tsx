"use client";

import { toast } from "react-hot-toast";
import { COMPARE_LIMIT, useCompareList } from "@/lib/compare";
import { trackSchoolEvent } from "@/lib/track";

export default function CompareToggle({ schoolId, size = "sm" }: { schoolId: string; size?: "sm" | "md" }) {
  const { ids, add, remove } = useCompareList();
  const selected = ids.includes(schoolId);

  const handleClick = () => {
    if (selected) {
      remove(schoolId);
      return;
    }
    if (!add(schoolId)) {
      toast.error(`You can compare up to ${COMPARE_LIMIT} schools. Remove one first.`);
      return;
    }
    trackSchoolEvent(schoolId, "compare_add");
  };

  const base = size === "md" ? "px-5 py-2.5 text-[0.95rem]" : "px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      className={`${base} inline-flex items-center gap-2 rounded-full border font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf ${
        selected
          ? "border-leaf/30 bg-leaf-soft text-leaf hover:border-leaf"
          : "border-leaf bg-leaf text-white shadow-[0_6px_16px_-8px_rgba(18,48,31,0.6)] hover:bg-leaf-dark"
      }`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
        {selected ? (
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
      {selected ? "Added to compare" : "Add to compare"}
    </button>
  );
}
