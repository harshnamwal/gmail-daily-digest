import { db } from "./store";
import { fetchEmailsAndGenerateDigest } from "./gmail";
import { generateSampleDigest } from "./mock-data";
import { DailyDigest, UserProfile } from "./types";

interface ScheduledJobResult {
  userId: string;
  userEmail: string;
  status: "success" | "skipped" | "error";
  reason?: string;
  digestId?: string;
  itemsCount?: number;
}

/**
 * Checks whether user is due for their daily summary based on their deliveryTime and timezone
 */
export function isUserDueForDigest(user: UserProfile, now: Date = new Date()): boolean {
  if (user.preferences.isPaused) return false;

  // Format current time in user's timezone
  try {
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: user.preferences.timezone || "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const currentTimeStr = timeFormatter.format(now); // e.g. "08:15"

    // Parse target delivery time
    const [targetH, targetM] = (user.preferences.deliveryTime || "08:00")
      .split(":")
      .map(Number);
    const [currH, currM] = currentTimeStr.split(":").map(Number);

    // Within a 15-minute delivery window
    const targetMinutes = targetH * 60 + targetM;
    const currentMinutes = currH * 60 + currM;
    const diff = currentMinutes - targetMinutes;

    if (diff < 0 || diff > 15) {
      return false;
    }

    // Check if user already received a digest today
    if (user.lastDigestAt) {
      const lastDigestDate = new Date(user.lastDigestAt);
      const isSameDay =
        lastDigestDate.getFullYear() === now.getFullYear() &&
        lastDigestDate.getMonth() === now.getMonth() &&
        lastDigestDate.getDate() === now.getDate();

      if (isSameDay) {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error(`Error checking timezone for user ${user.id}:`, err);
    return false;
  }
}

/**
 * Triggers digest generation for a single user (handles both live Google account and demo user)
 */
export async function triggerUserDigest(
  userId: string,
  force: boolean = false
): Promise<DailyDigest> {
  const user = db.getUser(userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  if (user.isDemoUser) {
    const demoDigest = generateSampleDigest(userId);
    db.saveDigest(demoDigest);
    db.updateLastDigestAt(userId, new Date().toISOString());
    return demoDigest;
  }

  // Live Gmail account
  return await fetchEmailsAndGenerateDigest(userId);
}

/**
 * Sweeps all users and runs digests for those that are due
 */
export async function runScheduledDigestSweep(): Promise<ScheduledJobResult[]> {
  const users = db.getAllActiveUsers();
  const results: ScheduledJobResult[] = [];
  const now = new Date();

  console.log(`[Scheduler] Running digest sweep for ${users.length} active users at ${now.toISOString()}`);

  for (const user of users) {
    if (!isUserDueForDigest(user, now)) {
      continue;
    }

    try {
      const digest = await triggerUserDigest(user.id);
      results.push({
        userId: user.id,
        userEmail: user.email,
        status: "success",
        digestId: digest.id,
        itemsCount: digest.totalSummarized,
      });
      console.log(`[Scheduler] Successfully dispatched digest for ${user.email}`);
    } catch (err: any) {
      console.error(`[Scheduler] Failed digest for ${user.email}:`, err);
      results.push({
        userId: user.id,
        userEmail: user.email,
        status: "error",
        reason: err.message,
      });
    }
  }

  return results;
}
