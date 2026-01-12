
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI using process.env.API_KEY and following naming conventions.
/**
 * Generates an AI-powered explanation for a quiz question using Gemini.
 * A new instance is created per call to ensure it uses the most up-to-date API key.
 */
export const generateExplanation = async (question: string, answer: string, context: string): Promise<string> => {
  // Use process.env.API_KEY directly as per @google/genai coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Context: Disaster preparedness education.
      Question: ${question}
      Correct Answer: ${answer}
      Topic: ${context}
      
      Provide a concise, easy-to-understand explanation (max 2 sentences) of why this is the correct answer and how it relates to safety in the Philippines.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // response.text is a property, not a method.
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not load AI explanation at this time.";
  }
};

// Fix: Adhering to JSON response guidelines by using responseSchema and the Type enum from @google/genai.
/**
 * Generates a daily trivia question about disaster safety in the Philippines.
 */
export const generateDailyTrivia = async (): Promise<{question: string, choices: string[], correctIndex: number, explanation: string} | null> => {
    // Use process.env.API_KEY directly as per @google/genai coding guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a single multiple-choice trivia question about disaster history or safety in the Philippines.",
            config: {
                responseMimeType: "application/json",
                // Using responseSchema for reliable JSON output.
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                    },
                    choices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING,
                      },
                    },
                    correctIndex: {
                      type: Type.INTEGER,
                    },
                    explanation: {
                      type: Type.STRING,
                    },
                  },
                  required: ["question", "choices", "correctIndex", "explanation"],
                }
            }
        });
        
        const text = response.text;
        if (!text) return null;
        // Trim and parse the JSON response.
        return JSON.parse(text.trim());
    } catch (e) {
        console.error("Failed to generate trivia", e);
        return null;
    }
}
