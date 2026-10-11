import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const search = searchParams.get("search");

    const where: any = {};

    if (branch && branch !== "ALL") {
      where.branch = branch;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { studentName: { contains: q } },
        { rollNumber: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const attempts = await prisma.scheduledAttempt.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attempts);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch scheduled attempt records." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const result = await prisma.scheduledAttempt.deleteMany({});

    return NextResponse.json({
      message: "Scheduled interview database records completely erased.",
      deletedCount: result.count,
    });
  } catch (error: any) {
    console.error("Erase scheduled database error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to erase scheduled interview database." },
      { status: 500 }
    );
  }
}
