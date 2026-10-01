/**
 * Only same-origin admin paths may be used as a post-login redirect target.
 *
 * `?redirect=` arrives from the URL, so without this check an attacker could
 * send `/admin/login?redirect=https://evil.example` and turn our login form
 * into an open redirect after a successful sign-in.
 */
export const DEFAULT_ADMIN_REDIRECT = "/admin/dashboard";

export function sanitizeAdminRedirect(value: string | null | undefined): string {
  if (!value) return DEFAULT_ADMIN_REDIRECT;

  // Must be an absolute path on this origin.
  if (!value.startsWith("/")) return DEFAULT_ADMIN_REDIRECT;
  // Reject protocol-relative ("//evil.example") and backslash variants.
  if (value.startsWith("//") || value.startsWith("/\\")) return DEFAULT_ADMIN_REDIRECT;
  if (value.includes("\\") || value.includes(":")) return DEFAULT_ADMIN_REDIRECT;
  // Never bounce back into the login page itself.
  if (value.startsWith("/admin/login")) return DEFAULT_ADMIN_REDIRECT;

  return value;
}
