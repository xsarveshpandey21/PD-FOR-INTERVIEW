import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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

    // Calculate score
    let score = 0;
    const maxScore = Array.isArray(questions) ? questions.length : 10;

    if (Array.isArray(questions) && selectedAnswers) {
      questions.forEach((q: any, idx: number) => {
        if (selectedAnswers[idx] !== undefined && Number(selectedAnswers[idx]) === q.correctOptionIndex) {
          score += 1;
        }
      });
    }

    // Save attempt in database
    const attempt = await prisma.technicalAttempt.create({
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

    // Record question history for no-repeat logic (identifier can be rollNumber or email)
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
      message: "Technical assessment attempt submitted successfully!",
      attemptId: attempt.id,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
    });
  } catch (error: any) {
    console.error("Technical attempt submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit technical attempt." },
      { status: 500 }
    );
  }
}
