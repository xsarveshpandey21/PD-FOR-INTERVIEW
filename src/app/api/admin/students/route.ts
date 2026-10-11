import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch student records." }, { status: 500 });
  }
}
