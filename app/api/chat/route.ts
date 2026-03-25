import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, role, personality, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing API Key");
    }

    // 🧠 Convert history into conversation string
    const historyText = (history || [])
      .map((item: any) => `${item.type === "user" ? "User" : role}: ${item.text}`)
      .join("\n");

    const prompt = `
You are a ${role} in a startup pitch simulation.

Personality: ${personality}

Conversation so far:
${historyText}

Latest user input:
"${message}"

Your job:
- Ask a sharp follow-up question
- Build on previous answers
- Expose gaps in logic

Rules:
- No explanations
- Only question
- Max 2 sentences
- Stay natural

If Rapid Fire → ask 2 short questions.
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

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI failed to respond";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("ERROR:", error);

    return NextResponse.json(
      { reply: error?.message || "Something failed" },
      { status: 500 }
    );
  }
}