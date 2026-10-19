import { z } from 'zod';
import { USER_ROLES } from '../config/constants.js';

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([USER_ROLES.CUSTOMER, USER_ROLES.WORKER]).default(USER_ROLES.CUSTOMER),
  phone: z.string().trim().optional(),
  otp: z.string().trim().optional(),
  preferredLanguage: z.enum(['en', 'hi', 'te']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const updateMeSchema = z.object({
  displayName: z.string().min(2).max(60).trim().optional(),
  preferredLanguage: z.enum(['en', 'hi', 'te']).optional(),
  phone: z.string().trim().optional(),
  otp: z.string().trim().optional(),
});
