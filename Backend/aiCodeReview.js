const dotenv = require("dotenv");
dotenv.config();

let ai = null;

async function init() {
  if (!ai) {
    const { GoogleGenAI } = await import("@google/genai");
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

async function aiCodeReview(code) {
  await init();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "Analyze the following code and provide a short and concise review of the code. Also, provide a list of potential improvements and suggestions for the code. " +
      code,
  });
  return response.text;
}

module.exports = { aiCodeReview };
