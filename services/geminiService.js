const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const identifyFood = async () => {
  try {
    const result = await model.generateContent(
      "Tell me only the name of a popular food item. Return only food name."
    );

    return result.response.text();

  } catch (error) {
    console.log(error);
    return "Unknown Food";
  }
};

module.exports = {
  identifyFood,
};