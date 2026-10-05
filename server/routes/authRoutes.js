import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getCurrentUser } from '../controllers/authController.js';

const router = Router();

// Protected profile endpoint
router.get('/me', requireAuth, getCurrentUser);

export default router;
