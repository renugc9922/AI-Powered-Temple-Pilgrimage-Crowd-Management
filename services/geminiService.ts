
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fast AI responses using gemini-flash-lite
 */
export async function getFastResponse(message: string) {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      // Use 'gemini-flash-lite-latest' as per guidelines for flash lite models
      model: 'gemini-flash-lite-latest',
      contents: message,
      config: {
        systemInstruction: "You are a helpful and quick Kumbh Mela assistant. Provide short, concise answers.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Fast AI failed:", error);
    return "I'm having trouble responding quickly right now.";
  }
}

/**
 * Search-grounded information for up-to-date news and events
 */
export async function getSearchGroundedInfo(query: string) {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search grounding failed:", error);
    return null;
  }
}

/**
 * Veo Video Generation: Animates a photo
 */
export async function generateVeoVideo(base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
  const ai = getAIClient();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this spiritual temple scene with cinematic movement and divine atmosphere',
      image: {
        imageBytes: base64Image.split(',')[1] || base64Image,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Veo generation failed:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
}

/**
 * Uses Gemini to analyze crowd data and provide safety recommendations.
 */
export async function getCrowdAnalysis(currentData: any[]) {
  const ai = getAIClient();
  const prompt = `
    Analyze the following temple crowd data and provide actionable recommendations for security and management.
    Identify high-risk zones and predict potential bottlenecks.
    
    Data: ${JSON.stringify(currentData)}
    
    Return a JSON response with:
    - criticalAlerts (array of strings)
    - flowRecommendations (array of strings)
    - safetyRating (0-100)
    - predictedRiskTrend (string)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            flowRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyRating: { type: Type.NUMBER },
            predictedRiskTrend: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse((response.text || '{}').trim());
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

/**
 * Generates imagery using gemini-3-pro-image-preview.
 */
export async function generateTempleImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
}
