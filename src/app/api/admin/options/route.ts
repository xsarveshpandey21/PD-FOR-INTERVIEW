import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const branches = await prisma.branchOption.findMany({ orderBy: { name: "asc" } });
    const fields = await prisma.fieldOption.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ branches, fields });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch options." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { type, name, code } = await req.json();

    if (type === "branch") {
      if (!name || !code) {
        return NextResponse.json({ error: "Branch name and code are required." }, { status: 400 });
      }
      const branch = await prisma.branchOption.create({
        data: {
          code: String(code).trim().toUpperCase(),
          name: String(name).trim(),
        },
      });
      return NextResponse.json({ message: "Branch added.", option: branch });
    } else if (type === "field") {
      if (!name) {
        return NextResponse.json({ error: "Field name is required." }, { status: 400 });
      }
      const field = await prisma.fieldOption.create({
        data: {
          name: String(name).trim(),
        },
      });
      return NextResponse.json({ message: "Field added.", option: field });
    } else {
      return NextResponse.json({ error: "Invalid option type." }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add option." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required." }, { status: 400 });
    }

    if (type === "branch") {
      await prisma.branchOption.delete({ where: { id } });
    } else if (type === "field") {
      await prisma.fieldOption.delete({ where: { id } });
    }

    return NextResponse.json({ message: "Option deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete option." }, { status: 500 });
  }
}
