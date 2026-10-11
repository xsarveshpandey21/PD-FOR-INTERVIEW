import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branchOption.findMany({ orderBy: { name: "asc" } });
    const fields = await prisma.fieldOption.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ branches, fields });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load options." }, { status: 500 });
  }
}
