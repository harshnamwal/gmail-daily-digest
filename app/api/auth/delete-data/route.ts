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
  if (user && !user.isDemoUser) {
    try {
      await revokeGoogleAccess(sessionUserId);
    } catch (e) {
      console.warn("Could not revoke token with Google during account purge:", e);
    }
  }

  // Completely purge all records for this user
  db.deleteUserData(sessionUserId);

  const response = NextResponse.json({
    success: true,
    message: "All user records, tokens, and historical summaries have been permanently deleted.",
  });
  response.cookies.delete("auth_session");
  return response;
}
