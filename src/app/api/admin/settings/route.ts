import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "default",
          isScheduledRoundOpen: false,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { isScheduledRoundOpen, scheduledStartTime, scheduledEndTime } = await req.json();

    const updated = await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        isScheduledRoundOpen: Boolean(isScheduledRoundOpen),
        scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : null,
        scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime) : null,
      },
      create: {
        id: "default",
        isScheduledRoundOpen: Boolean(isScheduledRoundOpen),
        scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : null,
        scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime) : null,
      },
    });

    return NextResponse.json({ message: "Settings updated successfully.", settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings." }, { status: 500 });
  }
}
