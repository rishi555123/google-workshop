// ============================================================
// GeminiHelper.js
// Gemini AI food freshness analysis.
// Replace VITE_GEMINI_KEY with your actual key in .env:
//   REACT_APP_GEMINI_KEY=your_key_here
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const getClient = () => {
  const key = process.env.REACT_APP_GEMINI_KEY;
  if (!key) {
    console.warn("No Gemini API key found. Set REACT_APP_GEMINI_KEY in .env");
    return null;
  }
  return new GoogleGenerativeAI(key);
};

export const analyzeFoodImage = async (imageFile) => {
  const genAI = getClient();
  if (!genAI) {
    return { name: "", qty: "", freshness: "Manual Entry Required" };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(imageFile);
  });

  const prompt = `ACT AS A FOOD SAFETY INSPECTOR.
Check this image for: Mold, rot, dark spots, decomposition, or shriveled texture.

If you see ANY signs of spoilage, return ONLY this JSON: {"name":"","qty":"","freshness":"Unsafe","reason":"describe spoilage"}.
Otherwise return ONLY raw JSON: {"name":"dish name","qty":number,"freshness":"Safe","reason":""}.

If identification fails, return: {"name":"","qty":"","freshness":"Manual Entry Required","reason":""}.
No markdown, no extra text, no backticks.`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: imageFile.type } },
    ]);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);
    return {
      name: data.name || "",
      qty: data.qty || "",
      freshness: data.freshness || "Manual Entry Required",
      reason: data.reason || "",
    };
  } catch (err) {
    console.error("Gemini error:", err);
    return { name: "", qty: "", freshness: "Manual Entry Required" };
  }
};