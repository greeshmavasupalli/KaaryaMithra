import mongoose from 'mongoose';
import { REPORT_STATUSES, TARGET_TYPES } from '../config/constants.js';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    targetType: {
      type: String,
      enum: Object.values(TARGET_TYPES),
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'inappropriate_content',
        'misleading_info',
        'harassment_or_abuse',
        'suspicious_or_fraud',
        'unreachable_or_fake',
        'other',
      ],
    },
    details: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    ticketId: {
      type: String,
      default: () => 'GRV-' + Math.floor(100000 + Math.random() * 900000),
      index: true,
    },
    urgency: {
      type: String,
      enum: ['emergency', 'high', 'medium', 'low'],
      default: 'medium',
    },
    slaHours: {
      type: Number,
      default: 24,
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUSES),
      default: REPORT_STATUSES.PENDING,
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporterId: 1 });

export const Report = mongoose.model('Report', reportSchema);
