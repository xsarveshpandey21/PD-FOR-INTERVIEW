import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAdminToken, setAdminAuthCookie } from "@/lib/auth";

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MINUTES = 10;
const LOCKOUT_DURATION_MS = LOCKOUT_DURATION_MINUTES * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    const defaultAdminEmail = (process.env.ADMIN_DEFAULT_USERNAME || "admin@example.com").trim().toLowerCase();
    const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";

    let admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanEmail }
        ]
      }
    });

    // Auto-create default admin account on demand if DB has no admin records in total
    if (!admin) {
      const totalAdmins = await prisma.admin.count();
      if (totalAdmins === 0 && (cleanEmail === defaultAdminEmail || cleanEmail === "admin")) {
        try {
          const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);
          admin = await prisma.admin.create({
            data: {
              email: defaultAdminEmail,
              username: "admin",
              passwordHash,
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          });
        } catch (createErr) {
          console.error("Auto-creation of default admin failed:", createErr);
        }
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const now = new Date();

    // Check if account is currently locked out
    if (admin.lockedUntil && admin.lockedUntil > now) {
      const remainingMs = admin.lockedUntil.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Account is locked due to ${MAX_LOGIN_ATTEMPTS} failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
          locked: true,
          remainingMinutes,
        },
        { status: 429 }
      );
    }

    // Reset attempt count if lockout period has passed
    let currentAttempts = admin.failedLoginAttempts;
    if (admin.lockedUntil && admin.lockedUntil <= now) {
      currentAttempts = 0;
    }

    // Verify Password strictly against stored database hash
    const isValidPassword = await bcrypt.compare(cleanPassword, admin.passwordHash);

    if (!isValidPassword) {
      const newAttempts = currentAttempts + 1;

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedLoginAttempts: newAttempts,
            lockedUntil: lockoutUntil,
          },
        });

        return NextResponse.json(
          {
            error: `Maximum login attempts (${MAX_LOGIN_ATTEMPTS}) exceeded. Account is locked for ${LOCKOUT_DURATION_MINUTES} minutes.`,
            locked: true,
            remainingMinutes: LOCKOUT_DURATION_MINUTES,
          },
          { status: 429 }
        );
      } else {
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedLoginAttempts: newAttempts,
            lockedUntil: null,
          },
        });

        const attemptsLeft = MAX_LOGIN_ATTEMPTS - newAttempts;
        return NextResponse.json(
          {
            error: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft > 1 ? "s" : ""} remaining before a ${LOCKOUT_DURATION_MINUTES}-minute lockout.`,
            attemptsRemaining: attemptsLeft,
          },
          { status: 401 }
        );
      }
    }

    // Successful Login: Reset attempts and lock status
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      username: admin.username || "admin",
    });

    setAdminAuthCookie(token);

    return NextResponse.json({
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: error.message || "Authentication failed." }, { status: 500 });
  }
}
