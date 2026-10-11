import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "pd_assessment_secret_key_2026_secure";
const ADMIN_COOKIE_NAME = "pd_admin_jwt";

export interface AdminPayload {
  id: string;
  email: string;
  username?: string;
}

export function signAdminToken(admin: AdminPayload): string {
  return jwt.sign({ id: admin.id, email: admin.email, username: admin.username || "admin" }, JWT_SECRET, {
    expiresIn: "2h",
  });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function verifyAdminRequest(req: Request): Promise<AdminPayload | null> {
  // 1. Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyAdminToken(token);
    if (decoded) return decoded;
  }

  // 2. Check Cookie
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      const decoded = verifyAdminToken(token);
      if (decoded) return decoded;
    }
  } catch (e) {
    // cookies() might fail if outside server context
  }

  return null;
}

export function setAdminAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });
}

export function clearAdminAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
