import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ReviewRequest = {
  application?: Record<string, unknown>;
  details?: Record<string, unknown>;
  actor?: string;
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
  const applicant = String(application?.parent_email ?? application?.parent_id ?? "Applicant");
  const school = String(application?.school_name ?? application?.school_id ?? "School");

  return {
    ok: true,
    mode: "fallback",
    summary: `${applicant} submitted an application for ${school}. The request is ready for admin review, but AI scoring is currently using the fallback mode because no AI API key is configured.`,
    recommended_status: ["submitted", "in_review", "accepted", "rejected"].includes(status)
      ? status
      : "in_review",
    risk_flags: [
      "AI service not configured in this environment",
      "Manual review still required before final approval",
    ],
    score: 72,
    reasoning:
      "Fallback mode provides a safe default recommendation to keep the process moving while reminding staff to verify the application manually.",
    meta: {
      model: "fallback",
      source: "local-default-review",
    },
  };
}

async function logAuditEvent(event: string, entityType: string, entityId: string | number, actor: string, details: Record<string, unknown>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  await supabase.from("audit_logs").insert({
    entity_type: entityType,
    entity_id: String(entityId),
    event,
    actor: actor || "system",
    details: JSON.stringify(details),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReviewRequest;
    const application = body.application ?? {};
    const actor = body.actor ?? "admin";

    if (!application || Object.keys(application).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Application payload is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const fallback = buildFallbackReview(application as Record<string, unknown>);
      await logAuditEvent("ai_review_fallback", "application", String(application.id ?? "unknown"), actor, {
        summary: fallback.summary,
        recommended_status: fallback.recommended_status,
      });

      return NextResponse.json(fallback, { status: 200 });
    }

    const prompt = `
You are reviewing a school application for an admin dashboard.
Return valid JSON only with these keys:
- summary
- recommended_status
- risk_flags
- score
- reasoning

Use only one of these statuses: submitted, in_review, accepted, rejected.

Application data:
${JSON.stringify(application, null, 2)}

Consider missing documents, red flags, and school fit.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are a careful school admissions reviewer. Return concise, structured JSON for admin decision support.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`AI request failed: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
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
      summary:
        typeof review.summary === "string"
          ? review.summary
          : "AI review completed successfully.",
      recommended_status:
        typeof review.recommended_status === "string" && ["submitted", "in_review", "accepted", "rejected"].includes(review.recommended_status)
          ? review.recommended_status
          : "in_review",
      risk_flags: Array.isArray(review.risk_flags)
        ? review.risk_flags.filter((flag): flag is string => typeof flag === "string")
        : [],
      score:
        typeof review.score === "number"
          ? Math.max(0, Math.min(100, review.score))
          : 75,
      reasoning:
        typeof review.reasoning === "string"
          ? review.reasoning
          : "AI review completed successfully.",
      meta: {
        model: "gpt-4o-mini",
        source: "openai-chat-completions",
      },
    };

    await logAuditEvent("ai_review_completed", "application", String(application.id ?? "unknown"), actor, {
      summary: normalizedReview.summary,
      recommended_status: normalizedReview.recommended_status,
      score: normalizedReview.score,
    });

    return NextResponse.json(normalizedReview, { status: 200 });
  } catch (error) {
    console.error("AI review route error:", error);

    const fallback = buildFallbackReview();
    return NextResponse.json(
      {
        ...fallback,
        ok: false,
        summary: "The AI review pipeline encountered an error, so the request was routed to fallback review mode.",
        reasoning: error instanceof Error ? error.message : "Unknown AI processing error",
      },
      { status: 500 },
    );
  }
}
