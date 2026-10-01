import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl, isGoogleConfigured } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      {
        error: "Google OAuth credentials not configured in .env",
        guideUrl: "/setup-guide",
        hint: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file or click 'Try Demo Mode' to preview.",
      },
      { status: 400 }
    );
  }

  try {
    const authUrl = getAuthorizationUrl();
    return NextResponse.redirect(authUrl);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
