import mongoose from 'mongoose';
import { PROFILE_STATUSES } from '../config/constants.js';

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    experienceYears: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    districtCity: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: 'Andhra Pradesh',
      trim: true,
    },
    serviceRadius: {
      type: Number,
      default: 10, // km
      min: 1,
      max: 100,
    },
    approximateCoordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    indicativePriceMin: {
      type: Number,
      min: 0,
      default: null,
    },
    indicativePriceMax: {
      type: Number,
      min: 0,
      default: null,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
      type: String,
      enum: ['available', 'busy', 'away'],
      default: 'available',
    },
    profileImage: {
      type: String,
      default: '',
    },
    contactPreference: {
      type: String,
      enum: ['in_app', 'phone_on_acceptance'],
      default: 'in_app',
    },
    contactVisibility: {
      type: String,
      enum: ['accepted_enquiries_only', 'private'],
      default: 'accepted_enquiries_only',
    },
    verificationStatus: {
      phoneConfirmed: { type: Boolean, default: false },
      communityReferenceAdded: { type: Boolean, default: false },
      skillEvidenceSubmitted: { type: Boolean, default: false },
    },
    profileStatus: {
      type: String,
      enum: Object.values(PROFILE_STATUSES),
      default: PROFILE_STATUSES.PUBLISHED,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Search and filtering indexes
workerProfileSchema.index({ profileStatus: 1, locality: 1, districtCity: 1 });
workerProfileSchema.index({ categories: 1, profileStatus: 1 });
workerProfileSchema.index({ displayName: 'text', skills: 'text', locality: 'text', bio: 'text' });

export const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);
