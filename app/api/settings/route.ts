import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/store";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get("auth_session")?.value;

  if (!sessionUserId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatedUser = db.updatePreferences(sessionUserId, body);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preferences: updatedUser.preferences,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
