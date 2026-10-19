import { Router } from 'express';
import { createReport, getMyReports, getReportByTicketId } from '../controllers/reportController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';

const router = Router();

router.post('/', authLimiter, optionalAuth, createReport);
router.get('/mine', protect, getMyReports);
router.get('/track/:ticketId', getReportByTicketId);

export default router;
