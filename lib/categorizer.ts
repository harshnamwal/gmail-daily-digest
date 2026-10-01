import { EmailCategory, HighlightTag, EmailSummaryItem, EmailSender } from "./types";

interface RawMessageData {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  bodyText?: string;
}

export function parseSender(fromHeader: string): EmailSender {
  // Format: "John Doe <john@example.com>" or "john@example.com"
  const match = fromHeader.match(/^(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)$/);
  if (match) {
    const name = match[1]?.trim() || match[2].split("@")[0];
    const email = match[2]?.trim() || fromHeader;
    return { name, email };
  }
  return { name: fromHeader.split("@")[0] || fromHeader, email: fromHeader };
}

export function categorizeEmail(
  subject: string,
  from: string,
  snippet: string
): EmailCategory {
  const text = `${subject} ${from} ${snippet}`.toLowerCase();

  // Travel patterns
  if (
    text.includes("flight") ||
    text.includes("airline") ||
    text.includes("boarding pass") ||
    text.includes("hotel") ||
    text.includes("reservation") ||
    text.includes("itinerary") ||
    text.includes("booking.com") ||
    text.includes("airbnb") ||
    text.includes("delta") ||
    text.includes("united airlines") ||
    text.includes("american airlines") ||
    text.includes("terminal") ||
    text.includes("check-in")
  ) {
    return "travel";
  }

  // Bills & Finance patterns
  if (
    text.includes("invoice") ||
    text.includes("statement") ||
    text.includes("receipt") ||
    text.includes("payment due") ||
    text.includes("credit card") ||
    text.includes("chase") ||
    text.includes("bank") ||
    text.includes("billing") ||
    text.includes("stripe") ||
    text.includes("payroll") ||
    text.includes("minimum payment") ||
    text.includes("charge of") ||
    text.includes("subscription renewed")
  ) {
    return "bills";
  }

  // Updates & Security patterns
  if (
    text.includes("security alert") ||
    text.includes("verification code") ||
    text.includes("password reset") ||
    text.includes("terms of service") ||
    text.includes("dependabot") ||
    text.includes("two-factor") ||
    text.includes("new sign-in") ||
    text.includes("policy update")
  ) {
    return "updates";
  }

  // Promotions & Marketing patterns
  if (
    text.includes("unsubscribe") ||
    text.includes("% off") ||
    text.includes("discount") ||
    text.includes("deal") ||
    text.includes("promo") ||
    text.includes("sale ends") ||
    text.includes("newsletter") ||
    text.includes("free shipping") ||
    text.includes("special offer")
  ) {
    return "promotions";
  }

  // Work patterns
  if (
    text.includes("sync") ||
    text.includes("roadmap") ||
    text.includes("agenda") ||
    text.includes("project") ||
    text.includes("client") ||
    text.includes("deliverable") ||
    text.includes("sprint") ||
    text.includes("standup") ||
    text.includes("jira") ||
    text.includes("slack") ||
    text.includes("pull request") ||
    text.includes("quarterly") ||
    text.includes("review") ||
    text.includes("stakeholder") ||
    text.includes("proposal") ||
    text.includes("team")
  ) {
    return "work";
  }

  // Default to personal if coming from individual addresses
  return "personal";
}

export function detectHighlights(
  subject: string,
  snippet: string,
  category: EmailCategory
): {
  highlights: HighlightTag[];
  actionItem?: string;
  deadlineDate?: string;
  appointmentDate?: string;
} {
  const text = `${subject} ${snippet}`.toLowerCase();
  const highlights: HighlightTag[] = [];
  let actionItem: string | undefined;
  let deadlineDate: string | undefined;
  let appointmentDate: string | undefined;

  // 1. Reply Needed Detection
  const replyIndicators = [
    "let me know",
    "can you",
    "could you",
    "please reply",
    "thoughts?",
    "what do you think",
    "waiting for your",
    "action required",
    "sign-off",
    "please confirm",
    "rsvp",
  ];
  if (replyIndicators.some((kw) => text.includes(kw)) || snippet.includes("?")) {
    highlights.push("reply_needed");
    if (text.includes("sign-off") || text.includes("approval")) {
      actionItem = "Review and provide sign-off as requested.";
    } else if (text.includes("confirm")) {
      actionItem = "Confirm receipt or availability with sender.";
    } else if (text.includes("rsvp")) {
      actionItem = "RSVP to invitation.";
    } else {
      actionItem = "Reply to sender's inquiry or request.";
    }
  }

  // 2. Deadline Detection
  const deadlineIndicators = [
    "due on",
    "due by",
    "deadline",
    "before 3 pm",
    "before 5 pm",
    "by eod",
    "by tomorrow",
    "by friday",
    "by monday",
    "expires",
  ];
  if (
    category === "bills" ||
    deadlineIndicators.some((kw) => text.includes(kw))
  ) {
    highlights.push("deadline");
    const dueMatch = text.match(/due (?:on|by)?\s*([a-zA-Z0-9,\s]+?)(?:\.|$)/i);
    if (dueMatch && dueMatch[1]) {
      deadlineDate = dueMatch[1].trim();
    } else if (text.includes("by 3 pm")) {
      deadlineDate = "Today by 3:00 PM";
    } else if (text.includes("by tomorrow")) {
      deadlineDate = "Tomorrow";
    } else if (category === "bills") {
      deadlineDate = "Check monthly bill statement date";
    }
  }

  // 3. Appointment / Calendar Detection
  if (
    category === "travel" ||
    text.includes("invitation:") ||
    text.includes("calendar") ||
    text.includes("zoom") ||
    text.includes("google meet") ||
    text.includes("scheduled for") ||
    text.includes("flight dl") ||
    text.includes("departure")
  ) {
    highlights.push("appointment");
    if (text.includes("tomorrow")) {
      appointmentDate = "Tomorrow";
    } else if (text.includes("saturday")) {
      appointmentDate = "Saturday";
    } else if (category === "travel") {
      appointmentDate = "Upcoming travel itinerary";
    }
  }

  // 4. Important / Urgent Detection
  if (
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("important") ||
    text.includes("asap") ||
    text.includes("high priority") ||
    highlights.includes("deadline") && highlights.includes("reply_needed")
  ) {
    if (!highlights.includes("important")) {
      highlights.push("important");
    }
  }

  return { highlights, actionItem, deadlineDate, appointmentDate };
}

export function generateSummaryText(
  subject: string,
  snippet: string,
  category: EmailCategory
): string {
  // Clean snippet from common email noise
  let clean = snippet
    .replace(/^https?:\/\/\S+/gi, "")
    .replace(/\[image:.*?\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length > 180) {
    clean = clean.substring(0, 177) + "...";
  }

  if (!clean || clean.length < 20) {
    return `${subject} received for category: ${category}.`;
  }

  return clean;
}

export function processRawMessage(raw: RawMessageData): EmailSummaryItem {
  const sender = parseSender(raw.from);
  const category = categorizeEmail(raw.subject, raw.from, raw.snippet);
  const { highlights, actionItem, deadlineDate, appointmentDate } = detectHighlights(
    raw.subject,
    raw.snippet,
    category
  );
  const summary = generateSummaryText(raw.subject, raw.snippet, category);

  return {
    id: raw.id,
    threadId: raw.threadId,
    sender,
    subject: raw.subject || "(No Subject)",
    receivedAt: raw.date,
    snippet: raw.snippet,
    summary,
    category,
    highlights,
    actionItem,
    deadlineDate,
    appointmentDate,
    gmailUrl: `https://mail.google.com/mail/u/0/#inbox/${raw.id}`,
  };
}
