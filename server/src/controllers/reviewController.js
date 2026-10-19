import { Review } from '../models/Review.js';
import { Enquiry } from '../models/Enquiry.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { createReviewSchema } from '../validators/reviewValidator.js';
import { ENQUIRY_STATUSES } from '../config/constants.js';

export const createReview = async (req, res, next) => {
  try {
    const validated = createReviewSchema.parse(req.body);

    const enquiry = await Enquiry.findById(validated.enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Associated service enquiry not found.',
      });
    }

    // Ownership check: must be customer who sent the enquiry
    if (enquiry.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the customer who placed this enquiry can submit feedback.',
      });
    }

    // Eligibility check: enquiry must be Accepted or Completed
    if (![ENQUIRY_STATUSES.COMPLETED, ENQUIRY_STATUSES.ACCEPTED].includes(enquiry.status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed or accepted service enquiries.',
      });
    }

    // Single review constraint
    const existingReview = await Review.findOne({ enquiryId: enquiry._id });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'Feedback has already been submitted for this enquiry.',
      });
    }

    const review = await Review.create({
      enquiryId: enquiry._id,
      customerId: req.user._id,
      workerId: enquiry.workerId,
      rating: validated.rating,
      comment: validated.comment,
      moderationStatus: 'approved',
    });

    // Update worker average rating and count
    const approvedReviews = await Review.find({
      workerId: enquiry.workerId,
      moderationStatus: 'approved',
    });

    const totalScore = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = approvedReviews.length > 0 ? Number((totalScore / approvedReviews.length).toFixed(1)) : 0;

    await WorkerProfile.findByIdAndUpdate(enquiry.workerId, {
      averageRating: avg,
      reviewCount: approvedReviews.length,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerReviews = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const reviews = await Review.find({
      workerId,
      moderationStatus: 'approved',
    })
      .populate('customerId', 'displayName')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
