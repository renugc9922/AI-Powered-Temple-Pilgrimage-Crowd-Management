
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fast AI responses using gemini-flash-lite
 */
export async function getFastResponse(message: string) {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: message,
      config: {
        systemInstruction: "You are a helpful and quick Kumbh Mela assistant. Provide short, concise answers. Use a polite and spiritual tone when appropriate.",
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
 * Generates a high-quality temple image using gemini-3-pro-image-preview.
 * This model is selected for its capability to handle 1K, 2K, and 4K resolutions.
 */
export async function generateTempleImage(prompt: string, imageSize: "1K" | "2K" | "4K") {
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
          imageSize: imageSize
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        // Correctly find the image part in the response
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    // Explicitly throw API_KEY_ERROR if requested entity not found, as per UI handling
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
}

/**
 * Generates an animated video from an image using the Veo model.
 * Handles the multi-step operation polling and byte retrieval.
 */
export async function generateVeoVideo(imageBase64: string, prompt: string, aspectRatio: '16:9' | '9:16') {
  const ai = getAIClient();
  try {
    // Clean base64 data if it includes a data URL prefix
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this image showing the spiritual atmosphere of Kumbh Mela',
      image: {
        imageBytes: base64Data,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for the long-running video generation operation
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    // Fetch the MP4 bytes from the provided URI, appending the API key as required
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error("Failed to download generated video");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Video generation failed:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
}
