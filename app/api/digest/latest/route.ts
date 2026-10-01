import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/store";
import { generateSampleDigest } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get("auth_session")?.value;

  if (!sessionUserId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = db.getUser(sessionUserId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let latest = db.getLatestDigest(sessionUserId);

  // If user has no digest yet, generate initial sample preview
  if (!latest) {
    latest = generateSampleDigest(sessionUserId);
    db.saveDigest(latest);
  }

  return NextResponse.json({ digest: latest });
}
