
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCrowdAnalysis(currentData: any[]) {
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
      model: 'gemini-3-flash-preview',
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}
