import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Use /api/attempts/technical or /api/attempts/scheduled for test submission." });
}
