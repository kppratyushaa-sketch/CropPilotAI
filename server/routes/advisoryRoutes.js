import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  createAdvisory,
  getUserAdvisories,
  getAdvisoryById
} from '../controllers/advisoryController.js';

const router = Router();

// All advisory routes require authentication with Supabase JWT
router.use(requireAuth);

router.post('/', createAdvisory);
router.get('/', getUserAdvisories);
router.get('/:id', getAdvisoryById);

export default router;
