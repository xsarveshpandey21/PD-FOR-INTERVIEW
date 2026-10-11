import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await prisma.hodProfile.findFirst();
    return NextResponse.json(profile || {
      name: "Prof. Mahima Sahay",
      designation: "Head of Department — Placement Cell",
      photoUrl: "/hod-photo.jpg",
      mobile: "+91 98765 43210",
      email: "hod.placement@srgi.ac.in",
      welcomeMessage: "Welcome to the Placement & Personality Development (PD) Web Portal of S R Group of Institutions, Lucknow!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch HOD profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { name, designation, photoUrl, mobile, email, welcomeMessage } = await req.json();

    const existing = await prisma.hodProfile.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.hodProfile.update({
        where: { id: existing.id },
        data: { name, designation, photoUrl, mobile, email, welcomeMessage },
      });
    } else {
      updated = await prisma.hodProfile.create({
        data: { name, designation, photoUrl, mobile, email, welcomeMessage },
      });
    }

    return NextResponse.json({ message: "HOD profile updated.", profile: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update HOD profile." }, { status: 500 });
  }
}
