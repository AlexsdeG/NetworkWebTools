import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public Routes
// Fix: Cast handler to any to avoid strict RequestHandler type mismatch
router.post('/login', authController.login as any);

// Protected Routes (zum Testen der Gültigkeit)
// Fix: Cast handlers to any to avoid type mismatch
router.get('/verify', requireAuth as any, authController.verify as any);

export default router;