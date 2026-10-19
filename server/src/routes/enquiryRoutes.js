import { Router } from 'express';
import {
  createEnquiry,
  getMyEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
} from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.post('/', protect, authorize(USER_ROLES.CUSTOMER), createEnquiry);
router.get('/mine', protect, getMyEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id/status', protect, updateEnquiryStatus);

export default router;
