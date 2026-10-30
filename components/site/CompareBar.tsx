"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPARE_LIMIT, useCompareList } from "@/lib/compare";

// Small bar pinned to the bottom of the screen once a parent picks schools to compare.
export default function CompareBar() {
  const { ids, clear } = useCompareList();
  const pathname = usePathname();

  if (ids.length === 0 || pathname === "/compare") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-ink">
          {ids.length} of {COMPARE_LIMIT} schools picked
          <button type="button" onClick={clear} className="ml-3 text-granite underline hover:text-ink">
            Clear
          </button>
        </p>
        <Link
          href="/compare"
          className="rounded-full bg-msasa px-5 py-2 text-sm font-semibold text-white hover:bg-[#721c29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-msasa"
        >
          Compare {ids.length > 1 ? "them" : "now"}
        </Link>
      </div>
    </div>
  );
}
