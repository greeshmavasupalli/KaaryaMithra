import { Report } from '../models/Report.js';
import { createReportSchema } from '../validators/reportValidator.js';

export const createReport = async (req, res, next) => {
  try {
    const validated = createReportSchema.parse(req.body);

    const slaMap = {
      emergency: 2,
      high: 6,
      medium: 24,
      low: 48,
    };

    const report = await Report.create({
      reporterId: req.user ? req.user._id : null,
      targetType: validated.targetType,
      targetId: validated.targetId,
      reason: validated.reason,
      details: validated.details || '',
      blocked: Boolean(validated.blocked),
      urgency: validated.urgency || 'medium',
      slaHours: slaMap[validated.urgency] || 24,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reporting. Your grievance has been recorded and routed to our safety triage team.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(200).json({ success: true, data: [] });
    }

    const reports = await Report.find({ reporterId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportByTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const report = await Report.findOne({ ticketId }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No grievance record found with this Ticket ID.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ticketId: report.ticketId,
        status: report.status,
        reason: report.reason,
        urgency: report.urgency,
        slaHours: report.slaHours,
        createdAt: report.createdAt,
        resolvedAt: report.resolvedAt,
        adminNotes: report.adminNotes,
      },
    });
  } catch (error) {
    next(error);
  }
};
