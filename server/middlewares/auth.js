import { supabaseAdmin } from '../lib/supabaseClient.js';

/**
 * Authentication Middleware for Supabase JWT verification
 * Extracts Bearer token from Authorization header and verifies with Supabase Auth
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authorization token provided. Please include Bearer <token> in Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Malformed authorization header.'
      });
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error?.message || 'Invalid or expired session token.'
      });
    }

    // Attach verified user payload to request
    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication verification failure.'
    });
  }
}
