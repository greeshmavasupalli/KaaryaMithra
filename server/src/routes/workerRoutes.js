import { Router } from 'express';
import {
  getWorkers,
  getWorkerByIdOrSlug,
  getMyWorkerProfile,
  createWorkerProfile,
  updateMyWorkerProfile,
} from '../controllers/workerController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

// Public discovery routes
router.get('/', getWorkers);
router.get('/me', protect, authorize(USER_ROLES.WORKER), getMyWorkerProfile);
router.post('/me', protect, authorize(USER_ROLES.WORKER), createWorkerProfile);
router.patch('/me', protect, authorize(USER_ROLES.WORKER), updateMyWorkerProfile);
router.get('/:id', optionalAuth, getWorkerByIdOrSlug);

export default router;
