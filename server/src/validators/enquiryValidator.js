import { z } from 'zod';
import { ENQUIRY_STATUSES } from '../config/constants.js';

export const createEnquirySchema = z.object({
  workerId: z.string().min(1, 'Worker ID is required'),
  categoryId: z.string().min(1, 'Service category is required'),
  locality: z.string().min(2, 'Customer locality is required').trim(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000).trim(),
  preferredTime: z.string().max(100).optional().default('Flexible / As soon as possible'),
  contactPreference: z.enum(['in_app', 'phone']).default('in_app'),
  customerPhone: z.string().trim().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(Object.values(ENQUIRY_STATUSES)),
  note: z.string().max(300).optional().default(''),
});
