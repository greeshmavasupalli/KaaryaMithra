import { Router } from 'express';
import {
  getReports,
  updateReport,
  getPlatformMetrics,
  getAuditLogs,
  updateUserStatus,
  updateWorkerListingStatus,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

// Protect all admin routes: must be logged in as ADMIN
router.use(protect, authorize(USER_ROLES.ADMIN));

router.get('/reports', getReports);
router.patch('/reports/:id', updateReport);
router.get('/metrics', getPlatformMetrics);
router.get('/audit-logs', getAuditLogs);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/workers/:id/status', updateWorkerListingStatus);

export default router;
