import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/adminAuth";

// Public endpoint: a parent sends an enquiry about a published school.
// Validates input, ignores bots (honeypot), and saves with the service role.

const LIMITS: Record<string, number> = {
  parentName: 120,
  email: 160,
  phone: 40,
  childGrade: 60,
  intake: 60,
  message: 2000,
};

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "The form couldn't be read. Try again." }, { status: 400 });
  }

  // Bots fill in the hidden "company" field; pretend success and save nothing.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const schoolId = clean(body.schoolId, 36);
  const parentName = clean(body.parentName, LIMITS.parentName);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);

  if (!UUID.test(schoolId)) {
    return NextResponse.json({ ok: false, error: "This school couldn't be found." }, { status: 400 });
  }
  if (!parentName) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "Add an email address or a phone number so the school can reply." },
      { status: 400 },
    );
  }
  if (email && !EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Enquiries are unavailable right now. Try again later." }, { status: 503 });
  }

  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("id", schoolId)
    .eq("status", "published")
    .maybeSingle();

  if (!school) {
    return NextResponse.json({ ok: false, error: "This school couldn't be found." }, { status: 404 });
  }

  const { error } = await supabase.from("enquiries").insert({
    school_id: schoolId,
    parent_name: parentName,
    email: email || null,
    phone: phone || null,
    child_grade: clean(body.childGrade, LIMITS.childGrade) || null,
    intake: clean(body.intake, LIMITS.intake) || null,
    message: clean(body.message, LIMITS.message) || null,
  });

  if (error) {
    console.error("Enquiry insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "Your enquiry wasn't sent. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
