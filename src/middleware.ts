import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "pd_assessment_secret_key_2026_secure"
);
const ADMIN_COOKIE_NAME = "pd_admin_jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  // Inject standard security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Verify JWT token helper
  const tokenFromCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const token = tokenFromCookie || tokenFromHeader;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // Protect /admin UI pages (except /admin/login)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Protect sensitive /api/admin endpoints
  if (pathname.startsWith("/api/admin")) {
    const isPublicLogin = pathname === "/api/admin/login";
    const isPublicSettingsGet = pathname === "/api/admin/settings" && req.method === "GET";
    const isPublicOptionsGet = pathname === "/api/admin/options" && req.method === "GET";

    if (!isPublicLogin && !isPublicSettingsGet && !isPublicOptionsGet && !isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access to admin API." }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

