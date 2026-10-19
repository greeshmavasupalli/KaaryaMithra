import { Router } from 'express';
import { createReview, getWorkerReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.post('/', protect, authorize(USER_ROLES.CUSTOMER), createReview);
router.get('/worker/:workerId', getWorkerReviews);

export default router;
