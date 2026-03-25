import { NextResponse } from "next/server";

type HistoryItem = {
  type: "user" | "ai";
  text: string;
};

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing API Key");
    }

    const conversation: HistoryItem[] = Array.isArray(history) ? history : [];

    // 🧠 Convert history to readable format
    const historyText = conversation
      .map(
        (item) =>
          `${item.type === "user" ? "User" : "AI"}: ${item.text}`
      )
      .join("\n");

    // 🔥 POWER PROMPT (this defines your product quality)
    const prompt = `
You are an expert startup mentor and investor.

Analyze the following pitch conversation:

${historyText}

Give structured feedback in this EXACT format:

Clarity Score: X/10

Biggest Weakness:
<1-2 lines identifying the biggest flaw>

One High-Impact Improvement:
<Specific actionable advice>

Rewritten One-Line Pitch:
<Rewrite the pitch in a sharp, compelling way>

Rules:
- Be honest and critical
- No generic advice
- Keep it concise but impactful
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("FEEDBACK RESPONSE:", JSON.stringify(data, null, 2));

    const feedback =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate feedback.";

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error("FEEDBACK ERROR:", error);

    return NextResponse.json(
      { feedback: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}