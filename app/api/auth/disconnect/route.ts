import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/store";
import { revokeGoogleAccess } from "@/lib/google-auth";

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

  if (!user.isDemoUser) {
    // Revoke with Google OAuth servers
    await revokeGoogleAccess(sessionUserId);
  } else {
    db.disconnectGmail(sessionUserId);
  }

  const response = NextResponse.json({ success: true, message: "Disconnected successfully" });
  response.cookies.delete("auth_session");
  return response;
}
