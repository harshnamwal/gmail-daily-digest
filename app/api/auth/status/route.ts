import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/store";
import { isGoogleConfigured } from "@/lib/google-auth";
import { AppAuthStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get("auth_session")?.value;

  const googleConfigured = isGoogleConfigured();

  if (!sessionUserId) {
    const status: AppAuthStatus = {
      authenticated: false,
      isDemoMode: false,
      googleConfigured,
      latestDigest: null,
    };
    return NextResponse.json(status);
  }

  const user = db.getUser(sessionUserId);
  if (!user) {
    const status: AppAuthStatus = {
      authenticated: false,
      isDemoMode: false,
      googleConfigured,
      latestDigest: null,
    };
    return NextResponse.json(status);
  }

  const latestDigest = db.getLatestDigest(user.id);

  const status: AppAuthStatus = {
    authenticated: true,
    isDemoMode: user.isDemoUser,
    googleConfigured,
    user,
    latestDigest,
  };

  return NextResponse.json(status);
}
