import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, writeAuditLog } from "@/lib/adminAuth";

const ALLOWED_STATUSES = ["submitted", "in_review", "accepted", "rejected"];

// Fields that identify a family. They are kept out of what is sent to the AI provider.
const PERSONAL_FIELDS = ["parent_id", "parent_email", "email", "phone", "parent_phone", "national_id", "address"];

type ReviewRequest = {
  application?: Record<string, unknown>;
};

type ReviewResponse = {
  ok: boolean;
  mode: "live" | "fallback";
  summary: string;
  recommended_status: string;
  risk_flags: string[];
  score: number;
  reasoning: string;
  meta?: {
    model?: string;
    source?: string;
  };
};

function buildFallbackReview(application?: Record<string, unknown>): ReviewResponse {
  const status = String(application?.status ?? "in_review");
  const school = String(application?.school_name ?? application?.school_id ?? "the school");

  return {
    ok: true,
    mode: "fallback",
    summary: `Application for ${school} is ready for manual review. AI review is not configured in this environment.`,
    recommended_status: ALLOWED_STATUSES.includes(status) ? status : "in_review",
    risk_flags: [
      "AI service not configured in this environment",
      "Manual review still required before final approval",
    ],
    score: 0,
    reasoning: "No AI assessment was made. Review the application manually.",
    meta: {
      model: "fallback",
      source: "local-default-review",
    },
  };
}

function withoutPersonalFields(application: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(application).filter(([key]) => !PERSONAL_FIELDS.includes(key)),
  );
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  try {
    const body = (await request.json()) as ReviewRequest;
    const application = body.application ?? {};
    const applicationId = String(application.id ?? "unknown");

    if (Object.keys(application).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Application payload is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const fallback = buildFallbackReview(application);
      await writeAuditLog(admin.supabase, {
        event: "ai_review_fallback",
        entityType: "application",
        entityId: applicationId,
        actor: admin.email,
        details: { recommended_status: fallback.recommended_status },
      });

      return NextResponse.json(fallback, { status: 200 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const prompt = `
You are reviewing a school application for an admin dashboard.
Return a JSON object with these keys:
- summary (string)
- recommended_status (one of: submitted, in_review, accepted, rejected)
- risk_flags (array of strings)
- score (number 0-100)
- reasoning (string)

Application data:
${JSON.stringify(withoutPersonalFields(application), null, 2)}

Consider missing documents, red flags, and school fit. If information is missing, say so rather than guessing.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful school admissions reviewer. Return concise, structured JSON for admin decision support. Staff make the final decision.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`AI request failed: ${response.status} ${errorData.slice(0, 300)}`);
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "{}";
    let review: Partial<ReviewResponse>;

    try {
      review = JSON.parse(content);
    } catch {
      const cleaned = content.replace(/```json|```/g, "").trim();
      review = JSON.parse(cleaned || "{}");
    }

    const normalizedReview: ReviewResponse = {
      ok: true,
      mode: "live",
      summary: typeof review.summary === "string" ? review.summary : "AI review completed.",
      recommended_status:
        typeof review.recommended_status === "string" &&
        ALLOWED_STATUSES.includes(review.recommended_status)
          ? review.recommended_status
          : "in_review",
      risk_flags: Array.isArray(review.risk_flags)
        ? review.risk_flags.filter((flag): flag is string => typeof flag === "string")
        : [],
      score: typeof review.score === "number" ? Math.max(0, Math.min(100, review.score)) : 0,
      reasoning: typeof review.reasoning === "string" ? review.reasoning : "",
      meta: {
        model,
        source: "openai-chat-completions",
      },
    };

    await writeAuditLog(admin.supabase, {
      event: "ai_review_completed",
      entityType: "application",
      entityId: applicationId,
      actor: admin.email,
      details: {
        recommended_status: normalizedReview.recommended_status,
        score: normalizedReview.score,
      },
    });

    return NextResponse.json(normalizedReview, { status: 200 });
  } catch (error) {
    console.error("AI review route error:", error);

    return NextResponse.json(
      {
        ...buildFallbackReview(),
        ok: false,
        error: "The AI review failed. Review this application manually.",
      },
      { status: 502 },
    );
  }
}
