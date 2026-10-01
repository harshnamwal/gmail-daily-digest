import { NextRequest, NextResponse } from "next/server";
import { runScheduledDigestSweep } from "@/lib/scheduler";

export async function GET(request: NextRequest) {
  // Verify optional cron secret header if configured
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sweepResults = await runScheduledDigestSweep();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dispatched: sweepResults.length,
      details: sweepResults,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
