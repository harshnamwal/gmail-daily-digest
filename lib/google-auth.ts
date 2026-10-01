import { google } from "googleapis";
import { db } from "./store";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID.trim().length > 0 &&
      process.env.GOOGLE_CLIENT_SECRET.trim().length > 0
  );
}

export function createOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthorizationUrl(stateToken?: string): string {
  if (!isGoogleConfigured()) {
    throw new Error(
      "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured."
    );
  }

  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force consent so we are issued a refresh token for background summaries
    scope: GMAIL_SCOPES,
    include_granted_scopes: true,
    state: stateToken || "state",
  });
}

export async function exchangeCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch basic user profile info
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    tokens,
    profile: {
      id: userInfo.data.id || `google-${Date.now()}`,
      email: userInfo.data.email || "",
      name: userInfo.data.name || userInfo.data.email?.split("@")[0] || "User",
      avatarUrl: userInfo.data.picture || undefined,
    },
  };
}

export async function getAuthenticatedOAuth2Client(userId: string) {
  const creds = db.getDecryptedCredentials(userId);
  if (!creds) {
    throw new Error(`No credentials found for user ${userId}`);
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken,
    expiry_date: creds.expiryDate,
    scope: creds.scope,
  });

  // Check if token expired or about to expire in next 5 minutes
  const isExpiringSoon = creds.expiryDate - Date.now() < 5 * 60 * 1000;
  if (isExpiringSoon && creds.refreshToken) {
    try {
      const refreshed = await oauth2Client.refreshAccessToken();
      const newTokens = refreshed.credentials;
      db.saveCredentials(userId, {
        accessToken: newTokens.access_token || creds.accessToken,
        refreshToken: newTokens.refresh_token || creds.refreshToken,
        expiryDate: newTokens.expiry_date || Date.now() + 3600 * 1000,
        scope: newTokens.scope || creds.scope,
      });
      oauth2Client.setCredentials(newTokens);
    } catch (refreshErr) {
      console.error(`Token refresh failed for user ${userId}:`, refreshErr);
      throw new Error("Google access has expired or was revoked. Please reconnect Gmail.");
    }
  }

  return oauth2Client;
}

export async function revokeGoogleAccess(userId: string): Promise<boolean> {
  const creds = db.getDecryptedCredentials(userId);
  if (!creds) return false;

  const oauth2Client = createOAuth2Client();
  const tokenToRevoke = creds.refreshToken || creds.accessToken;

  try {
    if (tokenToRevoke) {
      await oauth2Client.revokeToken(tokenToRevoke);
    }
  } catch (err) {
    console.warn(`Could not revoke token directly with Google:`, err);
  } finally {
    db.disconnectGmail(userId);
  }

  return true;
}
