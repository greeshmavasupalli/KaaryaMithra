import { z } from 'zod';

export const createReviewSchema = z.object({
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  rating: z.coerce.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  comment: z
    .string()
    .min(3, 'Feedback comment must be at least 3 characters')
    .max(600, 'Feedback comment cannot exceed 600 characters')
    .trim(),
});
