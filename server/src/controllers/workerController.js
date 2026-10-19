import { WorkerProfile } from '../models/WorkerProfile.js';
import { Review } from '../models/Review.js';
import { ServiceCategory } from '../models/ServiceCategory.js';
import { workerProfileSchema, workerQuerySchema } from '../validators/workerValidator.js';
import { PROFILE_STATUSES } from '../config/constants.js';

export const getWorkers = async (req, res, next) => {
  try {
    const query = workerQuerySchema.parse(req.query);
    const filter = {
      profileStatus: PROFILE_STATUSES.PUBLISHED,
    };

    // Category filter by slug or ID
    if (query.category) {
      if (query.category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.categories = query.category;
      } else {
        const cat = await ServiceCategory.findOne({ slug: query.category });
        if (cat) {
          filter.categories = cat._id;
        }
      }
    }

    // Availability filter
    if (query.availability) {
      filter.availability = query.availability;
    }

    // Price range filters
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter = {};
      if (query.minPrice !== undefined) priceFilter.$gte = query.minPrice;
      if (query.maxPrice !== undefined) priceFilter.$lte = query.maxPrice;
      filter.indicativePriceMin = priceFilter;
    }

    // Language filter
    if (query.language) {
      filter.languages = { $regex: new RegExp(query.language, 'i') };
    }

    // Trust label filters
    if (query.trustLabel) {
      if (query.trustLabel === 'phone_confirmed') {
        filter['verificationStatus.phoneConfirmed'] = true;
      } else if (query.trustLabel === 'community_reference') {
        filter['verificationStatus.communityReferenceAdded'] = true;
      } else if (query.trustLabel === 'skill_evidence') {
        filter['verificationStatus.skillEvidenceSubmitted'] = true;
      }
    }

    // Location / Locality text filter
    if (query.location && query.location.trim()) {
      const locRegex = new RegExp(query.location.trim(), 'i');
      filter.$or = [
        { locality: locRegex },
        { districtCity: locRegex },
        { state: locRegex },
      ];
    }

    // Service keyword search (across skills, bio, displayName, or category names)
    if (query.service && query.service.trim()) {
      const termRegex = new RegExp(query.service.trim(), 'i');
      const matchingCats = await ServiceCategory.find({ name: termRegex }).select('_id');
      const catIds = matchingCats.map((c) => c._id);

      const serviceCriteria = [
        { skills: { $in: [termRegex] } },
        { displayName: termRegex },
        { bio: termRegex },
      ];

      if (catIds.length > 0) {
        serviceCriteria.push({ categories: { $in: catIds } });
      }

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: serviceCriteria }];
        delete filter.$or;
      } else {
        filter.$or = serviceCriteria;
      }
    }

    // Sorting
    let sort = { averageRating: -1, reviewCount: -1, createdAt: -1 };
    if (query.sortBy === 'price_asc') {
      sort = { indicativePriceMin: 1, averageRating: -1 };
    } else if (query.sortBy === 'price_desc') {
      sort = { indicativePriceMin: -1, averageRating: -1 };
    } else if (query.sortBy === 'rating') {
      sort = { averageRating: -1, reviewCount: -1 };
    }

    const skip = (query.page - 1) * query.limit;
    const [workers, total] = await Promise.all([
      WorkerProfile.find(filter)
        .populate('categories', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(query.limit)
        .lean(),
      WorkerProfile.countDocuments(filter),
    ]);

    // Sanitized output (Never expose userId, phone, email)
    const sanitizedWorkers = workers.map((w) => ({
      _id: w._id,
      slug: w.slug,
      displayName: w.displayName,
      categories: w.categories,
      skills: w.skills,
      bio: w.bio,
      experienceYears: w.experienceYears,
      locality: w.locality,
      districtCity: w.districtCity,
      state: w.state,
      serviceRadius: w.serviceRadius,
      approximateCoordinates: w.approximateCoordinates || null,
      indicativePriceMin: w.indicativePriceMin,
      indicativePriceMax: w.indicativePriceMax,
      languages: w.languages,
      availability: w.availability,
      verificationStatus: w.verificationStatus,
      averageRating: w.averageRating,
      reviewCount: w.reviewCount,
      profileStatus: w.profileStatus,
    }));

    return res.status(200).json({
      success: true,
      data: sanitizedWorkers,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const query = isObjectId ? { _id: id } : { slug: id };
    const worker = await WorkerProfile.findOne(query).populate('categories', 'name slug icon description');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found.',
      });
    }

    // Only allow public access to published profiles unless the requester is the owner or an admin
    if (worker.profileStatus !== PROFILE_STATUSES.PUBLISHED) {
      const isOwner = req.user && req.user._id.toString() === worker.userId.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: 'This worker profile is currently unavailable or inactive.',
        });
      }
    }

    // Fetch approved customer reviews
    const reviews = await Review.find({
      workerId: worker._id,
      moderationStatus: 'approved',
    })
      .populate('customerId', 'displayName')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        _id: worker._id,
        slug: worker.slug,
        displayName: worker.displayName,
        categories: worker.categories,
        skills: worker.skills,
        bio: worker.bio,
        experienceYears: worker.experienceYears,
        locality: worker.locality,
        districtCity: worker.districtCity,
        state: worker.state,
        serviceRadius: worker.serviceRadius,
        approximateCoordinates: worker.approximateCoordinates || null,
        indicativePriceMin: worker.indicativePriceMin,
        indicativePriceMax: worker.indicativePriceMax,
        languages: worker.languages,
        availability: worker.availability,
        contactPreference: worker.contactPreference,
        verificationStatus: worker.verificationStatus,
        averageRating: worker.averageRating,
        reviewCount: worker.reviewCount,
        profileStatus: worker.profileStatus,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyWorkerProfile = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ userId: req.user._id }).populate('categories');
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No worker profile found for this account.',
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkerProfile = async (req, res, next) => {
  try {
    const existing = await WorkerProfile.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Worker profile already exists. Use PATCH to update your profile.',
      });
    }

    const validated = workerProfileSchema.parse(req.body);

    const baseSlug = validated.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'worker';
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

    const profile = await WorkerProfile.create({
      userId: req.user._id,
      slug,
      ...validated,
      verificationStatus: {
        phoneConfirmed: req.user.isPhoneConfirmed || false,
        communityReferenceAdded: false,
        skillEvidenceSubmitted: false,
      },
    });

    const populated = await WorkerProfile.findById(profile._id).populate('categories');
    return res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyWorkerProfile = async (req, res, next) => {
  try {
    const validated = workerProfileSchema.partial().parse(req.body);

    let profile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found.',
      });
    }

    Object.assign(profile, validated);

    // Sync phoneConfirmed flag with User state
    if (req.user.isPhoneConfirmed) {
      profile.verificationStatus.phoneConfirmed = true;
    }

    await profile.save();
    const populated = await WorkerProfile.findById(profile._id).populate('categories');

    return res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};
