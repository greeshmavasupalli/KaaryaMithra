import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Enquiry } from '../models/Enquiry.js';
import { Review } from '../models/Review.js';
import { ServiceCategory } from '../models/ServiceCategory.js';
import { AuditLog } from '../models/AuditLog.js';
import { updateReportSchema } from '../validators/reportValidator.js';
import { PROFILE_STATUSES, USER_ROLES } from '../config/constants.js';

export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('reporterId', 'displayName email')
      .populate('resolvedBy', 'displayName')
      .sort({ createdAt: -1 })
      .lean();

    // Populate target summary for quick admin triage
    const enrichedReports = await Promise.all(
      reports.map(async (rep) => {
        let targetSummary = null;
        if (rep.targetType === 'listing') {
          const worker = await WorkerProfile.findById(rep.targetId).select('displayName slug profileStatus locality');
          targetSummary = worker;
        } else if (rep.targetType === 'review') {
          const rev = await Review.findById(rep.targetId).select('rating comment moderationStatus');
          targetSummary = rev;
        } else if (rep.targetType === 'user') {
          const u = await User.findById(rep.targetId).select('displayName email accountStatus role');
          targetSummary = u;
        }
        return {
          ...rep,
          targetSummary,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedReports.length,
      data: enrichedReports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req, res, next) => {
  try {
    const validated = updateReportSchema.parse(req.body);
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    report.status = validated.status;
    report.adminNotes = validated.adminNotes || report.adminNotes;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();

    let actionTaken = 'NONE';

    // Handle automated moderation actions if selected
    if (validated.actionTaken === 'hide_content') {
      if (report.targetType === 'listing') {
        await WorkerProfile.findByIdAndUpdate(report.targetId, {
          profileStatus: PROFILE_STATUSES.HIDDEN,
        });
        actionTaken = 'HIDE_WORKER_PROFILE';
      } else if (report.targetType === 'review') {
        await Review.findByIdAndUpdate(report.targetId, {
          moderationStatus: 'hidden',
        });
        actionTaken = 'HIDE_REVIEW';
      }
    } else if (validated.actionTaken === 'suspend_user') {
      if (report.targetType === 'user') {
        await User.findByIdAndUpdate(report.targetId, {
          accountStatus: 'suspended',
        });
        actionTaken = 'SUSPEND_USER';
      } else if (report.targetType === 'listing') {
        const worker = await WorkerProfile.findById(report.targetId);
        if (worker && worker.userId) {
          await User.findByIdAndUpdate(worker.userId, { accountStatus: 'suspended' });
          await WorkerProfile.findByIdAndUpdate(worker._id, { profileStatus: PROFILE_STATUSES.HIDDEN });
          actionTaken = 'SUSPEND_USER_AND_HIDE_PROFILE';
        }
      }
    }

    await report.save();

    // Create AuditLog entry
    await AuditLog.create({
      actorId: req.user._id,
      action: `RESOLVE_REPORT_${actionTaken}`,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: validated.adminNotes || `Status updated to ${validated.status}`,
      metadata: {
        reportId: report._id,
        newStatus: validated.status,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Report updated and moderation action logged.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformMetrics = async (req, res, next) => {
  try {
    const [
      totalWorkers,
      publishedWorkers,
      totalCustomers,
      totalEnquiries,
      completedEnquiries,
      totalReviews,
      totalReports,
      pendingReports,
      categoriesCount,
    ] = await Promise.all([
      WorkerProfile.countDocuments(),
      WorkerProfile.countDocuments({ profileStatus: PROFILE_STATUSES.PUBLISHED }),
      User.countDocuments({ role: USER_ROLES.CUSTOMER }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'Completed' }),
      Review.countDocuments({ moderationStatus: 'approved' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      ServiceCategory.countDocuments({ isActive: true }),
    ]);

    // Status breakdown for enquiries
    const statusAgg = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const enquiriesByStatus = {};
    statusAgg.forEach((s) => {
      enquiriesByStatus[s._id] = s.count;
    });

    return res.status(200).json({
      success: true,
      metrics: {
        workers: {
          total: totalWorkers,
          published: publishedWorkers,
          draftOrInactive: totalWorkers - publishedWorkers,
        },
        customers: {
          total: totalCustomers,
        },
        enquiries: {
          total: totalEnquiries,
          completed: completedEnquiries,
          byStatus: enquiriesByStatus,
        },
        reviews: {
          total: totalReviews,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
        },
        categories: {
          activeCount: categoriesCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or suspended.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.accountStatus = status;
    await user.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: status === 'suspended' ? 'SUSPEND_USER' : 'RESTORE_USER',
      targetType: 'user',
      targetId: user._id,
      reason: reason || `Account status changed to ${status}`,
    });

    return res.status(200).json({
      success: true,
      message: `User status changed to ${status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkerListingStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    if (!Object.values(PROFILE_STATUSES).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile status.',
      });
    }

    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker listing not found.',
      });
    }

    const oldStatus = worker.profileStatus;
    worker.profileStatus = status;
    await worker.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: `CHANGE_LISTING_STATUS_${status.toUpperCase()}`,
      targetType: 'listing',
      targetId: worker._id,
      reason: reason || `Status changed from ${oldStatus} to ${status}`,
    });

    return res.status(200).json({
      success: true,
      message: `Worker listing status changed to ${status}`,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
};
