export type EmailCategory =
  | "work"
  | "personal"
  | "bills"
  | "travel"
  | "promotions"
  | "updates";

export type HighlightTag =
  | "reply_needed"
  | "deadline"
  | "appointment"
  | "important";

export interface EmailSender {
  name: string;
  email: string;
}

export interface EmailSummaryItem {
  id: string;
  threadId: string;
  sender: EmailSender;
  subject: string;
  receivedAt: string;
  snippet: string;
  summary: string;
  category: EmailCategory;
  highlights: HighlightTag[];
  actionItem?: string;
  deadlineDate?: string;
  appointmentDate?: string;
  gmailUrl: string;
}

export interface DailyDigest {
  id: string;
  userId: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalEmailsScanned: number;
  totalSummarized: number;
  items: EmailSummaryItem[];
  categoryCounts: Record<EmailCategory, number>;
  highlightCounts: Record<HighlightTag, number>;
  delivered: boolean;
  deliveryChannel: "in-app" | "email" | "both";
  deliveryStatus?: "success" | "pending" | "failed" | "mocked";
}

export interface UserPreferences {
  deliveryTime: string; // "08:00" (24-hour format)
  timezone: string; // e.g. "Asia/Kolkata" or "America/New_York"
  isPaused: boolean;
  categoriesEnabled: EmailCategory[];
  sendEmailNotification: boolean;
  notificationEmail?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  lastDigestAt?: string;
  isDemoUser: boolean;
  connectedAt: string;
  gmailAccessGranted: boolean;
}

export interface StoredEncryptedCredentials {
  userId: string;
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  expiryDate: number;
  scope: string;
  iv: string;
  authTag: string;
  updatedAt: string;
}

export interface AppAuthStatus {
  authenticated: boolean;
  isDemoMode: boolean;
  googleConfigured: boolean;
  user?: UserProfile;
  latestDigest?: DailyDigest | null;
}
