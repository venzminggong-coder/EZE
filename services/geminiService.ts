import { GoogleGenAI, Type } from "@google/genai";

/**
 * Generates an AI-powered explanation for a quiz question using Gemini.
 */
export const generateExplanation = async (question: string, answer: string, context: string): Promise<string> => {
  // Creating a new instance ensures it uses the environment key injected by GCP at runtime
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Context: Disaster preparedness education for the Philippines.
      Question: ${question}
      Correct Answer: ${answer}
      Additional Topic Detail: ${context}
      
      ACT AS A HELPFUL FIREMAN INSTRUCTOR. Provide a concise, friendly explanation (max 2 sentences) of why this is the correct answer. Focus on the life-saving principle.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Safety first! That was the correct life-saving choice.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep your spirits up! Even in a drill, learning from every choice is key to readiness.";
  }
};

/**
 * Generates a daily trivia question about disaster safety in the Philippines.
 */
export const generateDailyTrivia = async (): Promise<{question: string, choices: string[], correctIndex: number, explanation: string} | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a single multiple-choice trivia question about disaster history or safety in the Philippines.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ["question", "choices", "correctIndex", "explanation"],
                }
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text.trim());
    } catch (e) {
        console.error("Failed to generate trivia", e);
        return null;
    }
}
