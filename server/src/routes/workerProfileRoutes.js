import { Router } from 'express';
import {
  getMyWorkerProfile,
  createWorkerProfile,
  updateMyWorkerProfile,
} from '../controllers/workerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.get('/me', protect, authorize(USER_ROLES.WORKER), getMyWorkerProfile);
router.post('/', protect, authorize(USER_ROLES.WORKER), createWorkerProfile);
router.patch('/me', protect, authorize(USER_ROLES.WORKER), updateMyWorkerProfile);

export default router;
