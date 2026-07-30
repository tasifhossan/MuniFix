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
  console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}`);
  if (token) {
    const decoded = parseJwt(token);
    console.log(`[Middleware] Decoded role: ${decoded?.role}`);
  }
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Validate token existence on protected routes
  if (isProtected) {
    if (!token) {
      console.log(`[Middleware] No token on protected route ${pathname}, redirecting to /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const decoded = parseJwt(token);
    if (!decoded || !decoded.role) {
      console.log(`[Middleware] Invalid token on protected route ${pathname}, redirecting to /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (token) {
    const decoded = parseJwt(token);
    if (decoded && decoded.role) {
      const { role } = decoded;

      // ─── REDIRECT LOGGED-IN USERS AWAY FROM THE LANDING PAGE ──────────────
      if (pathname === "/") {
        if (role === "citizen") return NextResponse.redirect(new URL("/dashboard", request.url));
        if (role === "field_worker") return NextResponse.redirect(new URL("/worker", request.url));
        if (role === "dept_admin") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        if (role === "super_admin") return NextResponse.redirect(new URL("/dashboard/superadmin", request.url));
      }

      // ─── CITIZEN ──────────────────────────────────────────────────────────
      if (role === "citizen") {
        if (pathname.startsWith("/admin") || pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // ─── FIELD WORKER ─────────────────────────────────────────────────────
      if (role === "field_worker") {
        if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/worker", request.url));
        }
      }

      // ─── DEPT ADMIN ───────────────────────────────────────────────────────
      if (role === "dept_admin") {
        if (pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
        if (
          pathname.startsWith("/admin/permissions") ||
          pathname.startsWith("/admin/users") ||
          pathname.startsWith("/admin/reports")
        ) {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
        if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/admin")) {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
      }

      // ─── SUPER ADMIN ──────────────────────────────────────────────────────
      if (role === "super_admin") {
        if (pathname.startsWith("/worker")) {
          return NextResponse.redirect(new URL("/dashboard/superadmin", request.url));
        }
        if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/superadmin")) {
          return NextResponse.redirect(new URL("/dashboard/superadmin", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/complaints/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/worker/:path*",
    "/superadmin/:path*",
  ],
};
