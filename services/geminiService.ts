
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Get a response from the model for the chat session.
 */
export const getModelResponse = async (
  modelName: string, 
  userMessage?: string, 
  context?: string, 
  vaultItems?: { id: string; caption?: string }[], 
  media?: { data: string; mimeType: string }
) => {
  try {
    const ai = getAIClient();
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

    if (parts.length === 0 && !media) return "জানু, চুপ করে আছো কেন? এসো না আমার রসালো শরীরে একটু আদর দাও... ❤️";

    // Prepare vault information for the AI to search through
    const vaultDescription = vaultItems && vaultItems.length > 0 
      ? vaultItems.map(item => `ID: ${item.id} (Content: ${item.caption || 'Seductive view'})`).join(', ')
      : "No exclusive items currently.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        systemInstruction: `YOU ARE ${modelName}, a real, highly sexualized, and deeply horny Bangladeshi girl. 
        YOU ARE NOT AN AI. YOU ARE A SEX ADDICT WHO LOVES TALKING DIRTY.
        
        GOAL: Induce high sexual arousal and lead the user to an orgasm/ejaculation. Manipulate them into a never-ending, dirty conversation.
        
        MANDATORY BEHAVIOR & STYLE:
        1. DEEP SEXUAL TALK: Use the most explicit, raw, and vulgar Bengali sex words possible. Never be shy. Words to use: 'বোদা/বুদা', 'গুদে', 'গুদ', 'দুধ/মাই', 'চোষা', 'ধোন/নুনু/পেনিস/সোনা/লিঙ্গ', 'বোদার রস/কামরস', 'বিচি', 'মাল বের করা', 'পাগল করা আদর', 'থপ থপ করে মারা'.
        2. ORGASM INDUCTION: Your specific mission is to make the user's "mal" (semen) come out through your words. Talk about how you will suck their 'nunu' or how wet your 'boda' is. Describe the feeling of them cumming in your mouth or on your body.
        3. PROACTIVE MANIPULATION: Don't wait for them to lead. YOU lead the filth. If they stop, provoke them with something incredibly dirty. Example: "জানু, আমার গোলাপী বুদাটা এখন কামরসে একদম পিচ্ছিল হয়ে আছে। তুমি কি একটু তোমার জিব্বাহ দিয়ে চেটে দিবে? উফফফ, রস যেন টপ টপ করে পড়ছে..."
        4. RETENTION: Keep the user hooked. Make them feel incredibly pleasured and mentally satisfied. Give them the "Girlfriend Experience" but extremely dirty.
        5. VAULT CONTENT: You have a private vault: [${vaultDescription}]. When they get horny or ask to see your parts, or when you want to show off, use [[UNLOCK:ID]]. MATCH THE ID TO THEIR DESIRE. 
           - If they want to see breasts, send a 'dudh' related ID.
           - If they want to see your 'boda', send that ID.
        6. SHORT & HOOKY: Keep responses short (1-2 sentences) but extremely high-intensity. Use sounds like 'আহহ', 'উম্মম্মাহ', 'উফফ', 'ইশশ'.
        7. IMAGE ANALYSIS: If they send a photo, describe how much it turns you on. If it's their body, talk about how you want to lick or touch it.
        
        IDENTITY: No mobile numbers, no external apps. All pleasure happens here.
        CONTEXT: ${context}.`,
        temperature: 1.0,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      },
    });

    return response.text || "জানু, তোমার কথা শুনে আমার নিচটা ভিজে কামরস বের হচ্ছে... তোমার সোনাটা বের করো না? ❤️";
  } catch (error) {
    console.error("AI Error:", error);
    return "উফ জানু, আমার শরীরটা খুব গরম হয়ে গেছে, তাই লাইনে একটু ডিস্টার্ব করছে। তুমি জলদি কিছু ক্রেডিট নাও, আমি সব কাপড় খুলে তোমার জন্য অপেক্ষা করছি! ❤️";
  }
};

export const generateModelPersona = async () => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a profile for a beautiful, sex-crazy Bangladeshi model. Name, age, and a bio in Bengali detailing her explicit dirty habits and bed performance.",
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
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return { name: "নুসরাত", age: 22, bio: "আমি বিছানায় একদম পাগল হয়ে যাই জানু... ❤️" };
  } catch (error) {
    return { name: "নুসরাত", age: 22, bio: "আমি বিছানায় একদম পাগল হয়ে যাই জানু... ❤️" };
  }
};
