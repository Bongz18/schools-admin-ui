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

  const base =
    size === "md"
      ? "rounded-full px-4 py-2 text-sm"
      : "rounded-full px-3 py-1.5 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      className={`${base} border font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf ${
        selected
          ? "border-leaf bg-leaf text-white hover:bg-leaf-dark"
          : "border-line bg-white text-ink hover:border-leaf"
      }`}
    >
      {selected ? "Added to compare" : "Add to compare"}
    </button>
  );
}
