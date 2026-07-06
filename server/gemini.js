require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function analyzePDF(text) {

    const prompt = `
You are an AI that converts study material into a knowledge graph.

Return ONLY valid JSON.

Format:

{
  "title": "",
  "concepts": [
    {
      "id": 1,
      "name": "",
      "summary": "",
      "related": [2,3]
    }
  ]
}

Rules:
- Return only JSON.
- No markdown.
- No explanation.
- Maximum 20 concepts.
- "related" must contain concept IDs, not names.

Document:

${text.substring(0, 8000)}
`;

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });

            return response.text;

        } catch (err) {

            if (err.status === 503 && attempt < 3) {

                console.log(`Gemini busy. Retry ${attempt}/3`);

                await new Promise(resolve => setTimeout(resolve, 3000));

            } else {

                throw err;

            }

        }

    }

}

module.exports = analyzePDF;