import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { DEMO_USER, generateSampleDigest } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  db.deleteUserData(DEMO_USER.id);
  db.saveUser(DEMO_USER);
  const digest = generateSampleDigest(DEMO_USER.id);
  db.saveDigest(digest);

  return NextResponse.json({
    success: true,
    user: DEMO_USER,
    digest,
  });
}
