import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login and static assets)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      const sessionCookie = request.cookies.get("sti_admin_session")?.value;
      if (sessionCookie) {
        // If already logged in, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("sti_admin_session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
