import { google } from "googleapis";
import { getAuthenticatedOAuth2Client } from "./google-auth";
import { processRawMessage } from "./categorizer";
import { DailyDigest, EmailCategory, HighlightTag } from "./types";
import { db } from "./store";

export async function fetchEmailsAndGenerateDigest(
  userId: string,
  sinceDate?: Date
): Promise<DailyDigest> {
  const user = db.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const oauth2Client = await getAuthenticatedOAuth2Client(userId);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // Default to 24 hours ago if sinceDate is not provided or older than 48 hours
  const now = new Date();
  const startTime =
    sinceDate ||
    (user.lastDigestAt ? new Date(user.lastDigestAt) : new Date(now.getTime() - 24 * 60 * 60 * 1000));

  // Unix epoch in seconds for Gmail search query
  const epochSecs = Math.floor(startTime.getTime() / 1000);
  const query = `after:${epochSecs}`;

  console.log(`[Gmail] Fetching messages for user ${user.email} with query: "${query}"`);

  let messageIds: string[] = [];
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 60,
    });
    messageIds = (listRes.data.messages || []).map((m) => m.id!).filter(Boolean);
  } catch (err: any) {
    if (err.status === 401 || err.message?.includes("invalid_grant")) {
      db.disconnectGmail(userId);
      throw new Error("Gmail authorization expired. Please reconnect your account.");
    }
    throw new Error(`Gmail API list error: ${err.message}`);
  }

  const totalScanned = messageIds.length;
  const items = [];

  // Batch fetch details (chunks of 10 to respect quota & latency)
  const batchSize = 10;
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const chunk = messageIds.slice(i, i + batchSize);
    const chunkPromises = chunk.map(async (msgId) => {
      try {
        const msgRes = await gmail.users.messages.get({
          userId: "me",
          id: msgId,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = msgRes.data.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name?.toLowerCase() === "from")?.value || "Unknown Sender";
        const subjectHeader = headers.find((h) => h.name?.toLowerCase() === "subject")?.value || "(No subject)";
        const dateHeader = headers.find((h) => h.name?.toLowerCase() === "date")?.value || now.toISOString();

        return processRawMessage({
          id: msgId,
          threadId: msgRes.data.threadId || msgId,
          from: fromHeader,
          subject: subjectHeader,
          date: new Date(dateHeader).toISOString(),
          snippet: msgRes.data.snippet || "",
        });
      } catch (err) {
        console.warn(`[Gmail] Failed to fetch message ${msgId}:`, err);
        return null;
      }
    });

    const results = await Promise.all(chunkPromises);
    for (const res of results) {
      if (res) items.push(res);
    }
  }

  // Filter items by user's enabled categories if preference is set
  const enabledCategories = new Set(user.preferences.categoriesEnabled || [
    "work",
    "personal",
    "bills",
    "travel",
    "promotions",
    "updates",
  ]);

  const filteredItems = items.filter((item) => enabledCategories.has(item.category));

  // Compute category & highlight stats
  const categoryCounts: Record<EmailCategory, number> = {
    work: 0,
    personal: 0,
    bills: 0,
    travel: 0,
    promotions: 0,
    updates: 0,
  };

  const highlightCounts: Record<HighlightTag, number> = {
    reply_needed: 0,
    deadline: 0,
    appointment: 0,
    important: 0,
  };

  filteredItems.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    item.highlights.forEach((h) => {
      highlightCounts[h] = (highlightCounts[h] || 0) + 1;
    });
  });

  const digest: DailyDigest = {
    id: `digest-${Date.now()}`,
    userId,
    generatedAt: now.toISOString(),
    periodStart: startTime.toISOString(),
    periodEnd: now.toISOString(),
    totalEmailsScanned: totalScanned,
    totalSummarized: filteredItems.length,
    items: filteredItems,
    categoryCounts,
    highlightCounts,
    delivered: true,
    deliveryChannel: user.preferences.sendEmailNotification ? "both" : "in-app",
    deliveryStatus: "success",
  };

  db.saveDigest(digest);
  db.updateLastDigestAt(userId, now.toISOString());

  return digest;
}
