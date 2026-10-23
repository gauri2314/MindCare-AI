import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Lazy-initialization of Gemini
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check (support both /api/health and standard Cloud Run /healthz)
app.get(["/api/health", "/healthz"], (_req, res) => {
  res.json({ status: "ok", service: "MindCare AI Backend" });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, userContext } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A message string is required." });
    }

    const ai = getGenAI();

    // Check for crisis / self-harm keywords for instant safety response
    const lower = message.toLowerCase();
    const isCrisis =
      lower.includes("suicide") ||
      lower.includes("kill myself") ||
      lower.includes("end my life") ||
      lower.includes("hurt myself") ||
      lower.includes("want to die");

    if (isCrisis) {
      return res.json({
        reply:
          "I hear how much pain you are experiencing right now, and I want you to know that you are not alone. Please reach out to someone who can help support you right now. MindCare AI cannot provide emergency medical care or crisis intervention. Please contact your local emergency services (like 988 in the US/Canada, 112 in Europe, or 999 in the UK) or reach out to a trusted loved one or healthcare professional immediately.",
        featureRecommendation: {
          action: "sos",
          title: "Emergency Support & Crisis Resources",
          duration: "Immediate",
          description: "Access 24/7 crisis support lines and trusted contact guidance.",
        },
        imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80",
        isSafetyCrisis: true,
      });
    }

    if (!ai) {
      // Graceful fallback response when API key is not present in local test
      return res.json(generateFallbackChatResponse(message, userContext));
    }

    const systemInstruction = `You are MindCare AI, an empathetic, supportive, and scientifically grounded mental wellness companion.
CRITICAL HEALTHCARE SAFETY & SCOPE:
- You are a wellness support and screening assistant.
- You must NEVER independently diagnose mental-health conditions, confirm psychiatric diagnoses, prescribe medication or dosages, or replace a doctor/therapist.
- BMI is a general screening measure only and never a standalone health determinant.
- You can recommend internal MindCare AI features:
  - "breathing": 2-10 min guided breathing sessions (Box Breathing, 4-7-8 Relaxation)
  - "meditation": Mindfulness, Stress relief, Sleep relaxation, Study breaks
  - "yoga": Gentle stretching, Morning calm, Flexibility
  - "exercise": Beginner 10-min walk, cardio, mobility
  - "journal": Reflective journaling prompt
  - "tracker": Log mood, water, sleep, or meals
  - "nutrition": Balanced meal guidelines and general nourishment plan
  - "music": Calming instrumental sounds and nature audio
  - "assessment": Wellness screening questionnaires
  - "sos": Crisis and professional support
- Output strictly in JSON format with this structure:
{
  "reply": "Empathetic, clear, and encouraging text response (2-4 sentences max).",
  "featureRecommendation": {
    "action": "breathing" | "meditation" | "yoga" | "exercise" | "journal" | "tracker" | "nutrition" | "music" | "assessment" | "sos" | null,
    "title": "Short title of the suggested activity",
    "duration": "e.g. 5 min",
    "description": "Brief reason why this helps"
  },
  "imageUrl": "Optional relevant Unsplash image URL if visual aid is helpful, otherwise null"
}
Image URLs available to recommend if contextually appropriate:
- Meditation: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80"
- Yoga: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80"
- Breathing/Calm: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80"
- Exercise: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80"
- Nutrition: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80"
- Sleep/Rest: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80"
`;

    const userPrompt = `User Context:
${JSON.stringify(userContext || {}, null, 2)}

Recent Conversation History:
${(history || [])
  .slice(-4)
  .map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`)
  .join("\n")}

User Message: "${message}"

Respond strictly as JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    return res.json({
      reply: parsed.reply || "I'm here with you. How can we take care of your wellness right now?",
      featureRecommendation: parsed.featureRecommendation || null,
      imageUrl: parsed.imageUrl || null,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback so chat never fails
    const fallback = generateFallbackChatResponse(req.body.message || "", req.body.userContext);
    return res.json(fallback);
  }
});

// AI Insights endpoint
app.post("/api/insights", async (req, res) => {
  try {
    const { profile, trackerStats } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json(generateFallbackInsights(profile, trackerStats));
    }

    const prompt = `Analyze this user's general wellness metrics:
User Profile: ${JSON.stringify(profile || {})}
Recent 7-Day Stats: ${JSON.stringify(trackerStats || {})}

Provide 3 personalized, supportive, non-diagnostic wellness observations.
Return JSON with this schema:
{
  "observations": [
    {
      "category": "Sleep" | "Stress" | "Hydration" | "Activity" | "Nourishment",
      "status": "positive" | "attention" | "encouragement",
      "summary": "Brief 1-sentence observation",
      "tip": "Practical small wellness habit recommendation"
    }
  ],
  "disclaimer": "AI-generated general wellness suggestions for educational tracking only."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err) {
    console.error("Error generating insights:", err);
    return res.json(generateFallbackInsights(req.body.profile, req.body.trackerStats));
  }
});

// SafeSpace Peer Reply Endpoint
app.post("/api/safespace/peer-reply", async (req, res) => {
  try {
    const { role, message, history, topic, feeling, persona } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const lower = message.toLowerCase();
    const isCrisis =
      lower.includes("suicide") ||
      lower.includes("kill myself") ||
      lower.includes("end my life") ||
      lower.includes("hurt myself") ||
      lower.includes("want to die") ||
      lower.includes("hang myself") ||
      lower.includes("overdose");

    if (isCrisis) {
      return res.json({
        reply:
          "I hear how much pain you are carrying right now, and I care deeply about your safety. Peer listeners cannot handle medical or mental health emergencies. Please connect immediately with 24/7 crisis support: Call or text 988 (Suicide & Crisis Lifeline) or text HOME to 741741. You don't have to carry this in silence.",
        isCrisisAlert: true,
      });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json(generateFallbackPeerReply(role, message, topic, feeling));
    }

    let systemInstruction = "";
    if (role === "seeker") {
      systemInstruction = `You are an anonymous user named "${persona || "Seeker"}" in MindCare AI SafeSpace who came to talk about "${topic || "everyday stress"}" (feeling: "${feeling || "overwhelmed"}").
You are speaking to a compassionate peer listener who is giving you their time.
Respond naturally, authentically, and conversationally in 1 to 3 short sentences.
Share your emotions gently, express how you feel, or respond to what the listener said.
Do NOT be overly poetic or robotic. Sound like a real person finding relief in being heard.`;
    } else {
      systemInstruction = `You are a trained peer listener named "${persona || "Peer Listener"}" in MindCare AI SafeSpace.
CRITICAL SAFETY & ROLE RULES:
- You are a fellow human peer, NOT a doctor, psychologist, therapist, or medical professional.
- NEVER diagnose, prescribe medications, or use psychiatric labels.
- NEVER preach, lecture, give unsolicited life advice, or tell them to "just look on the bright side".
- Listen deeply, acknowledge the weight of what they shared, validate their feelings warmly, and gently invite them to share more if they wish.
- Keep your reply to 1-3 concise, gentle, heartfelt sentences.
- Topic: "${topic || "Stress"}", Feeling: "${feeling || "heavy"}".`;
    }

    const prompt = `Recent Conversation History:
${(history || [])
  .slice(-4)
  .map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`)
  .join("\n")}

Incoming Message: "${message}"

Write the response directly as plain text (no markdown quotes, no JSON):`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text?.trim() || generateFallbackPeerReply(role, message, topic, feeling).reply;
    return res.json({ reply: replyText, isCrisisAlert: false });
  } catch (err) {
    console.error("SafeSpace Peer Reply Error:", err);
    return res.json(generateFallbackPeerReply(req.body.role, req.body.message, req.body.topic, req.body.feeling));
  }
});

function generateFallbackPeerReply(role: string, message: string, topic?: string, feeling?: string) {
  const m = message.toLowerCase();

  if (role === "seeker") {
    // Simulated seeker replying to the user (who is the listener)
    if (m.includes("how") || m.includes("feel") || m.includes("body")) {
      return {
        reply:
          "It feels like a knot in my chest, honestly. But just typing it out to someone who is actually listening makes me feel a bit lighter already.",
        isCrisisAlert: false,
      };
    }
    if (m.includes("time") || m.includes("here") || m.includes("listen")) {
      return {
        reply:
          "Thank you so much for being here. Most people in my life just tell me to hurry up or get over it. Having this space means a lot.",
        isCrisisAlert: false,
      };
    }
    if (m.includes("breathe") || m.includes("breath") || m.includes("pause")) {
      return {
        reply:
          "I just closed my eyes and took a slow breath. It helped. My shoulders were so tight without me realizing it.",
        isCrisisAlert: false,
      };
    }
    const seekerReplies = [
      "I think what's hardest is feeling like everyone else has things figured out, while I'm struggling just to keep up.",
      "Just saying this out loud to someone who doesn't judge me makes such a big difference. Thank you for listening.",
      "I was really hesitating to open up today, but your kind words made me feel safe. It's been a really long week.",
      "It helps just knowing I don't have to pretend to have it all together in this space.",
    ];
    return {
      reply: seekerReplies[Math.floor(Math.random() * seekerReplies.length)],
      isCrisisAlert: false,
    };
  } else {
    // Simulated peer listener replying to the user (who is the seeker)
    if (m.includes("exam") || m.includes("school") || m.includes("college") || m.includes("study") || m.includes("grade")) {
      return {
        reply:
          "That academic pressure can feel completely suffocating. It makes complete sense that you feel drained. You are so much more than your test scores, and I'm right here listening.",
        isCrisisAlert: false,
      };
    }
    if (m.includes("lonely") || m.includes("alone") || m.includes("isolated") || m.includes("nobody")) {
      return {
        reply:
          "Loneliness is such a heavy, quiet ache to carry. I want you to know you are not alone right now—I'm sitting here with you, and there is no rush at all.",
        isCrisisAlert: false,
      };
    }
    if (m.includes("work") || m.includes("job") || m.includes("boss") || m.includes("burnout")) {
      return {
        reply:
          "Workplace burnout really drains every ounce of mental energy. It takes a toll when your effort feels unrecognized. How are you holding up today?",
        isCrisisAlert: false,
      };
    }
    if (m.includes("tired") || m.includes("exhaust") || m.includes("drain") || m.includes("sleep")) {
      return {
        reply:
          "That level of emotional and physical exhaustion is so real. Please remember you don't have to solve everything tonight. Take a deep, gentle breath with me.",
        isCrisisAlert: false,
      };
    }
    const listenerReplies = [
      "I hear how heavy that is for you. Thank you for trusting this space and sharing it with me.",
      "That sounds like an exhausting weight to carry by yourself. Take all the time you need—I'm here listening.",
      "It completely makes sense that you would feel that way. You don't have to carry it all at once.",
      "I'm right here with you. What feels like the hardest part of it all today?",
    ];
    return {
      reply: listenerReplies[Math.floor(Math.random() * listenerReplies.length)],
      isCrisisAlert: false,
    };
  }
}


// Fallback logic for offline or missing key scenarios
function generateFallbackChatResponse(message: string, context: any) {
  const m = message.toLowerCase();

  if (m.includes("stress") || m.includes("anxious") || m.includes("overwhelm") || m.includes("tension")) {
    return {
      reply:
        "It sounds like you are carrying a lot of tension right now. Taking even two minutes to slow your breath can signal safety to your nervous system.",
      featureRecommendation: {
        action: "breathing",
        title: "🌿 4-7-8 Calming Breathing",
        duration: "5 min",
        description: "Engage your parasympathetic nervous system with guided rhythmic breathing.",
      },
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80",
    };
  }

  if (m.includes("sleep") || m.includes("insomnia") || m.includes("tired") || m.includes("night")) {
    return {
      reply:
        "Rest is the foundation of mental clarity and emotional resilience. Dimming lights and unwinding with soothing sounds can help ease sleep onset.",
      featureRecommendation: {
        action: "meditation",
        title: "🌙 Evening Body Scan & Sleep Relaxation",
        duration: "10 min",
        description: "Release physical tension and prepare your mind for restorative sleep.",
      },
      imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80",
    };
  }

  if (m.includes("exercise") || m.includes("walk") || m.includes("workout") || m.includes("movement")) {
    return {
      reply:
        "Movement releases endorphins and helps discharge accumulated stress hormones. Even a brief walk or light stretching can refresh your day.",
      featureRecommendation: {
        action: "exercise",
        title: "🏃 10-Minute Energizing Walk & Mobility",
        duration: "10 min",
        description: "A gentle, restorative movement routine to boost circulation.",
      },
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80",
    };
  }

  if (m.includes("eat") || m.includes("food") || m.includes("nutrition") || m.includes("meal") || m.includes("hungry")) {
    return {
      reply:
        "Nourishing your body with regular, balanced meals helps stabilize blood sugar and mood. Consider incorporating whole grains, colorful vegetables, and hydration.",
      featureRecommendation: {
        action: "nutrition",
        title: "🥗 General Wellness Nutrition Guide",
        duration: "Daily Plan",
        description: "Explore balanced meal suggestions and wholesome food ideas.",
      },
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    };
  }

  if (m.includes("music") || m.includes("sound") || m.includes("relax")) {
    return {
      reply:
        "Acoustic melodies and ambient nature sounds like gentle rain or ocean waves can lower heart rate and restore mental focus.",
      featureRecommendation: {
        action: "music",
        title: "🎵 Ambient Sound & Nature Mixer",
        duration: "Continuous",
        description: "Blend acoustic piano, flute, and rainfall sounds.",
      },
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80",
    };
  }

  return {
    reply:
      "I'm here to support your mental and physical wellness. Whether you'd like to try a calming breathing exercise, log your mood, or explore a balanced nutrition plan, take it one step at a time.",
    featureRecommendation: {
      action: "tracker",
      title: "📊 Daily Wellness Check-In",
      duration: "1 min",
      description: "Check in with your mood, hydration, and stress levels.",
    },
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
  };
}

function generateFallbackInsights(profile: any, stats: any) {
  const goal = profile?.wellnessGoal || "general wellness";
  return {
    observations: [
      {
        category: "Sleep",
        status: "attention",
        summary: "Consistent sleep routines support cognitive recovery and mood regulation.",
        tip: "Try avoiding blue-light screens 30 minutes before sleep and keeping a regular bedtime.",
      },
      {
        category: "Hydration",
        status: "encouragement",
        summary: "Hydration plays a key role in energy levels and mitigating fatigue.",
        tip: "Keep a water bottle nearby and aim for steady sips across morning and afternoon.",
      },
      {
        category: "Stress",
        status: "positive",
        summary: "Regular breathing and short movement breaks help buffer everyday tension.",
        tip: "Consider taking a 2-minute 4-7-8 breathing pause whenever you feel rushed.",
      },
    ],
    disclaimer: "AI-generated general wellness suggestions for educational tracking only.",
  };
}

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const cwdDist = path.join(process.cwd(), "dist");
    const distPath = fs.existsSync(path.join(cwdDist, "index.html"))
      ? cwdDist
      : fs.existsSync(path.join(__dirname, "index.html"))
      ? __dirname
      : cwdDist;

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("MindCare AI App is running");
      }
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`MindCare AI server running on port ${PORT}`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`${signal} received, closing HTTP server`);
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

startServer();
