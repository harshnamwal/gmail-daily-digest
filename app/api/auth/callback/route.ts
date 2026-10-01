import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google-auth";
import { db } from "@/lib/store";
import { UserProfile } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    console.error("Google OAuth error from query:", error);
    return NextResponse.redirect(`${baseUrl}/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=missing_code`);
  }

  try {
    const { tokens, profile } = await exchangeCode(code);

    let user = db.getUser(profile.id);
    if (!user) {
      // First time connecting
      user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        preferences: {
          deliveryTime: "08:00",
          timezone: "UTC",
          isPaused: false,
          categoriesEnabled: ["work", "personal", "bills", "travel", "promotions", "updates"],
          sendEmailNotification: true,
          notificationEmail: profile.email,
        },
        connectedAt: new Date().toISOString(),
        isDemoUser: false,
        gmailAccessGranted: true,
      };
    } else {
      user.name = profile.name;
      user.avatarUrl = profile.avatarUrl;
      user.gmailAccessGranted = true;
    }

    db.saveUser(user);

    // Securely encrypt and store tokens
    db.saveCredentials(user.id, {
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || undefined,
      expiryDate: tokens.expiry_date || Date.now() + 3600 * 1000,
      scope: tokens.scope || "",
    });

    const response = NextResponse.redirect(`${baseUrl}/?connected=true`);
    response.cookies.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      `${baseUrl}/?error=${encodeURIComponent(err.message || "oauth_failed")}`
    );
  }
}
