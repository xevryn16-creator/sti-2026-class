import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/cms/session";

/**
 * Guards every `/admin/*` route.
 *
 * The session cookie is SIGNATURE-VERIFIED here (not merely checked for
 * presence): a forged or expired cookie must never reach an admin render.
 * The layout repeats the check server-side as defense in depth.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  // Forward the verification outcome to server components. These headers are
  // always overwritten here, so a client cannot spoof them on matched routes.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-sti-admin-authed", session ? "1" : "0");
  requestHeaders.set("x-sti-admin-login-route", isLoginRoute ? "1" : "0");

  if (isLoginRoute) {
    // Only bounce an ALREADY VALID session away from the login form; a stale or
    // forged cookie must still be shown the form (previously caused a redirect loop).
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
