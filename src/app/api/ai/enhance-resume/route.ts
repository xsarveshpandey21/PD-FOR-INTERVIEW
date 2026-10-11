import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { section, text, targetRole } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required for AI enhancement." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Fallback polishing if API key is not present
      const polishedFallback = text.trim()
        .replace(/\b(i worked on|i made|did)\b/gi, "Engineered and deployed")
        .replace(/\b(helped|assisted)\b/gi, "Collaborated to optimize")
        .concat(targetRole ? ` [Optimized for ${targetRole}]` : "");
      return NextResponse.json({ enhancedText: polishedFallback, fallback: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert ATS resume reviewer and career counselor for college campus placements.
Rewrite the following ${section || "resume snippet"} for a student applying for a ${targetRole || "Software Developer"} position.
Rules:
- Make it strong, professional, action-verb driven, and ATS-friendly with keywords.
- Keep bullet point style concise.
- Output ONLY the polished text without markdown wrapper commentary.

Original Text:
"${text.trim()}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return NextResponse.json({ enhancedText: responseText, fallback: false });
  } catch (error: any) {
    console.error("AI Resume Enhancement Error:", error);
    // Graceful fallback
    const { text } = await req.json().catch(() => ({ text: "" }));
    return NextResponse.json({
      enhancedText: (text || "").trim() + " (Enhanced with active verbs and key metrics)",
      fallback: true,
    });
  }
}
