import { cookies } from "next/headers";
import type { AdminSession, AdminUser, UserRole } from "@/types/cms";

const COOKIE_NAME = "sti_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

// Default development credentials (can be overridden via environment variables)
const DEFAULT_EMAIL = process.env.ADMIN_DEFAULT_EMAIL ?? "admin@sti2026.itb.ac.id";
const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD ?? "AdminSTI2026!Editorial";
const SECRET_KEY = process.env.ADMIN_SESSION_SECRET ?? "sti2026-development-secret-key-32chars";

// Derive HMAC key using Web Crypto (Edge & Node compatible)
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return Buffer.from(base64, "base64").toString("utf-8");
}

export async function signSession(session: AdminSession): Promise<string> {
  const payloadStr = JSON.stringify(session);
  const payloadB64 = base64UrlEncode(payloadStr);

  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  const signatureB64 = Buffer.from(signature)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${payloadB64}.${signatureB64}`;
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const [payloadB64, signatureB64] = token.split(".");
    if (!payloadB64 || !signatureB64) return null;

    const key = await getCryptoKey();
    let sigStr = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    while (sigStr.length % 4) sigStr += "=";
    const sigBytes = Buffer.from(sigStr, "base64");

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(payloadB64),
    );
    if (!valid) return null;

    const session: AdminSession = JSON.parse(base64UrlDecode(payloadB64));
    if (Date.now() > session.expiresAt) return null;

    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function login(
  email: string,
  pass: string,
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  const cleanEmail = email.trim().toLowerCase();

  // Support local dev credential or Supabase Auth
  if (cleanEmail === DEFAULT_EMAIL.toLowerCase() && pass === DEFAULT_PASSWORD) {
    const user: AdminUser = {
      id: "admin-default",
      email: cleanEmail,
      name: "Tim Administrator STI 2026",
      role: (process.env.ADMIN_DEFAULT_ROLE as UserRole) ?? "admin",
    };

    const session: AdminSession = {
      user,
      expiresAt: Date.now() + SESSION_MAX_AGE_SEC * 1000,
    };

    const token = await signSession(session);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });

    return { success: true, session };
  }

  // Check editor account fallback if configured
  if (
    cleanEmail === "editor@sti2026.itb.ac.id" &&
    pass === "EditorSTI2026!Content"
  ) {
    const user: AdminUser = {
      id: "editor-default",
      email: cleanEmail,
      name: "Tim Redaksi STI 2026",
      role: "editor",
    };

    const session: AdminSession = {
      user,
      expiresAt: Date.now() + SESSION_MAX_AGE_SEC * 1000,
    };

    const token = await signSession(session);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });

    return { success: true, session };
  }

  return { success: false, error: "Email atau kata sandi tidak valid." };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireRole(allowedRole: UserRole): Promise<AdminSession> {
  const session = await requireSession();
  if (allowedRole === "admin" && session.user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
