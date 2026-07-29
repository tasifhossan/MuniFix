import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
