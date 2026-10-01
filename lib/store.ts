import fs from "fs";
import path from "path";
import {
  UserProfile,
  UserPreferences,
  StoredEncryptedCredentials,
  DailyDigest,
} from "./types";
import { encryptText, decryptText } from "./crypto";

interface StoreSchema {
  users: Record<string, UserProfile>;
  credentials: Record<string, StoredEncryptedCredentials>;
  digests: Record<string, DailyDigest[]>; // userId -> list of digests
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): StoreSchema {
  ensureDirectoryExists();
  if (!fs.existsSync(STORE_FILE)) {
    const initial: StoreSchema = {
      users: {},
      credentials: {},
      digests: {},
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read store.json, returning empty store:", err);
    return { users: {}, credentials: {}, digests: {} };
  }
}

function writeStore(store: StoreSchema): void {
  ensureDirectoryExists();
  const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tempFile, STORE_FILE);
}

// Store API
export const db = {
  getUser(userId: string): UserProfile | null {
    const store = readStore();
    return store.users[userId] || null;
  },

  getUserByEmail(email: string): UserProfile | null {
    const store = readStore();
    const user = Object.values(store.users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return user || null;
  },

  getAllUsers(): UserProfile[] {
    const store = readStore();
    return Object.values(store.users);
  },

  getAllActiveUsers(): UserProfile[] {
    const store = readStore();
    return Object.values(store.users).filter(
      (u) => !u.preferences.isPaused && u.gmailAccessGranted
    );
  },

  saveUser(user: UserProfile): void {
    const store = readStore();
    store.users[user.id] = user;
    writeStore(store);
  },

  updatePreferences(userId: string, prefs: Partial<UserPreferences>): UserProfile | null {
    const store = readStore();
    const user = store.users[userId];
    if (!user) return null;

    user.preferences = {
      ...user.preferences,
      ...prefs,
    };
    store.users[userId] = user;
    writeStore(store);
    return user;
  },

  updateLastDigestAt(userId: string, timestamp: string): void {
    const store = readStore();
    if (store.users[userId]) {
      store.users[userId].lastDigestAt = timestamp;
      writeStore(store);
    }
  },

  saveCredentials(
    userId: string,
    tokens: {
      accessToken: string;
      refreshToken?: string;
      expiryDate: number;
      scope: string;
    }
  ): void {
    const store = readStore();
    const encAccessToken = encryptText(tokens.accessToken);
    let encRefreshToken: string | undefined;

    if (tokens.refreshToken) {
      encRefreshToken = encryptText(tokens.refreshToken).cipherText;
    } else if (store.credentials[userId]?.encryptedRefreshToken) {
      // Retain existing refresh token if Google didn't issue a new one in this turn
      encRefreshToken = store.credentials[userId].encryptedRefreshToken;
    }

    store.credentials[userId] = {
      userId,
      encryptedAccessToken: encAccessToken.cipherText,
      encryptedRefreshToken: encRefreshToken,
      expiryDate: tokens.expiryDate,
      scope: tokens.scope,
      iv: encAccessToken.iv,
      authTag: encAccessToken.authTag,
      updatedAt: new Date().toISOString(),
    };

    if (store.users[userId]) {
      store.users[userId].gmailAccessGranted = true;
    }

    writeStore(store);
  },

  getDecryptedCredentials(userId: string): {
    accessToken: string;
    refreshToken?: string;
    expiryDate: number;
    scope: string;
  } | null {
    const store = readStore();
    const cred = store.credentials[userId];
    if (!cred) return null;

    try {
      const accessToken = decryptText({
        cipherText: cred.encryptedAccessToken,
        iv: cred.iv,
        authTag: cred.authTag,
      });

      let refreshToken: string | undefined;
      if (cred.encryptedRefreshToken) {
        refreshToken = decryptText({
          cipherText: cred.encryptedRefreshToken,
          iv: cred.iv,
          authTag: cred.authTag,
        });
      }

      return {
        accessToken,
        refreshToken,
        expiryDate: cred.expiryDate,
        scope: cred.scope,
      };
    } catch (err) {
      console.error(`Failed to decrypt credentials for user ${userId}:`, err);
      return null;
    }
  },

  disconnectGmail(userId: string): void {
    const store = readStore();
    delete store.credentials[userId];
    if (store.users[userId]) {
      store.users[userId].gmailAccessGranted = false;
    }
    writeStore(store);
  },

  deleteUserData(userId: string): void {
    const store = readStore();
    delete store.users[userId];
    delete store.credentials[userId];
    delete store.digests[userId];
    writeStore(store);
  },

  saveDigest(digest: DailyDigest): void {
    const store = readStore();
    if (!store.digests[digest.userId]) {
      store.digests[digest.userId] = [];
    }
    // Prepend so latest is first, retain up to 30 digests (30-day retention)
    store.digests[digest.userId].unshift(digest);
    if (store.digests[digest.userId].length > 30) {
      store.digests[digest.userId] = store.digests[digest.userId].slice(0, 30);
    }
    writeStore(store);
  },

  getLatestDigest(userId: string): DailyDigest | null {
    const store = readStore();
    const list = store.digests[userId];
    if (!list || list.length === 0) return null;
    return list[0];
  },

  getDigestHistory(userId: string): DailyDigest[] {
    const store = readStore();
    return store.digests[userId] || [];
  },
};
