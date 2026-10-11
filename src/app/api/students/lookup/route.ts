import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ found: true, student });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to lookup student." }, { status: 500 });
  }
}
