import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, role, personality } = await req.json();
    const text = (message || "").toLowerCase().trim();

    let reply = "";

    const includesAny = (words: string[]) => {
      return words.some((word) => text.includes(word));
    };

    if (role === "Investor") {
      if (includesAny(["student", "students", "college", "campus"])) {
        reply =
          "Which exact student segment are you targeting first, and what painful problem do they face often enough to adopt this?";
      } else if (includesAny(["ai", "artificial intelligence", "llm", "model"])) {
        reply =
          "AI is just the engine. What is the real customer pain, and why would someone pay for your solution instead of a generic chatbot?";
      } else if (includesAny(["app", "platform", "website", "product"])) {
        reply =
          "What makes this product meaningfully different from existing alternatives, and why is that advantage hard to copy?";
      } else if (includesAny(["money", "revenue", "profit", "monetization", "business model"])) {
        reply =
          "Walk me through exactly how you make money, who pays, and how your revenue grows without your costs exploding.";
      } else if (includesAny(["market", "tam", "sam", "som", "size"])) {
        reply =
          "How big is this market realistically, and what specific wedge lets you enter it without getting crushed by bigger players?";
      } else if (includesAny(["growth", "users", "acquisition", "marketing"])) {
        reply =
          "How will you acquire your first 100 users cheaply, and which channel do you believe will work first?";
      } else if (includesAny(["competitor", "competition", "different", "unique"])) {
        reply =
          "Name your biggest competitors clearly, and tell me why users would still choose you over them.";
      } else if (includesAny(["scalability", "scale", "scalable"])) {
        reply =
          "What part of this business scales well, and what part becomes painful as usage grows?";
      } else if (includesAny(["traction", "proof", "evidence", "validation"])) {
        reply =
          "What proof do you have that people actually want this, beyond your own assumption?";
      } else if (includesAny(["team", "founder", "why you"])) {
        reply =
          "Why is your team uniquely suited to solve this problem better than others trying the same thing?";
      } else if (includesAny(["risk", "challenge", "problem"])) {
        reply =
          "What is the biggest risk in this business, and what is your plan if that assumption fails?";
      } else if (includesAny(["why now", "timing"])) {
        reply =
          "Why is this the right time for this idea, and what changed in the market that makes it more viable now?";
      } else {
        reply =
          "What problem are you solving, who pays for it, why now, and what stops competitors from copying it?";
      }
    } 
    
    else if (role === "Customer") {
      if (includesAny(["mentor", "mentorship", "guide"])) {
        reply =
          "Why should I trust your platform to connect me with the right mentor instead of asking seniors or searching online?";
      } else if (includesAny(["productivity", "tasks", "reminder", "schedule"])) {
        reply =
          "How does this save me real time today, not just sound useful in a pitch?";
      } else if (includesAny(["voice", "speech", "audio"])) {
        reply =
          "Why would I want to speak to this product instead of just typing, especially in public or noisy places?";
      } else if (includesAny(["education", "learning", "student", "study"])) {
        reply =
          "What outcome improves for me if I use this, and how quickly would I notice the difference?";
      } else if (includesAny(["price", "cost", "subscription", "pay"])) {
        reply =
          "Why is this worth paying for when free alternatives already exist?";
      } else if (includesAny(["easy", "simple", "usability", "user friendly"])) {
        reply =
          "Show me why this is actually simple for a first-time user and not just simple in your head.";
      } else if (includesAny(["trust", "privacy", "data", "secure", "security"])) {
        reply =
          "Why should I trust you with my voice data, and how are you protecting my privacy?";
      } else if (includesAny(["better", "different", "unique"])) {
        reply =
          "What do I get from your product that I do not already get from the tools I use today?";
      } else if (includesAny(["problem", "pain"])) {
        reply =
          "Is this solving a real recurring problem for me, or just a mild inconvenience?";
      } else {
        reply =
          "Why should I use this instead of what I already do right now, and what value do I feel immediately?";
      }
    } 
    
    else if (role === "Judge") {
      if (includesAny(["voice", "speech", "audio", "tts", "stt"])) {
        reply =
          "Why is voice central to your solution rather than just a cosmetic add-on to a normal app?";
      } else if (includesAny(["education", "learning", "student", "tutor"])) {
        reply =
          "What makes this educational solution genuinely interactive and impactful rather than another chatbot wrapper?";
      } else if (includesAny(["innovation", "innovative", "novel", "unique"])) {
        reply =
          "What is the real innovation here, and which part is technically or product-wise non-obvious?";
      } else if (includesAny(["scalable", "scale", "future"])) {
        reply =
          "How does this grow beyond a hackathon demo into something used reliably in the real world?";
      } else if (includesAny(["technical", "technology", "architecture", "stack"])) {
        reply =
          "Explain the technical flow clearly. What happens from user speech to system response?";
      } else if (includesAny(["api", "murf", "falcon", "integration"])) {
        reply =
          "How exactly are you using Murf Falcon in a way that matters to the user experience, not just to satisfy the requirement?";
      } else if (includesAny(["problem statement", "problem", "need"])) {
        reply =
          "What specific problem are you solving, and why is it important enough to deserve a voice-first solution?";
      } else if (includesAny(["impact", "value", "benefit"])) {
        reply =
          "Who benefits most from this solution, and what measurable impact would it create?";
      } else if (includesAny(["feasibility", "realistic", "implement"])) {
        reply =
          "What did you actually build, and which parts are production-feasible versus still conceptual?";
      } else if (includesAny(["demo", "prototype", "mvp"])) {
        reply =
          "What is functional in your prototype right now, and what is the strongest part of the demo?";
      } else if (includesAny(["competition", "existing"])) {
        reply =
          "What existing solutions are closest to yours, and where exactly do you outperform them?";
      } else if (includesAny(["future", "roadmap", "expand"])) {
        reply =
          "What is the next logical feature or market expansion that turns this from a prototype into a serious product?";
      } else {
        reply =
          "What is truly unique here, why is voice necessary, and how can this scale beyond a hackathon prototype?";
      }
    } 
    
    else if (role === "Mentor") {
      if (includesAny(["pitch", "idea", "startup"])) {
        reply =
          "Your pitch is still broad. Say who the user is, what pain they feel, and how your product fixes it in one tight sentence.";
      } else if (includesAny(["business model", "revenue", "money"])) {
        reply =
          "You need a cleaner monetization story. State who pays, when they pay, and why they keep paying.";
      } else if (includesAny(["different", "competition", "unique"])) {
        reply =
          "You are describing the category, not the edge. Tell me what makes your solution meaningfully different.";
      } else if (includesAny(["problem", "pain point"])) {
        reply =
          "The pain point sounds weak. Sharpen it until it feels urgent, expensive, or emotionally frustrating.";
      } else if (includesAny(["voice", "audio"])) {
        reply =
          "Do not just say voice is cool. Explain why speaking and listening create a better user outcome than typing.";
      } else if (includesAny(["demo", "presentation"])) {
        reply =
          "Your demo should show one clean user journey, not ten scattered features. Focus on one memorable moment.";
      } else {
        reply =
          "Tighten the user, pain point, value, and differentiation. Right now the idea sounds broader than it should.";
      }
    } 
    
    else {
      reply =
        "Explain your idea in one sentence using this formula: user, pain point, solution, and benefit.";
    }

    if (personality === "Aggressive") {
      reply = "Be specific. " + reply;
    } else if (personality === "Friendly") {
      reply = "Good start. " + reply;
    } else if (personality === "Rapid Fire") {
      const rapidFireExtras = [
        "What is your moat?",
        "How do you get your first 100 users?",
        "Why now?",
        "Who pays?",
        "What makes this hard to copy?"
      ];
      const extra = rapidFireExtras[Math.floor(Math.random() * rapidFireExtras.length)];
      reply = `${reply} Also, ${extra}`;
    } else if (personality === "Skeptical") {
      reply = "I am not convinced yet. " + reply;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);
    return NextResponse.json(
      { reply: "Something went wrong in chat route." },
      { status: 500 }
    );
  }
}