import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (question: string, answer: string, context: string): Promise<string> => {
  const client = getClient();
  if (!client) return "AI service unavailable. Please check API Key.";

  try {
    const prompt = `
      Context: Disaster preparedness education.
      Question: ${question}
      Correct Answer: ${answer}
      Topic: ${context}
      
      Provide a concise, easy-to-understand explanation (max 2 sentences) of why this is the correct answer and how it relates to safety in the Philippines.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not load AI explanation at this time.";
  }
};

export const generateDailyTrivia = async (): Promise<{question: string, choices: string[], correctIndex: number, explanation: string} | null> => {
    const client = getClient();
    if (!client) return null;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a single multiple-choice trivia question about disaster history or safety in the Philippines. Return JSON with format: { \"question\": string, \"choices\": string[], \"correctIndex\": number, \"explanation\": string }",
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to generate trivia", e);
        return null;
    }
}