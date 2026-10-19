import { Enquiry } from '../models/Enquiry.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { User } from '../models/User.js';
import { createEnquirySchema, updateEnquiryStatusSchema } from '../validators/enquiryValidator.js';
import { ENQUIRY_STATUSES, USER_ROLES } from '../config/constants.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const validated = createEnquirySchema.parse(req.body);

    const worker = await WorkerProfile.findById(validated.workerId);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found.',
      });
    }

    // Capture customer snapshot
    const customer = await User.findById(req.user._id);
    const customerContact = {
      name: customer.displayName,
      phone: validated.customerPhone || customer.phone || '',
    };

    const enquiry = await Enquiry.create({
      customerId: req.user._id,
      workerId: worker._id,
      categoryId: validated.categoryId,
      locality: validated.locality,
      message: validated.message,
      preferredTime: validated.preferredTime,
      contactPreference: validated.contactPreference,
      customerContact,
      status: ENQUIRY_STATUSES.NEW,
      statusHistory: [
        {
          status: ENQUIRY_STATUSES.NEW,
          note: 'Enquiry submitted by customer',
          changedBy: req.user._id,
          changedAt: new Date(),
        },
      ],
    });

    const populated = await Enquiry.findById(enquiry._id)
      .populate('workerId', 'displayName slug locality districtCity averageRating')
      .populate('categoryId', 'name icon');

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been sent directly to the local worker.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnquiries = async (req, res, next) => {
  try {
    let enquiries = [];

    if (req.user.role === USER_ROLES.WORKER) {
      const worker = await WorkerProfile.findOne({ userId: req.user._id });
      if (!worker) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      enquiries = await Enquiry.find({ workerId: worker._id })
        .populate('customerId', 'displayName email')
        .populate('categoryId', 'name icon')
        .populate('workerId', 'displayName slug')
        .sort({ createdAt: -1 })
        .lean();

      // Mask customer phone unless status is Accepted or Completed
      enquiries = enquiries.map((enq) => {
        const canViewPhone = [ENQUIRY_STATUSES.ACCEPTED, ENQUIRY_STATUSES.COMPLETED].includes(enq.status);
        if (!canViewPhone && enq.customerContact) {
          enq.customerContact = {
            name: enq.customerContact.name,
            phone: 'Revealed upon acceptance',
          };
        }
        return enq;
      });
    } else {
      // Customer
      enquiries = await Enquiry.find({ customerId: req.user._id })
        .populate('workerId', 'displayName slug locality districtCity averageRating contactPreference contactVisibility')
        .populate('categoryId', 'name icon')
        .sort({ createdAt: -1 })
        .lean();
    }

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('customerId', 'displayName email phone')
      .populate('workerId', 'displayName slug locality districtCity averageRating contactPreference contactVisibility userId')
      .populate('categoryId', 'name icon');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    const isCustomer = req.user._id.toString() === enquiry.customerId._id.toString();
    const isWorker =
      enquiry.workerId &&
      enquiry.workerId.userId &&
      req.user._id.toString() === enquiry.workerId.userId.toString();
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this enquiry.',
      });
    }

    const enqObj = enquiry.toObject();

    // Check if worker phone can be shared with customer
    if (isCustomer) {
      const isAcceptedOrComplete = [ENQUIRY_STATUSES.ACCEPTED, ENQUIRY_STATUSES.COMPLETED].includes(enquiry.status);
      if (isAcceptedOrComplete && enquiry.workerId) {
        // Fetch worker user phone if worker has accepted
        const workerUser = await User.findById(enquiry.workerId.userId);
        if (workerUser && workerUser.phone && enquiry.workerId.contactVisibility !== 'private') {
          enqObj.workerContact = {
            phone: workerUser.phone,
            phoneConfirmed: workerUser.isPhoneConfirmed,
          };
        }
      }
    }

    // Check if customer phone can be shared with worker
    if (isWorker) {
      const isAcceptedOrComplete = [ENQUIRY_STATUSES.ACCEPTED, ENQUIRY_STATUSES.COMPLETED].includes(enquiry.status);
      if (!isAcceptedOrComplete && enqObj.customerContact) {
        enqObj.customerContact.phone = 'Revealed upon acceptance';
      }
    }

    return res.status(200).json({
      success: true,
      data: enqObj,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const validated = updateEnquiryStatusSchema.parse(req.body);
    const enquiry = await Enquiry.findById(req.params.id).populate('workerId');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    const isCustomer = req.user._id.toString() === enquiry.customerId.toString();
    const isWorker =
      enquiry.workerId &&
      enquiry.workerId.userId &&
      req.user._id.toString() === enquiry.workerId.userId.toString();
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update this enquiry.',
      });
    }

    const newStatus = validated.status;
    const oldStatus = enquiry.status;

    // Transition checks
    if (!isAdmin) {
      if (isWorker) {
        // Worker allowed transitions:
        // New -> Responded, Accepted, Closed
        // Responded -> Accepted, Closed
        // Accepted -> Completed, Closed
        if (oldStatus === ENQUIRY_STATUSES.COMPLETED || oldStatus === ENQUIRY_STATUSES.CLOSED) {
          return res.status(400).json({
            success: false,
            message: `Cannot change status of an enquiry that is already ${oldStatus}.`,
          });
        }
      } else if (isCustomer) {
        // Customer allowed transitions:
        // Any -> Closed (cancel)
        // Accepted -> Completed (confirm completed service)
        if (newStatus !== ENQUIRY_STATUSES.CLOSED && !(oldStatus === ENQUIRY_STATUSES.ACCEPTED && newStatus === ENQUIRY_STATUSES.COMPLETED)) {
          return res.status(400).json({
            success: false,
            message: 'Customers can only cancel an enquiry or mark an accepted enquiry as completed.',
          });
        }
      }
    }

    enquiry.status = newStatus;
    enquiry.statusHistory.push({
      status: newStatus,
      note: validated.note || `Status updated from ${oldStatus} to ${newStatus}`,
      changedBy: req.user._id,
      changedAt: new Date(),
    });

    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: `Enquiry status updated to ${newStatus}.`,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};
