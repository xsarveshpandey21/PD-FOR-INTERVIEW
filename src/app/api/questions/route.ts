import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Use /api/questions/generate for AI question generation.",
  });
}
