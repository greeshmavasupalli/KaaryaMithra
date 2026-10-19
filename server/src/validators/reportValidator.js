import { z } from 'zod';
import { REPORT_STATUSES, TARGET_TYPES } from '../config/constants.js';

export const createReportSchema = z.object({
  targetType: z.enum(Object.values(TARGET_TYPES)),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.enum([
    'inappropriate_content',
    'misleading_info',
    'harassment_or_abuse',
    'suspicious_or_fraud',
    'unreachable_or_fake',
    'other',
  ]),
  details: z.string().max(1000).optional().default(''),
  blocked: z.boolean().optional().default(false),
  urgency: z.enum(['emergency', 'high', 'medium', 'low']).optional().default('medium'),
});

export const updateReportSchema = z.object({
  status: z.enum(Object.values(REPORT_STATUSES)),
  adminNotes: z.string().max(1000).optional().default(''),
  actionTaken: z.enum(['none', 'hide_content', 'suspend_user']).optional().default('none'),
});
