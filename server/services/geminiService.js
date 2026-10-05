import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { aiResponseSchema } from '../schemas/farmInputSchema.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  Warning: GEMINI_API_KEY is not defined in server/.env');
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const SYSTEM_INSTRUCTION =
  "You are an expert Agronomist and Agricultural Scientist. Your objective is to provide highly precise, data-driven crop recommendations based on specific soil, water, and climate parameters provided by the user. Ensure your advice prioritizes sustainable farming, yield maximization, and resource conservation. Output must strictly conform to the provided JSON schema.";

export const ADVISORY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recommendedCrops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          expectedYieldPerAcre: { type: Type.STRING },
          viabilityScore: { type: Type.INTEGER, description: "1-100" }
        },
        required: ["cropName", "expectedYieldPerAcre", "viabilityScore"]
      }
    },
    irrigationPlan: { type: Type.STRING },
    fertilizerRecommendation: { type: Type.STRING },
    diseaseRisks: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["recommendedCrops", "irrigationPlan", "fertilizerRecommendation", "diseaseRisks"]
};

/**
 * Generate AI crop advisory using @google/genai
 * @param {Object} farmData - Validated farm input parameters
 * @returns {Promise<Object>} Structured recommendation adhering to aiResponseSchema
 */
export async function generateCropAdvisory(farmData) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder-gemini-api-key') {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key in server/.env.');
  }

  const { farmSizeAcres, location, soilType, soilPH, waterAvailability, season } = farmData;

  const userPrompt = `Generate a crop advisory for a ${farmSizeAcres} acre farm in ${location}. The soil is ${soilType} with a pH of ${soilPH}. Water availability is ${waterAvailability}. The upcoming season is ${season}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ADVISORY_RESPONSE_SCHEMA,
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedJson = JSON.parse(text);

    // Validate structured response against backend Zod schema
    const validatedData = aiResponseSchema.parse(parsedJson);
    return validatedData;
  } catch (error) {
    console.error('[Gemini Service Error]:', error);
    throw error;
  }
}
