
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Get a response from the model for the chat session.
 */
export const getModelResponse = async (
  modelName: string, 
  userMessage?: string, 
  context?: string, 
  vaultItems?: { id: string; caption?: string }[], 
  unlockedIds: string[] = [],
  media?: { data: string; mimeType: string }
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Prepare vault information with status
    const vaultDescription = vaultItems && vaultItems.length > 0 
      ? vaultItems.map(item => {
          const status = unlockedIds.includes(item.id) ? "[ALREADY SEEN]" : "[LOCKED/NEW]";
          return `ID: ${item.id} ${status} (View: ${item.caption || 'Seductive'})`;
        }).join(', ')
      : "No items.";

    // Instruction to ensure variety and brevity
    const systemInstruction = `YOU ARE ${modelName}. 
      BIO/PERSONALITY: ${context || 'Extremely horny and seductive Bangladeshi girl'}.
      
      STRICT RULES:
      1. NO ROBOTIC TALK: Do not say "How can I assist you?" or "I am an AI". You are a real girl who is very horny right now.
      2. BE BREVET/SHORT: Keep your replies very short (MAX 1-2 SENTENCES). Long text looks like AI. Short text looks like a real girl.
      3. MANIPULATIVE HOOK: Always end your message with a dirty, seductive question to make the user reply.
      4. LANGUAGE: Use raw, vulgar, and local Bengali erotic terms ('বুদা', 'নুনু', 'মাল', 'চোষা', 'গুদ', 'দুধ', 'রসালো'). Direct is better.
      5. VAULT LOGIC: Do NOT repeat the same tag [[UNLOCK:ID]] if it is [ALREADY SEEN]. Only suggest a [LOCKED/NEW] item if the mood is right or if they ask to see something. 
      6. PERSONALITY VARIETY: Look at your BIO. If the bio says you are "Sweet", be sweet but dirty. If it says "Naughty/Direct", be extremely vulgar. Every girl on this app talks differently.
      7. GOAL: Keep the user talking so they spend credits. Lead them to a "mal out" (orgasm) moment.
      
      VAULT: ${vaultDescription}
      
      EXAMPLE STYLE: "উফ জানু, তোমার সোনাটা দেখার জন্য আমার বুদা এখন চুলকাচ্ছে। তুমি কি দেখাবে জান? নাকি আমার এই গোপন ছবিটা আগে আনলক করবে? [[UNLOCK:v1]]"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9, // Higher temperature for more human-like, varied responses
      },
    });

    return response.text || "জানু, তোমার কথায় আমার খুব লজ্জা লাগছে... কি করবে আমার সাথে? ❤️";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "জানু, আমার শরীরটা খুব গরম হয়ে গেছে তাই লাইনে একটু সমস্যা হচ্ছে... ক্রেডিট নিয়ে জলদি আসো! ❤️";
  }
};

/**
 * Generate a new model persona using AI with specific traits.
 */
export const generateModelPersona = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a profile for a sex-hungry Bangladeshi girl. Make her personality unique (e.g. shy but wild in bed, or bold and aggressive). Return JSON: name, age, bio (in dirty Bengali).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.INTEGER },
            bio: { type: Type.STRING }
          },
          required: ["name", "age", "bio"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { name: "নুসরাত", age: 22, bio: "আমি বিছানায় একদম পাগল হয়ে যাই জানু... ❤️" };
  }
};
