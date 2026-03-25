# 🚀 PitchPilot – Voice AI Pitch Simulator

A voice-first AI app that helps you practice startup pitches with **real-time investor-style questioning and feedback**.

---

## ⚡ How to Run the App

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open in browser:

```
http://localhost:3000
```

---

## 🔐 Environment Setup

Create a file named:

```
.env.local
```

Add your API keys:

```
GEMINI_API_KEY=your_gemini_api_key
MURF_API_KEY=your_murf_api_key
```

⚠️ Important:

* No quotes
* No spaces
* Restart server after adding keys

---

## 🧠 How It Works

1. 🎤 Speak your pitch
2. 🤖 AI acts as Investor / Judge / Mentor / Customer
3. ❓ AI asks real-time questions
4. 📊 Get feedback on clarity, weakness, and improvement

---

## 🛠 Tech Stack

* Next.js (Frontend + Backend)
* Gemini API (AI questioning + feedback)
* Murf AI (Text-to-Speech)

---

## ✏️ Customization

Edit UI here:

```
app/page.tsx
```

Edit AI logic here:

```
app/api/chat/route.ts
app/api/feedback/route.ts
```

---

## 🚨 Common Issues

* **No AI response** → Check API key
* **Speech not working** → Use Chrome + allow mic
* **Server not updating** → Restart with `npm run dev`

---

## 🎯 What This App Does

* Simulates real investor conversations
* Builds confidence under pressure
* Improves pitch clarity

---

## 🚀 Deploy

Easiest way:
👉 Use Vercel

---

## 💡 Final Note

This is not just an AI app.

It’s a **practice arena for high-pressure thinking**.

Use it like one.
