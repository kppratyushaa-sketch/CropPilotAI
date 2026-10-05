import { z } from 'zod';

export const soilTypeEnum = ["Clay", "Sandy", "Loamy", "Peat", "Chalky"];
export const waterAvailabilityEnum = ["High", "Moderate", "Low/Rain-dependent"];

export const farmInputSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
  soilType: z.enum(soilTypeEnum, {
    errorMap: () => ({ message: "Soil type must be Clay, Sandy, Loamy, Peat, or Chalky" })
  }),
  soilPH: z.coerce.number()
    .min(1.0, "Soil pH must be at least 1.0")
    .max(14.0, "Soil pH cannot exceed 14.0"),
  waterAvailability: z.enum(waterAvailabilityEnum, {
    errorMap: () => ({ message: "Water availability must be High, Moderate, or Low/Rain-dependent" })
  }),
  season: z.string().min(3, "Season must be at least 3 characters"),
  farmSizeAcres: z.coerce.number()
    .positive("Farm size must be a positive number")
});

export const aiResponseSchema = z.object({
  recommendedCrops: z.array(
    z.object({
      cropName: z.string(),
      expectedYieldPerAcre: z.string(),
      viabilityScore: z.number().int().min(1).max(100)
    })
  ).min(1),
  irrigationPlan: z.string().min(10),
  fertilizerRecommendation: z.string().min(10),
  diseaseRisks: z.array(z.string()).min(1)
});
