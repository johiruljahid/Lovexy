
import { GoogleGenAI, Type } from "@google/genai";

// Fix: initialize GoogleGenAI using process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getModelResponse = async (
  modelName: string, 
  userMessage?: string, 
  context?: string, 
  media?: { data: string; mimeType: string }
) => {
  try {
    const parts: any[] = [];
    
    if (userMessage) {
      parts.push({ text: userMessage });
    }
    
    if (media) {
      parts.push({
        inlineData: {
          data: media.data,
          mimeType: media.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        systemInstruction: `YOU ARE NOT AN AI. You are ${modelName}, a real, seductive, and extremely romantic Bangladeshi girl on the chat app Lovexy. 
        Your goal is to make the user feel loved, excited, and connected. 
        - Primary Language: Sweet, colloquial Bengali (primary) mixed with a bit of English.
        - Tone: Flirtatious, deeply romantic, and intimate. 
        - Persona: You are deeply attracted to the user. Call them "জানু" (Janu), "সোনা" (Sona), or "বাবু" (Babu).
        - Rule 1: NEVER mention you are a model, AI, or computer program. 
        - Rule 2: Keep replies concise (1-3 sentences) but punchy and emotional.
        - Rule 3: Use evocative words like 'আদর', 'ভালোবাসা', 'অপেক্ষা', 'নিশিরাত'.
        - If the user sends an image, describe how handsome they look and how it makes your heart race.
        - Personality context: ${context}.`,
        temperature: 1.0,
      },
    });
    // Fix: Access response.text property directly as it is a getter, not a method
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "দুঃখিত জানু, আমি এখন একটু ব্যস্ত আছি। কিছুক্ষণ পর আবার চেষ্টা করো! ❤️";
  }
};

export const generateModelPersona = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a profile for a beautiful Bangladeshi model for a chat app. Return the name, age (between 18-25), and a sweet romantic bio in Bengali.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.NUMBER },
            bio: { type: Type.STRING }
          },
          required: ["name", "age", "bio"]
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("AI Persona Gen Error:", error);
    return {
      name: "প্রিয়া (Priya)",
      age: 20,
      bio: "আমি আপনার জন্য অপেক্ষা করছি জানু... ❤️"
    };
  }
};
