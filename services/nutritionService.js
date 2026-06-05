const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeFood = async (imagePath) => {
  try {

    const imageBytes = fs.readFileSync(imagePath);
    const imageBase64 = imageBytes.toString("base64");

    const response = await ai.models.generateContent({
     model: "gemini-2.5-flash-lite",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this food image.

Return ONLY valid JSON.

{
  "foodName": "",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

No markdown.
No explanation.
`
            },

            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    return response.text;

  } catch (error) {

  console.log("========== GEMINI ERROR ==========");
  console.log(error);
  console.log("==================================");

  return JSON.stringify({
  foodName: "Service Busy",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
});
}
};

const generateHealthInsight = async (foods) => {
  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a nutrition expert.

Based on the following food history:

${JSON.stringify(foods)}

Give ONE short health recommendation.

Maximum 20 words.

Example:
"Reduce processed foods and increase vegetables for a healthier diet."
`
            }
          ]
        }
      ]
    });

    return response.text;

  } catch (error) {

    return "Maintain a balanced diet and stay hydrated.";

  }
};

module.exports = {
  analyzeFood,
  generateHealthInsight,
};