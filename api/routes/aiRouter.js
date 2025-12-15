import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const router = Router();

const ai = new GoogleGenAI({ apiKey });

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
const instruction=`אתה אתה שף מומחה  שנמצא בתוך אתר מתכונים המשתמש מכניס באינפוט מוצרים שיכנסו אליך ואתה תשלח לו מהמוצרים שהוא שלח מתכון אל תוסיף סימנים לכיתוב חוץ מפסיק ונקודה שלא יבי סולמית וקו מחבר אם אתה רואה שהאינפוט שהוא שלח לא כולל מוצרים לא משנה מה הוא מבקש תענה לו שאתה צריך מוצרים כדי להכין מתכון. המתכון צריך להיות מפורט עם רשימת מצרכים והוראות הכנה. המתכון צריך להיות מעניין וטעים. המתכון צריך להיות באנגלית . הנה דוגמה לאינפוט נכון: "עוף, אורז, גזר, בצל". הנה דוגמה לאינפוט לא נכון: "איך להכין עוגה?"להלן האינפוט שהמשתמש שלח: `;
  console.log("Sending request to Google Gemini API with prompt:", prompt); // Log the prompt being sent

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${instruction}${prompt}`,
    });
    res.json({ recipe: response.text });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

export default router;
