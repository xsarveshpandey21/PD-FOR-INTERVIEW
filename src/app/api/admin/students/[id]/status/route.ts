import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";

export async function PATCH(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }
  return NextResponse.json({ message: "Student status endpoint." });
}

