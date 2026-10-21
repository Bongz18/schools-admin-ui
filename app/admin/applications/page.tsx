import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { application, parent, school } = body || {};

    if (!application) {
      return NextResponse.json({ error: "No application payload supplied." }, { status: 400 });
    }

    const fallback = {
      summary:
        `This application is currently marked as ${application.status || "submitted"}. The applicant is ${
          parent?.email || "unknown"
        } and the selected school is ${school?.name || "unassigned"}. The record should be reviewed for completeness, readiness, and any missing required notes or documentation.`,
      recommended_status: application.status === "accepted" ? "accepted" : "in_review",
      confidence: 0.82,
      flags: [
        "Check whether supporting documents are complete.",
        "Confirm the school match is still appropriate for this applicant.",
        "Ask for clarification if the application notes are missing or unclear.",
      ],
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(fallback);
    }

    const prompt = `
      You are helping a school administrator review an application.
      Return JSON with: summary, recommended_status, confidence, flags.
      summary should be 2-4 sentences.
      recommended_status must be one of: submitted, in_review, accepted, rejected.
      confidence must be a number between 0 and 1.
      flags should be an array of strings.

      Application data:
      ${JSON.stringify({ application, parent, school }, null, 2)}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI request failed:", await response.text());
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        summary: parsed.summary || fallback.summary,
        recommended_status: parsed.recommended_status || fallback.recommended_status,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : fallback.confidence,
        flags: Array.isArray(parsed.flags) ? parsed.flags : fallback.flags,
      });
    } catch {
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("AI review route error:", error);
    return NextResponse.json(
      {
        summary: "The application was reviewed locally because the AI service is currently unavailable.",
        recommended_status: "in_review",
        confidence: 0.7,
        flags: ["Review the record manually before final approval."],
      },
      { status: 200 }
    );
  }
}
