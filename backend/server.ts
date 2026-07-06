import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { readDB, writeDB } from "./db";
import { initGemini } from "./gemini";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// APIs
app.get("/api/loans", async (req, res) => {
  const db = await readDB();
  res.json(db.loans);
});

app.post("/api/loans", async (req, res) => {
  const db = await readDB();
  const newLoan = { id: Date.now().toString(), ...req.body };
  db.loans.push(newLoan);
  await writeDB(db);
  res.json(newLoan);
});

app.delete("/api/loans/:id", async (req, res) => {
  const db = await readDB();
  db.loans = db.loans.filter((l: any) => l.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const gemini = initGemini();
    if (!gemini) return res.status(500).json({ error: "Gemini API key not configured" });

    const { message, history, context } = req.body;
    
    const systemInstruction = `You are a helpful, empathetic financial advisor helping a user with severe debt. 
    User context: ${JSON.stringify(context)}. 
    Provide actionable, realistic advice on debt settlement, hardship programs, and budgeting. Keep responses concise and supportive.`;

    const chat = gemini.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
    });

    let responseText = "";
    if (history && history.length > 0) {
       const formattedHistory = history.map((h: any) => `${h.role}: ${h.text}`).join('\n');
       const prompt = `Previous conversation:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;
       const response = await gemini.models.generateContent({
         model: "gemini-3.5-flash",
         contents: prompt,
         config: { systemInstruction }
       });
       responseText = response.text;
    } else {
       const response = await chat.sendMessage({ message });
       responseText = response.text;
    }

    res.json({ text: responseText });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate-letter", async (req, res) => {
  try {
    const gemini = initGemini();
    if (!gemini) return res.status(500).json({ error: "Gemini API key not configured" });

    const { type, creditor, amount, hardshipReason, tone = 'Formal' } = req.body;
    
    const prompt = `Draft a professional ${type} letter to a creditor. 
    Tone: ${tone}
    Creditor Name: ${creditor}
    Outstanding Balance: ${amount}
    Reason for Hardship: ${hardshipReason}
    
    The letter should be structured, clearly state the financial hardship, and make a reasonable request for settlement, forbearance, or lower interest depending on the type. Do not include placeholders like [Your Name] unless absolutely necessary. Return the plain text response without markdown formatting if possible.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ letter: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for Development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
