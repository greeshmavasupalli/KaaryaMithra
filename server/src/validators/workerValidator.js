import { z } from 'zod';
import { PROFILE_STATUSES } from '../config/constants.js';

export const workerProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(60).trim(),
  categories: z.array(z.string()).min(1, 'Please select at least one primary service category'),
  skills: z.array(z.string()).min(1, 'Please list at least one specific skill'),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional().default(''),
  experienceYears: z.coerce.number().min(0).max(60).optional().default(0),
  locality: z.string().min(2, 'Locality is required').trim(),
  districtCity: z.string().min(2, 'District / City is required').trim(),
  state: z.string().trim().default('Andhra Pradesh'),
  serviceRadius: z.coerce.number().min(1).max(100).optional().default(10),
  approximateCoordinates: z
    .object({
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
    })
    .optional(),
  indicativePriceMin: z.coerce.number().min(0).nullable().optional(),
  indicativePriceMax: z.coerce.number().min(0).nullable().optional(),
  languages: z.array(z.string()).default(['Telugu', 'Hindi']),
  availability: z.enum(['available', 'busy', 'away']).default('available'),
  contactPreference: z.enum(['in_app', 'phone_on_acceptance']).default('in_app'),
  contactVisibility: z.enum(['accepted_enquiries_only', 'private']).default('accepted_enquiries_only'),
  profileStatus: z
    .enum([
      PROFILE_STATUSES.DRAFT,
      PROFILE_STATUSES.PUBLISHED,
      PROFILE_STATUSES.DEACTIVATED,
      PROFILE_STATUSES.REMOVAL_REQUESTED,
    ])
    .default(PROFILE_STATUSES.PUBLISHED),
});

export const workerQuerySchema = z.object({
  service: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  availability: z.enum(['available', 'busy', 'away']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  trustLabel: z.enum(['phone_confirmed', 'community_reference', 'skill_evidence']).optional(),
  language: z.string().optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'rating']).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
