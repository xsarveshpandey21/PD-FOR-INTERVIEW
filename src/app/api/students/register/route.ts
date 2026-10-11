import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, year, rollNumber, branch, field } = body;

    if (!name || !email || !phone || !branch) {
      return NextResponse.json({ error: "Missing required candidate details." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).replace(/\D/g, "");

    const student = await prisma.student.upsert({
      where: { email: cleanEmail },
      update: {
        name: String(name).trim(),
        phone: cleanPhone,
        year: year || "3rd Year",
        rollNumber: rollNumber || null,
        branch: String(branch),
        field: field || "Software Developer",
      },
      create: {
        name: String(name).trim(),
        email: cleanEmail,
        phone: cleanPhone,
        year: year || "3rd Year",
        rollNumber: rollNumber || null,
        branch: String(branch),
        field: field || "Software Developer",
      },
    });

    return NextResponse.json({ message: "Student registered successfully.", student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register student." }, { status: 500 });
  }
}
