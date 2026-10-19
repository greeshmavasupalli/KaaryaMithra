import mongoose from 'mongoose';
import { ENQUIRY_STATUSES } from '../config/constants.js';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUSES),
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const enquirySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    preferredTime: {
      type: String,
      default: 'Flexible / As soon as possible',
      trim: true,
    },
    contactPreference: {
      type: String,
      enum: ['in_app', 'phone'],
      default: 'in_app',
    },
    // Customer contact snapshot provided with consent for this enquiry
    customerContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUSES),
      default: ENQUIRY_STATUSES.NEW,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ customerId: 1, createdAt: -1 });
enquirySchema.index({ workerId: 1, status: 1, createdAt: -1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
