import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("munifix_authtoken")?.value;
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const protectedPrefixes = ["/dashboard", "/complaints", "/reports", "/settings", "/admin", "/worker"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Not logged in → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const decoded = parseJwt(token);
    if (decoded && decoded.role) {
      const { role } = decoded;

      // ─── CITIZEN ──────────────────────────────────────────────────────────
      if (role === "citizen") {
        // Block access to admin and worker areas
        if (pathname.startsWith("/admin") || pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Redirect from wrong role sub-paths → citizen home
        if (
          pathname === "/dashboard/admin" ||
          pathname === "/dashboard/superadmin" ||
          pathname === "/dashboard/worker"
        ) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // ─── FIELD WORKER ─────────────────────────────────────────────────────
      if (role === "field_worker") {
        // Block access to admin areas
        if (pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/worker", request.url));
        }
        // /dashboard (generic) → send to worker dashboard
        if (pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/worker", request.url));
        }
        // Wrong role sub-paths → worker home
        if (
          pathname === "/dashboard/citizen" ||
          pathname === "/dashboard/admin" ||
          pathname === "/dashboard/superadmin"
        ) {
          return NextResponse.redirect(new URL("/worker", request.url));
        }
      }

      // ─── DEPT ADMIN ───────────────────────────────────────────────────────
      if (role === "dept_admin") {
        // Block access to worker field pages
        if (pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        // /dashboard (generic) → send to admin dashboard
        if (pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        // Wrong role sub-paths → admin home
        if (
          pathname === "/dashboard/citizen" ||
          pathname === "/dashboard/worker" ||
          pathname === "/dashboard/superadmin"
        ) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }

      // ─── SUPER ADMIN ──────────────────────────────────────────────────────
      if (role === "super_admin") {
        // Block access to worker field pages
        if (pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        // /dashboard (generic) → send to admin dashboard
        if (pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        // Wrong role sub-paths → admin home
        if (
          pathname === "/dashboard/citizen" ||
          pathname === "/dashboard/worker"
        ) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/complaints/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/worker/:path*",
  ],
};
