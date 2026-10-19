import { Router } from 'express';
import { getCategories, createCategory, toggleCategoryStatus } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, authorize(USER_ROLES.ADMIN), createCategory);
router.patch('/:id/toggle', protect, authorize(USER_ROLES.ADMIN), toggleCategoryStatus);

export default router;
