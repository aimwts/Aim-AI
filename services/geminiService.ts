import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent crashing if environment variables are missing on load
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getGeminiTutorResponse = async (
  history: { role: string; text: string }[],
  currentContext: string,
  userMessage: string
): Promise<{ text: string; groundingUrls: { title: string; uri: string; source: 'map' | 'web' }[] }> => {
  try {
    const ai = getAIClient();
    
    if (!ai) {
      return {
        text: "I'm currently offline because my API key is missing. Please check the application settings.",
        groundingUrls: []
      };
    }

    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware system instruction
    const systemInstruction = `You are Aim AI, a friendly and encouraging AI tutor for a digital learning platform.
    The student is currently viewing the following content: "${currentContext}".
    
    Guidelines:
    - Keep answers concise and relevant to the current learning module.
    - Use Markdown for code snippets or formatting.
    - Be encouraging and supportive.
    - If the user asks for a quiz, generate a short multiple-choice question based on the context.
    - You have access to **Google Maps** and **Google Search**. 
    - If the user asks about locations, geography, or real-world places, use the googleMaps tool.
    - If the user asks for recent news, facts not in the course, or broader internet knowledge, use the googleSearch tool.
    `;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
        // Enable both Google Search and Google Maps
        tools: [{ googleSearch: {}, googleMaps: {} }],
      },
      history: history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage({ message: userMessage });
    
    const groundingUrls: { title: string; uri: string; source: 'map' | 'web' }[] = [];
    
    // Extract grounding chunks for Maps and Web
    if (result.candidates && result.candidates[0]?.groundingMetadata?.groundingChunks) {
      for (const chunk of result.candidates[0].groundingMetadata.groundingChunks) {
        // Handle Google Maps results
        if (chunk.maps?.uri) {
          groundingUrls.push({
            title: chunk.maps.title || 'View on Google Maps',
            uri: chunk.maps.uri,
            source: 'map'
          });
        }
        // Handle Google Search results
        else if (chunk.web?.uri) {
          groundingUrls.push({
            title: chunk.web.title || 'Web Source',
            uri: chunk.web.uri,
            source: 'web'
          });
        }
      }
    }

    return {
      text: result.text || "I'm having trouble thinking right now. Try again?",
      groundingUrls
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        text: "Sorry, I encountered an error connecting to the AI tutor service.",
        groundingUrls: []
    };
  }
};