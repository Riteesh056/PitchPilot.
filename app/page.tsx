"use client";

import { useEffect, useState } from "react";
import { startListening } from "@/lib/speech";

type HistoryItem = {
  type: "user" | "ai";
  text: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("Investor");
  const [personality, setPersonality] = useState("Skeptical");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [feedback, setFeedback] = useState("");

  const [showConversation, setShowConversation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const playVoice = async (text: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      console.log("TTS DATA:", data);

      if (data.audio) {
        const audio = new Audio(data.audio);
        await audio.play();
      } else {
        console.error("No audio URL returned from TTS route");
      }
    } catch (error) {
      console.error("Voice playback error:", error);
    }
  };

  const sendToAI = async (message: string) => {
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          role,
          personality,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "No response yet...";

      setReply(aiReply);
      setHistory((prev) => [
        ...prev,
        { type: "user", text: message },
        { type: "ai", text: aiReply },
      ]);
      setShowConversation(true);

      await playVoice(aiReply);
    } catch (error) {
      console.error("Frontend chat error:", error);
      const fallbackReply = "Something went wrong while getting the response.";
      setReply(fallbackReply);
      setHistory((prev) => [
        ...prev,
        { type: "user", text: message },
        { type: "ai", text: fallbackReply },
      ]);
      setShowConversation(true);
    } finally {
      setLoading(false);
    }
  };

  const getFeedback = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history }),
      });

      const data = await res.json();
      setFeedback(data.feedback || "No feedback generated.");
      setShowFeedback(true);
    } catch (error) {
      console.error("Feedback error:", error);
      setFeedback("Something went wrong while generating feedback.");
      setShowFeedback(true);
    }
  };

  const handleMic = () => {
    startListening(async (result: string) => {
      setText(result);
      await sendToAI(result);
    });
  };

  const clearSession = () => {
    setText("");
    setReply("");
    setFeedback("");
    setHistory([]);
    setShowConversation(false);
    setShowFeedback(false);
  };

  return (
    <main className="min-h-screen bg-[#0b1020] text-white px-6 py-10 overflow-x-hidden">
      <div
        className={`max-w-3xl mx-auto flex flex-col items-center text-center transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-sm text-zinc-500 tracking-[0.2em] uppercase">
          Voice-first pitch simulator
        </p>

        <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
          PitchPilot
        </h1>

        <p className="mt-3 text-zinc-400 max-w-xl leading-relaxed">
          Practice your startup pitch with role-based AI questioning and instant feedback.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["Investor", "Customer", "Judge", "Mentor"].map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${
                role === item
                  ? "bg-white text-black border-white scale-105"
                  : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:scale-[1.03]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {["Friendly", "Skeptical", "Aggressive", "Rapid Fire"].map((item) => (
            <button
              key={item}
              onClick={() => setPersonality(item)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${
                personality === item
                  ? "bg-blue-500 text-white border-blue-500 scale-105 shadow-md"
                  : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:scale-[1.03]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10 relative">
          <div
            className={`absolute inset-0 rounded-full ${
              loading ? "animate-ping bg-white/20" : "bg-transparent"
            }`}
          />
          <div
            className={`absolute -inset-3 rounded-full border border-white/10 ${
              loading ? "animate-pulse" : ""
            }`}
          />
          <button
            onClick={handleMic}
            className="relative h-24 w-24 rounded-full bg-white text-black text-3xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            🎤
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-500 transition-all duration-300">
          {loading ? "Listening / thinking..." : "Tap and speak your pitch"}
        </p>

        <div className="mt-10 w-full space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#11172a] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              Your speech
            </p>
            <p className="text-zinc-100 leading-relaxed">
              {text || "Nothing captured yet..."}
            </p>
          </div>

          <div
            className={`rounded-2xl border border-zinc-800 bg-[#11172a] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-zinc-700 ${
              reply ? "opacity-100 translate-y-0" : "opacity-90"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              AI response
            </p>
            <p className="text-zinc-100 leading-relaxed">
              {reply || "No response yet..."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={getFeedback}
            className="px-5 py-3 rounded-full bg-emerald-500 text-black font-medium hover:bg-emerald-400 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Get Feedback
          </button>

          <button
            onClick={() => setShowConversation((prev) => !prev)}
            className="px-5 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            {showConversation ? "Hide Conversation" : "Show Conversation"}
          </button>

          <button
            onClick={clearSession}
            className="px-5 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Clear
          </button>
        </div>

        <div
          className={`mt-10 w-full overflow-hidden transition-all duration-500 ease-in-out ${
            showConversation && history.length > 0
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-zinc-800 bg-[#11172a] p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
              Conversation
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="transition-all duration-300 hover:translate-x-1"
                >
                  <span className="text-sm font-medium text-zinc-400">
                    {item.type === "user" ? "You" : "AI"}
                  </span>
                  <p className="text-zinc-100 mt-1 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-6 w-full overflow-hidden transition-all duration-500 ease-in-out ${
            showFeedback ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-zinc-800 bg-[#11172a] p-5 text-left">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Feedback
              </p>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                Close
              </button>
            </div>

            <p className="whitespace-pre-line text-zinc-100 leading-8">
              {feedback || "No feedback yet..."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}