import { GoogleGenerativeAI } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");



export const analyzeFoodImage = async (imageFile) => {

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  

  const base64Data = await new Promise((resolve) => {

    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result.split(',')[1]);

    reader.readAsDataURL(imageFile);

  });



  // STRICT SAFETY PROMPT: Instructs AI to act as a safety inspector

  const prompt = `ACT AS A FOOD SAFETY INSPECTOR. 

  Check this image for: Mold, rot, dark spots, decomposition, or shriveled texture.

  

  If you see ANY signs of spoilage, return "Unsafe" for freshness and "" for name/qty.

  Otherwise, return ONLY raw JSON: 

  {"name": "dish name", "qty": number, "freshness": "Safe", "reason": ""}. 

  

  If identification fails, return "" for name and qty. No markdown, no extra text.`;



  try {

    const result = await model.generateContent([

      prompt,

      { inlineData: { data: base64Data, mimeType: imageFile.type } }

    ]);

    

    const textResponse = result.response.text().replace(/```json|```/g, "").trim();

    const data = JSON.parse(textResponse);



    return {

      name: data.name || "",

      qty: data.qty || "",

      freshness: data.freshness || "Manual Entry Required",

      reason: data.reason || "" // Helpful for explaining why it was rejected

    };



  } catch (error) {

    console.error("Gemini Analysis Error:", error);

    return { name: "", qty: "", freshness: "Manual Entry Required" };

  }

};



export const parseVoiceCommand = async (transcript) => {

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Extract JSON from: "${transcript}". Format: {"name": "food", "qty": count}. If unknown, use "". No extra text.`;

  

  try {

    const result = await model.generateContent(prompt);

    const textResponse = result.response.text().replace(/```json|```/g, "").trim();

    return JSON.parse(textResponse);

  } catch (error) {

    return { name: "", qty: "" };

  }

};