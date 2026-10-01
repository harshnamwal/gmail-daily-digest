import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/store";
import { triggerUserDigest } from "@/lib/scheduler";
import { renderDigestHtml } from "@/lib/email-template";
import { DailyDigest } from "@/lib/types";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get("auth_session")?.value;

  if (!sessionUserId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = db.getUser(sessionUserId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // optional body
  }

  // Allow testing empty state
  if (body.simulateEmpty) {
    const emptyDigest: DailyDigest = {
      id: `digest-empty-${Date.now()}`,
      userId: user.id,
      generatedAt: new Date().toISOString(),
      periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      periodEnd: new Date().toISOString(),
      totalEmailsScanned: 0,
      totalSummarized: 0,
      items: [],
      categoryCounts: {
        work: 0,
        personal: 0,
        bills: 0,
        travel: 0,
        promotions: 0,
        updates: 0,
      },
      highlightCounts: {
        reply_needed: 0,
        deadline: 0,
        appointment: 0,
        important: 0,
      },
      delivered: true,
      deliveryChannel: "in-app",
      deliveryStatus: "success",
    };
    db.saveDigest(emptyDigest);
    return NextResponse.json({ success: true, digest: emptyDigest });
  }

  try {
    const digest = await triggerUserDigest(user.id, true);
    return NextResponse.json({ success: true, digest });
  } catch (err: any) {
    console.error(`Error generating digest for user ${user.id}:`, err);
    return NextResponse.json(
      {
        error: err.message || "Failed to generate summary",
        hint: user.isDemoUser
          ? "Demo mode simulation error."
          : "Please check that your Gmail authorization has not expired.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allows previewing the HTML email directly in browser
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get("auth_session")?.value;

  if (!sessionUserId) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  const user = db.getUser(sessionUserId);
  const latest = db.getLatestDigest(sessionUserId);

  if (!user || !latest) {
    return new NextResponse("No digest available to preview", { status: 404 });
  }

  const html = renderDigestHtml(latest, user.name);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
