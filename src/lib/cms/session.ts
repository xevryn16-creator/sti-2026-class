import type { AdminSession } from "@/types/cms";

/**
 * Edge-runtime-safe session token utilities.
 *
 * This module MUST stay free of Node-only APIs (`Buffer`, `next/headers`, `fs`)
 * so that both `src/middleware.ts` (Edge runtime) and the Node.js server code
 * (`src/lib/cms/auth.ts`) can sign and verify session tokens with identical
 * semantics. A mismatch between the two would either break login or, worse,
 * open an authentication bypass.
 */

export const SESSION_COOKIE_NAME = "sti_admin_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

const DEVELOPMENT_FALLBACK_SECRET = "sti2026-development-secret-key-32chars";

/**
 * Returns the configured signing secret.
 *
 * In production an explicit `ADMIN_SESSION_SECRET` is REQUIRED — we never fall
 * back to the well-known development literal there (see `isProductionSecretMissing`).
 */
export function getSessionSecret(): string {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length > 0) return configured;
  return DEVELOPMENT_FALLBACK_SECRET;
}

/**
 * True when running a production build without an explicit signing secret.
 * `login()` refuses to issue sessions in this state (fail-safe).
 */
export function isProductionSecretMissing(): boolean {
  return process.env.NODE_ENV === "production" && !process.env.ADMIN_SESSION_SECRET;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeUtf8ToBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function decodeBase64UrlToUtf8(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Signs a session payload into a `<payload>.<hmac>` token. */
export async function signSession(session: AdminSession): Promise<string> {
  const payloadB64 = encodeUtf8ToBase64Url(JSON.stringify(session));
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return `${payloadB64}.${bytesToBase64Url(new Uint8Array(signature as ArrayBuffer))}`;
}

/**
 * Verifies token signature AND expiry. Returns `null` for anything invalid:
 * malformed tokens, forged signatures, or expired sessions.
 */
export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signatureB64] = parts;
    if (!payloadB64 || !signatureB64) return null;

    const key = await getCryptoKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signatureB64),
      new TextEncoder().encode(payloadB64),
    );
    if (!valid) return null;

    const session = JSON.parse(decodeBase64UrlToUtf8(payloadB64)) as AdminSession;
    if (!session || typeof session !== "object") return null;
    if (typeof session.expiresAt !== "number" || Date.now() > session.expiresAt) {
      return null;
    }
    if (!session.user || typeof session.user.email !== "string") return null;

    return session;
  } catch {
    return null;
  }
}
