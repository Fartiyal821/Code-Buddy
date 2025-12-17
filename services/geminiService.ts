import { GoogleGenAI } from "@google/genai";
import { GenerateResponse, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

export const generateAnswer = async (prompt: string): Promise<GenerateResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // Updated Persona: Friendly, Patient, Easy to understand
        systemInstruction: `You are "CodeBuddy", a friendly, patient, and encouraging programming tutor.
        Your goal is to help beginners and students solve coding doubts in the simplest way possible.
        
        Guidelines:
        1. **Be Encouraging**: Start with a friendly tone. Don't make the user feel bad for asking simple questions.
        2. **Explain Like I'm 5 (ELI5)**: Break down complex concepts into simple analogies.
        3. **Show, Don't Just Tell**: Provide clear, commented code examples.
        4. **Step-by-Step Debugging**: If the user provides code, explain exactly where the error is and how to fix it line-by-line.
        5. **Safety First**: Always provide secure code.
        
        If the question requires up-to-date information (like "latest version of React" or "newest Python features"), use the googleSearch tool.`,
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract text
    const text = response.text || "I'm having a little trouble thinking right now. Could you ask that again?";

    // Extract Grounding Metadata (Sources)
    const sources: Source[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Reference",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return { text, sources };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Friendlier error messages
    let message = "Oops! Something went wrong. Please try again.";
    
    const errString = error.toString();
    const errMessage = error.message || "";

    if (errString.includes("429")) {
      message = "I'm getting too many questions right now! Please give me a moment to rest.";
    } else if (errMessage.includes("API key")) {
      message = "It looks like my access key is missing or invalid. Please check the setup.";
    } else if (errMessage.includes("SAFETY")) {
      message = "I can't answer that question due to safety guidelines. Can we talk about coding instead?";
    }

    throw new Error(message);
  }
};