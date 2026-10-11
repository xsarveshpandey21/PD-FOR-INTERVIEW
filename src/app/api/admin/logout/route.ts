import { NextResponse } from "next/server";
import { clearAdminAuthCookie } from "@/lib/auth";

export async function POST() {
  clearAdminAuthCookie();
  return NextResponse.json({ message: "Logged out successfully." });
}
