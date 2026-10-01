import { cookies } from "next/headers";
import type { AdminSession, AdminUser, UserRole } from "@/types/cms";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
  isProductionSecretMissing,
  signSession,
  verifySession,
} from "./session";

export { signSession, verifySession };
export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC };

const COOKIE_NAME = SESSION_COOKIE_NAME;

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

function buildSession(email: string, name: string, role: UserRole): AdminSession {
  return {
    user: { id: role === "admin" ? "admin-default" : "editor-default", email, name, role },
    expiresAt: Date.now() + SESSION_MAX_AGE_SEC * 1000,
  };
}

async function issueSession(session: AdminSession): Promise<void> {
  const isProduction = process.env.NODE_ENV === "production";
  const token = await signSession(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export async function login(
  email: string,
  pass: string,
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  const cleanEmail = email.trim().toLowerCase();
  const isProduction = process.env.NODE_ENV === "production";

  // Fail-safe: never issue sessions in production without an explicit
  // signing secret — the development fallback secret is public knowledge.
  if (isProductionSecretMissing()) {
    console.error(
      "[auth] ADMIN_SESSION_SECRET is not configured in production. Admin login is disabled.",
    );
    return {
      success: false,
      error: "Konfigurasi server belum lengkap. Hubungi administrator sistem.",
    };
  }

  // In production, require explicit environment credentials or Supabase Auth.
  // Never allow hardcoded development credentials in production.
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.ADMIN_DEFAULT_EMAIL ?? (isProduction ? undefined : "admin@sti2026.itb.ac.id");
  const adminPassword = process.env.ADMIN_PASSWORD ?? process.env.ADMIN_DEFAULT_PASSWORD ?? (isProduction ? undefined : "AdminSTI2026!Editorial");

  if (adminEmail && adminPassword && cleanEmail === adminEmail.toLowerCase() && pass === adminPassword) {
    const session = buildSession(
      cleanEmail,
      "Tim Administrator STI 2026",
      (process.env.ADMIN_DEFAULT_ROLE as UserRole) ?? "admin",
    );
    await issueSession(session);
    return { success: true, session };
  }

  // Check editor account (development or if explicitly set in env)
  const editorEmail = process.env.EDITOR_EMAIL ?? process.env.EDITOR_DEFAULT_EMAIL ?? (isProduction ? undefined : "editor@sti2026.itb.ac.id");
  const editorPassword = process.env.EDITOR_PASSWORD ?? process.env.EDITOR_DEFAULT_PASSWORD ?? (isProduction ? undefined : "EditorSTI2026!Content");

  if (editorEmail && editorPassword && cleanEmail === editorEmail.toLowerCase() && pass === editorPassword) {
    const session = buildSession(cleanEmail, "Tim Redaksi STI 2026", "editor");
    await issueSession(session);
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

/* ------------------------------------------------------------------ */
/* Non-throwing authorization (server actions)                        */
/* ------------------------------------------------------------------ */

/**
 * Indonesian, user-facing authorization messages.
 *
 * Server actions must never let a denied role surface as an unhandled
 * exception (that renders the framework "Application error" page). They return
 * one of these instead, so the admin UI can explain the refusal.
 */
export const AUTH_DENIED = {
  unauthorized:
    "Sesi Anda tidak ditemukan atau telah berakhir. Silakan masuk kembali untuk melanjutkan.",
  forbidden:
    "Akses ditolak: hanya akun dengan peran Administrator yang dapat menghapus data. Tindakan ini tidak dijalankan.",
} as const;

export type AuthorizationResult =
  | { ok: true; session: AdminSession }
  | { ok: false; error: string };

/**
 * Authorization that reports failure as data instead of throwing.
 *
 * Security semantics are identical to `requireSession()` / `requireRole()`:
 * the gate is evaluated before any mutation, so a denied caller never reaches
 * the store and therefore never produces an audit entry.
 */
export async function authorize(requiredRole?: UserRole): Promise<AuthorizationResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: AUTH_DENIED.unauthorized };
  }
  if (requiredRole === "admin" && session.user.role !== "admin") {
    return { ok: false, error: AUTH_DENIED.forbidden };
  }
  return { ok: true, session };
}
