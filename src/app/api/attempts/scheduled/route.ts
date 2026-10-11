import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json({ isOpen: false, reason: "Settings not configured." });
    }

    const now = new Date();
    let isOpen = settings.isScheduledRoundOpen;

    // Check time window if configured
    if (settings.scheduledStartTime && now < new Date(settings.scheduledStartTime)) {
      isOpen = false;
    }
    if (settings.scheduledEndTime && now > new Date(settings.scheduledEndTime)) {
      isOpen = false;
    }

    return NextResponse.json({
      isOpen,
      isScheduledRoundOpen: settings.isScheduledRoundOpen,
      scheduledStartTime: settings.scheduledStartTime,
      scheduledEndTime: settings.scheduledEndTime,
      currentTime: now.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to check scheduled round status." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Verify if scheduled round is currently open
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    const now = new Date();
    let isOpen = settings ? settings.isScheduledRoundOpen : false;

    if (settings?.scheduledStartTime && now < new Date(settings.scheduledStartTime)) {
      isOpen = false;
    }
    if (settings?.scheduledEndTime && now > new Date(settings.scheduledEndTime)) {
      isOpen = false;
    }

    if (!isOpen) {
      return NextResponse.json(
        { error: "The Scheduled Interview Round is currently closed." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { studentName, email, phone, year, rollNumber, branch, field, questions, selectedAnswers } = body;

    // Validation
    if (!studentName || !email || !phone || !year || !branch || !field) {
      return NextResponse.json({ error: "Missing required candidate details." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).replace(/\D/g, "");
    const cleanRoll = rollNumber ? String(rollNumber).trim() : null;

    if (year !== "1st Year" && cleanRoll) {
      if (!/^\d{13}$/.test(cleanRoll)) {
        return NextResponse.json({ error: "Roll number must be exactly 13 digits for 2nd-4th year." }, { status: 400 });
      }
    }

    // Calculate score for 5 questions
    let score = 0;
    const maxScore = Array.isArray(questions) ? questions.length : 5;

    if (Array.isArray(questions) && selectedAnswers) {
      questions.forEach((q: any, idx: number) => {
        if (selectedAnswers[idx] !== undefined && Number(selectedAnswers[idx]) === q.correctOptionIndex) {
          score += 1;
        }
      });
    }

    // Save scheduled attempt
    const attempt = await prisma.scheduledAttempt.create({
      data: {
        studentName: String(studentName).trim(),
        email: cleanEmail,
        phone: cleanPhone,
        year: String(year),
        rollNumber: cleanRoll,
        branch: String(branch),
        field: String(field),
        score,
        maxScore,
        questionsJson: JSON.stringify(questions || []),
        answersJson: JSON.stringify(selectedAnswers || {}),
      },
    });

    // Record question history for no-repeat logic
    const studentIdentifier = cleanRoll || cleanEmail;
    if (Array.isArray(questions) && studentIdentifier) {
      const historyRecords = questions.map((q: any) => ({
        studentIdentifier,
        questionText: String(q.questionText || "").trim(),
      }));

      await prisma.questionHistory.createMany({
        data: historyRecords,
      }).catch((err) => {
        console.warn("Could not write question history:", err);
      });
    }

    return NextResponse.json({
      message: "Scheduled interview round attempt submitted successfully!",
      attemptId: attempt.id,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
    });
  } catch (error: any) {
    console.error("Scheduled attempt error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit scheduled round attempt." },
      { status: 500 }
    );
  }
}
