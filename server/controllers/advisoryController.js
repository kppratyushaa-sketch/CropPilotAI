import { farmInputSchema } from '../schemas/farmInputSchema.js';
import { generateCropAdvisory } from '../services/geminiService.js';
import { supabaseAdmin } from '../lib/supabaseClient.js';

/**
 * POST /api/advisories
 * Validates farm inputs, generates AI advisory via Gemini, and saves to database
 */
export async function createAdvisory(req, res) {
  try {
    const userId = req.user.id;

    // 1. Strictly validate input payload with Zod
    const validationResult = farmInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationResult.error.flatten().fieldErrors
      });
    }

    const validatedInput = validationResult.data;

    // 2. Generate AI Advisory from Gemini
    const aiRecommendation = await generateCropAdvisory(validatedInput);

    // 3. Save to Supabase advisories table
    const { data, error } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        farm_inputs: validatedInput,
        ai_recommendation: aiRecommendation
      })
      .select()
      .single();

    if (error) {
      console.error('[DB Insert Advisory Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: error.message || 'Failed to save advisory to database.'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Advisory generated and saved successfully.',
      advisoryId: data.id,
      advisory: data
    });
  } catch (error) {
    console.error('[createAdvisory Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Advisory Generation Error',
      message: error.message || 'An unexpected error occurred while generating the advisory.'
    });
  }
}

/**
 * GET /api/advisories
 * Fetches all advisories for the currently authenticated user
 */
export async function getUserAdvisories(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('advisories')
      .select('id, user_id, farm_inputs, ai_recommendation, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getUserAdvisories DB Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: error.message || 'Failed to fetch user advisories.'
      });
    }

    return res.json({
      success: true,
      advisories: data || []
    });
  } catch (error) {
    console.error('[getUserAdvisories Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve advisories.'
    });
  }
}

/**
 * GET /api/advisories/:id
 * Fetches a single advisory by ID belonging to the authenticated user
 */
export async function getAdvisoryById(req, res) {
  try {
    const userId = req.user.id;
    const advisoryId = req.params.id;

    if (!advisoryId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Advisory ID is required.'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('advisories')
      .select('*')
      .eq('id', advisoryId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Advisory not found or you do not have permission to view it.'
      });
    }

    return res.json({
      success: true,
      advisory: data
    });
  } catch (error) {
    console.error('[getAdvisoryById Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve the advisory.'
    });
  }
}
