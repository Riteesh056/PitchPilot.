import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "api-key": process.env.MURF_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voiceId: "en-US-natalie",
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      audio: data.audioFile,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ audio: null }, { status: 500 });
  }
}