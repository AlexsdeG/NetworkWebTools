import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as scanController from '../controllers/scanController.js';
import * as ipController from '../controllers/ipController.js';
import * as smtpController from '../controllers/smtpController.js';
import { scanLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Alle Tool-Routes sind geschützt
// Fix: Cast requireAuth to any
router.use(requireAuth as any);

// Port Scanner Route
// Extra strenges Rate-Limiting für Scans
router.post('/scan-ports', scanLimiter as any, scanController.scanPorts as any);

// IP Metadata Route
router.get('/my-ip', ipController.getMyIp as any);

// SMTP Tester Route
router.post('/test-smtp', smtpController.testSmtp as any);

export default router;