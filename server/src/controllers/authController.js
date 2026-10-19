import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { registerSchema, loginSchema, updateMeSchema } from '../validators/authValidator.js';
import { USER_ROLES, PROFILE_STATUSES } from '../config/constants.js';

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'skilldost_prototype_development_jwt_secret_token_12345';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

const sendTokenResponse = (user, statusCode, res, extraData = {}) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      isPhoneConfirmed: user.isPhoneConfirmed,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      accountStatus: user.accountStatus,
    },
    ...extraData,
  });
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    let isPhoneConfirmed = false;
    if (validated.phone) {
      // Simulated OTP check: "123456" is the prototype demo code
      if (validated.otp) {
        if (validated.otp === '123456') {
          isPhoneConfirmed = true;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid OTP. For prototype demo, please use code 123456.',
          });
        }
      }
    }

    const passwordHash = await User.hashPassword(validated.password);

    const user = await User.create({
      displayName: validated.displayName,
      email: validated.email,
      phone: validated.phone || '',
      isPhoneConfirmed,
      passwordHash,
      role: validated.role,
      preferredLanguage: validated.preferredLanguage || 'en',
    });

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      const baseSlug = user.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'worker';
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

      workerProfile = await WorkerProfile.create({
        userId: user._id,
        slug: uniqueSlug,
        displayName: user.displayName,
        locality: 'Central Locality',
        districtCity: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        categories: [],
        skills: ['General Service'],
        bio: 'Welcome to my SkillDost profile! I am ready to offer local service assistance.',
        verificationStatus: {
          phoneConfirmed: isPhoneConfirmed,
          communityReferenceAdded: false,
          skillEvidenceSubmitted: false,
        },
        profileStatus: PROFILE_STATUSES.DRAFT,
      });
    }

    return sendTokenResponse(user, 201, res, { workerProfile });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.comparePassword(validated.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account has been temporarily suspended by moderation.',
      });
    }

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await WorkerProfile.findOne({ userId: user._id }).populate('categories');
    }

    return sendTokenResponse(user, 200, res, { workerProfile });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let workerProfile = null;

    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await WorkerProfile.findOne({ userId: user._id }).populate('categories');
    }

    return res.status(200).json({
      success: true,
      user,
      workerProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const validated = updateMeSchema.parse(req.body);
    const user = await User.findById(req.user._id);

    if (validated.displayName) {
      user.displayName = validated.displayName;
    }
    if (validated.preferredLanguage) {
      user.preferredLanguage = validated.preferredLanguage;
    }
    if (validated.phone) {
      user.phone = validated.phone;
      if (validated.otp === '123456') {
        user.isPhoneConfirmed = true;
      }
    }

    await user.save();

    // If worker, also update WorkerProfile display name and phoneConfirmed status
    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await WorkerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          displayName: user.displayName,
          'verificationStatus.phoneConfirmed': user.isPhoneConfirmed,
        },
        { new: true }
      ).populate('categories');
    }

    return res.status(200).json({
      success: true,
      user,
      workerProfile,
    });
  } catch (error) {
    next(error);
  }
};
