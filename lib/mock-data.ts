import { DailyDigest, EmailSummaryItem, UserProfile } from "./types";

export const DEMO_USER: UserProfile = {
  id: "demo-user-123",
  email: "alex.taylor@gmail.com",
  name: "Alex Taylor",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  preferences: {
    deliveryTime: "08:00",
    timezone: "America/New_York",
    isPaused: false,
    categoriesEnabled: ["work", "personal", "bills", "travel", "promotions", "updates"],
    sendEmailNotification: true,
    notificationEmail: "alex.taylor@gmail.com",
  },
  connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  lastDigestAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  isDemoUser: true,
  gmailAccessGranted: true,
};

export const MOCK_EMAILS: EmailSummaryItem[] = [
  {
    id: "msg-101",
    threadId: "th-101",
    sender: {
      name: "Marcus Vance (VP Product)",
      email: "marcus.vance@techcorp.io",
    },
    subject: "Urgent: Q4 Engineering Roadmap & Budget Approval Needed by 3 PM",
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Hi Alex, we need your final sign-off on the Q4 engineering allocations before the executive board meeting this afternoon at 4 PM. Please check the linked sheet.",
    summary:
      "Marcus requests your explicit sign-off on the Q4 engineering allocations and headcount budget before 3:00 PM today ahead of the executive board sync.",
    category: "work",
    highlights: ["reply_needed", "deadline", "important"],
    actionItem: "Sign off on Q4 engineering allocations spreadsheet before 3:00 PM today.",
    deadlineDate: "Today at 3:00 PM EST",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-101",
  },
  {
    id: "msg-102",
    threadId: "th-102",
    sender: {
      name: "Delta Air Lines",
      email: "ticketreceipt@delta.com",
    },
    subject: "Flight Confirmation: SFO to JFK (DL 1420) - Confirmation #K89WQX",
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Your upcoming flight is confirmed. DL 1420 departs San Francisco (SFO) at 8:15 AM on Oct 14, arriving New York (JFK) at 4:45 PM. Seat 12B assigned.",
    summary:
      "Confirmed round-trip ticket SFO -> JFK on Oct 14 departing 8:15 AM. Seat 12B, terminal 2. E-ticket issued and terminal bag drop opens 2 hours prior.",
    category: "travel",
    highlights: ["appointment"],
    appointmentDate: "Oct 14, 2026 • 8:15 AM SFO",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-102",
  },
  {
    id: "msg-103",
    threadId: "th-103",
    sender: {
      name: "Chase Card Services",
      email: "no-reply@alertsp.chase.com",
    },
    subject: "Your Chase Sapphire Monthly Statement is Ready ($184.20 Due Oct 18)",
    receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Your new credit card statement is now available online. Total balance: $184.20. Minimum payment: $35.00 due on October 18, 2026. Automatic payment is scheduled.",
    summary:
      "Monthly statement for Chase Sapphire is ready. Total balance is $184.20, due on Oct 18. Auto-pay is scheduled for the minimum balance on Oct 15.",
    category: "bills",
    highlights: ["deadline"],
    deadlineDate: "Oct 18, 2026",
    actionItem: "Verify scheduled auto-pay covers the full $184.20 balance.",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-103",
  },
  {
    id: "msg-104",
    threadId: "th-104",
    sender: {
      name: "Elena Rostova",
      email: "elena.rostova@gmail.com",
    },
    subject: "Dinner Saturday & Catching up on the new puppy!",
    receivedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Hey Alex! Are we still on for Italian dinner at L'Artusi this Saturday around 7:30 PM? Let me know if that time still works or if you want to invite Maya too!",
    summary:
      "Elena asking if Saturday 7:30 PM at L'Artusi still works for dinner and whether Maya should be invited.",
    category: "personal",
    highlights: ["reply_needed", "appointment"],
    actionItem: "Reply to Elena regarding Saturday dinner table reservation.",
    appointmentDate: "Saturday, 7:30 PM",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-104",
  },
  {
    id: "msg-105",
    threadId: "th-105",
    sender: {
      name: "Calendar Invitation: Dev Architecture Sync",
      email: "calendar-notification@google.com",
    },
    subject: "Invitation: Dev Architecture Bi-Weekly Sync @ Tomorrow 10am - 10:45am",
    receivedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    snippet:
      "You have been invited to Dev Architecture Bi-Weekly Sync. Topics: Database indexing migration, OAuth 2.0 PKCE adoption, and latency benchmarks.",
    summary:
      "Bi-weekly architectural sync scheduled for tomorrow 10:00 AM - 10:45 AM via Google Meet. Agenda covers DB indexing and OAuth token encryption.",
    category: "work",
    highlights: ["appointment"],
    appointmentDate: "Tomorrow at 10:00 AM",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-105",
  },
  {
    id: "msg-106",
    threadId: "th-106",
    sender: {
      name: "Stripe Invoicing",
      email: "invoices@stripe.com",
    },
    subject: "Invoice #INV-2026-9810 from Vercel Inc. ($40.00)",
    receivedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Thank you for your business. This invoice has been paid automatically using Visa ending in 4092. View receipt online.",
    summary:
      "Receipt for Vercel Pro subscription ($40.00). Automatically paid via card *4092. No action required.",
    category: "bills",
    highlights: [],
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-106",
  },
  {
    id: "msg-107",
    threadId: "th-107",
    sender: {
      name: "The Pragmatic Engineer",
      email: "newsletter@pragmaticengineer.com",
    },
    subject: "Issue #182: How modern engineering teams handle automated AI digests",
    receivedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
    snippet:
      "In this week's issue: A deep dive into user trust, asynchronous summary pipelines, and minimal OAuth permission design for developer productivity tools.",
    summary:
      "Deep dive on architectural patterns for developer digests, privacy-first OAuth scopes, and reducing inbox cognitive load.",
    category: "promotions",
    highlights: [],
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-107",
  },
  {
    id: "msg-108",
    threadId: "th-108",
    sender: {
      name: "GitHub Security",
      email: "notifications@github.com",
    },
    subject: "[Security] All Dependabot security updates resolved in promptforge",
    receivedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
    snippet:
      "Good news! 0 vulnerable dependencies remain in promptforge repository. Security advisory audit completed successfully.",
    summary:
      "Dependabot resolved all potential dependency warnings in your repository. Security audit passed with zero vulnerabilities.",
    category: "updates",
    highlights: [],
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/msg-108",
  },
];

export function generateSampleDigest(userId: string = "demo-user-123"): DailyDigest {
  const categoryCounts = {
    work: 0,
    personal: 0,
    bills: 0,
    travel: 0,
    promotions: 0,
    updates: 0,
  };

  const highlightCounts = {
    reply_needed: 0,
    deadline: 0,
    appointment: 0,
    important: 0,
  };

  MOCK_EMAILS.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    item.highlights.forEach((h) => {
      highlightCounts[h] = (highlightCounts[h] || 0) + 1;
    });
  });

  return {
    id: `digest-${Date.now()}`,
    userId,
    generatedAt: new Date().toISOString(),
    periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    totalEmailsScanned: 24,
    totalSummarized: MOCK_EMAILS.length,
    items: MOCK_EMAILS,
    categoryCounts,
    highlightCounts,
    delivered: true,
    deliveryChannel: "both",
    deliveryStatus: "success",
  };
}
