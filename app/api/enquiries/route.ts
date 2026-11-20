import { NextResponse } from "next/server";

// Enquiries through SchoolSpot are switched off (20 Nov 2026): parents now contact schools
// directly with the buttons on each profile, so SchoolSpot stores no parent details.
// The old route and the enquiries table are kept so the feature can come back later.

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Please contact the school directly using the details on its page." },
    { status: 410 },
  );
}
