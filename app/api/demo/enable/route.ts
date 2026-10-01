import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { DEMO_USER, generateSampleDigest } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  // Save demo user in store
  db.saveUser(DEMO_USER);

  // Generate an initial sample digest if not already present
  let latest = db.getLatestDigest(DEMO_USER.id);
  if (!latest) {
    latest = generateSampleDigest(DEMO_USER.id);
    db.saveDigest(latest);
  }

  const response = NextResponse.json({
    success: true,
    user: DEMO_USER,
    digest: latest,
  });

  // Set session cookie for demo user
  response.cookies.set("auth_session", DEMO_USER.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  return response;
}
