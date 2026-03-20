import { NextResponse } from "next/server";

type HistoryItem = {
  type: "user" | "ai";
  text: string;
};

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const conversation: HistoryItem[] = Array.isArray(history) ? history : [];

    const userMessages = conversation
      .filter((item) => item.type === "user")
      .map((item) => item.text.toLowerCase());

    const fullText = userMessages.join(" ");

    let clarityScore = 5;
    let weakness = "Your pitch is still too generic.";
    let improvement = "State the user, pain point, and value more clearly.";
    let rewrittenPitch =
      "We help a specific user solve a specific problem through a voice-first solution that delivers a clear benefit.";

    if (userMessages.length >= 3) {
      clarityScore += 1;
    }

    if (
      fullText.includes("student") ||
      fullText.includes("founder") ||
      fullText.includes("customer") ||
      fullText.includes("college")
    ) {
      clarityScore += 1;
    }

    if (
      fullText.includes("problem") ||
      fullText.includes("pain") ||
      fullText.includes("solve")
    ) {
      clarityScore += 1;
    }

    if (
      fullText.includes("voice") ||
      fullText.includes("speech") ||
      fullText.includes("audio")
    ) {
      clarityScore += 1;
    }

    if (
      fullText.includes("money") ||
      fullText.includes("revenue") ||
      fullText.includes("subscription") ||
      fullText.includes("business model")
    ) {
      clarityScore += 1;
    }

    if (
      !fullText.includes("student") &&
      !fullText.includes("customer") &&
      !fullText.includes("founder") &&
      !fullText.includes("college")
    ) {
      weakness = "Your target user is unclear.";
      improvement =
        "Say exactly who this is for before describing features.";
      rewrittenPitch =
        "PitchPilot helps founders and students practice real-time startup pitches through voice-based investor simulations.";
    } else if (
      !fullText.includes("problem") &&
      !fullText.includes("pain") &&
      !fullText.includes("solve")
    ) {
      weakness = "You describe the idea, but not the pain point strongly enough.";
      improvement =
        "Explain what frustration, inefficiency, or failure the user faces without your solution.";
      rewrittenPitch =
        "PitchPilot helps founders practice difficult pitch conversations so they can explain their startup clearly under pressure.";
    } else if (
      !fullText.includes("voice") &&
      !fullText.includes("speech") &&
      !fullText.includes("audio")
    ) {
      weakness = "You have not justified why voice is central to the product.";
      improvement =
        "Explain why spoken interaction creates a more realistic and useful experience than text alone.";
      rewrittenPitch =
        "PitchPilot is a voice-first pitch simulator that helps founders train for investor conversations in a realistic spoken environment.";
    } else if (
      !fullText.includes("money") &&
      !fullText.includes("revenue") &&
      !fullText.includes("subscription") &&
      !fullText.includes("business model")
    ) {
      weakness = "Your monetization story is weak or missing.";
      improvement =
        "State who pays, why they pay, and what pricing model makes sense.";
      rewrittenPitch =
        "PitchPilot helps founders practice startup pitches through AI voice simulations and can scale through subscriptions for students, incubators, and startup programs.";
    } else {
      weakness = "Your pitch has a decent base, but it still needs sharper differentiation.";
      improvement =
        "Explain what makes your solution more useful or more realistic than existing chatbot tools.";
      rewrittenPitch =
        "PitchPilot is a voice-first startup pitch simulator that helps founders and students practice high-pressure investor conversations with realistic AI voice feedback.";
    }

    if (clarityScore > 10) clarityScore = 10;

    const feedback = `
Clarity Score: ${clarityScore}/10

Biggest Weakness:
${weakness}

One High-Impact Improvement:
${improvement}

Rewritten One-Line Pitch:
${rewrittenPitch}
    `.trim();

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("FEEDBACK ROUTE ERROR:", error);
    return NextResponse.json(
      { feedback: "Something went wrong while generating feedback." },
      { status: 500 }
    );
  }
}