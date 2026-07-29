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

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const decoded = parseJwt(token);
    if (decoded && decoded.role) {
      const { role } = decoded;

      // Citizen restrictions & dashboard routing
      if (role === "citizen") {
        if (pathname.startsWith("/admin") || pathname.startsWith("/worker") || pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/citizen", request.url));
        }
      }
      // Field Worker restrictions & dashboard routing
      if (role === "field_worker") {
        if (pathname.startsWith("/admin") || pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/worker", request.url));
        }
      }
      // Dept Admin restrictions & dashboard routing
      if (role === "dept_admin") {
        if (pathname.startsWith("/worker") || pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
      }
      // Super Admin restrictions & dashboard routing
      if (role === "super_admin") {
        if (pathname.startsWith("/worker") || pathname === "/dashboard") {
          return NextResponse.redirect(new URL("/dashboard/superadmin", request.url));
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
