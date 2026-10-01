import crypto from "crypto";

const DEFAULT_SECRET = "default-development-secret-key-32-chars-min-ok!";

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || DEFAULT_SECRET;
  // Always derive a precise 32-byte key using sha256
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts plain text using AES-256-GCM
 */
export function encryptText(plainText: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return {
    cipherText: encrypted,
    iv: iv.toString("base64"),
    authTag,
  };
}

/**
 * Decrypts AES-256-GCM encrypted payload
 */
export function decryptText(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.cipherText, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
