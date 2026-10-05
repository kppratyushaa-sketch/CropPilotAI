import { z } from 'zod';

export const soilTypeEnum = ["Clay", "Sandy", "Loamy", "Peat", "Chalky"] as const;
export const waterAvailabilityEnum = ["High", "Moderate", "Low/Rain-dependent"] as const;

export const farmInputSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters (e.g. 'Punjab, India' or 'Midwest, USA')"),
  soilType: z.enum(soilTypeEnum, {
    errorMap: () => ({ message: "Please select a valid soil type" })
  }),
  soilPH: z.coerce.number()
    .min(1.0, "Soil pH must be at least 1.0")
    .max(14.0, "Soil pH cannot exceed 14.0"),
  waterAvailability: z.enum(waterAvailabilityEnum, {
    errorMap: () => ({ message: "Please select water availability" })
  }),
  season: z.string().min(3, "Season must be at least 3 characters (e.g. Summer, Monsoon, Winter)"),
  farmSizeAcres: z.coerce.number()
    .positive("Farm size must be greater than 0 acres")
});

export type FarmInput = z.infer<typeof farmInputSchema>;

export interface RecommendedCrop {
  cropName: string;
  expectedYieldPerAcre: string;
  viabilityScore: number;
}

export interface AIRecommendation {
  recommendedCrops: RecommendedCrop[];
  irrigationPlan: string;
  fertilizerRecommendation: string;
  diseaseRisks: string[];
}

export interface AdvisoryRecord {
  id: string;
  user_id: string;
  farm_inputs: FarmInput;
  ai_recommendation: AIRecommendation;
  created_at: string;
}
