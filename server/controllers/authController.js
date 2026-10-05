import { supabaseAdmin } from '../lib/supabaseClient.js';

/**
 * Get profile information for the authenticated user
 */
export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
      console.warn('[Get Profile Warning]:', error.message);
    }

    return res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: profile?.full_name || req.user.user_metadata?.full_name || 'Farmer Planner',
        created_at: req.user.created_at,
        profile: profile || null
      }
    });
  } catch (error) {
    console.error('[getCurrentUser Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve profile data.'
    });
  }
}
