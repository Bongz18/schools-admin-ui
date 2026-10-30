"use client";

import { useEffect } from "react";
import { trackSchoolEvent } from "@/lib/track";

// Counts a parent opening a school's page. Renders nothing.
export default function TrackView({ schoolId }: { schoolId: string }) {
  useEffect(() => {
    trackSchoolEvent(schoolId, "view");
  }, [schoolId]);
  return null;
}
