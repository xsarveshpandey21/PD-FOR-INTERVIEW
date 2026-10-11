import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      orderBy: { registeredAt: "desc" },
    });

    const rows = students.map((s) => ({
      "Name": s.name,
      "Email": s.email,
      "Phone": s.phone,
      "Year": s.year,
      "Roll Number": s.rollNumber || "1st Year (Exempt)",
      "Branch": s.branch,
      "Preferred Field": s.field,
      "Registered At": new Date(s.registeredAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="PD_Student_Registrations.xlsx"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Export failed." }, { status: 500 });
  }
}
