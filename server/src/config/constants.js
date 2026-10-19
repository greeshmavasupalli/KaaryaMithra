export const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin',
};

export const ENQUIRY_STATUSES = {
  NEW: 'New',
  RESPONDED: 'Responded',
  ACCEPTED: 'Accepted',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
};

export const PROFILE_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  DEACTIVATED: 'deactivated',
  REMOVAL_REQUESTED: 'removal_requested',
  HIDDEN: 'hidden',
};

export const REPORT_STATUSES = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
};

export const TARGET_TYPES = {
  LISTING: 'listing',
  REVIEW: 'review',
  USER: 'user',
};

export const TRUST_LABELS = {
  PHONE_CONFIRMED: {
    key: 'phone_confirmed',
    label: 'Phone confirmed',
    explanation: 'This person controls this phone number. It is not an identity, skill, or background check.',
  },
  COMMUNITY_REFERENCE: {
    key: 'community_reference',
    label: 'Community reference added',
    explanation: 'A local resident or business vouching for past work history. Not an official certification.',
  },
  SKILL_EVIDENCE: {
    key: 'skill_evidence',
    label: 'Skill evidence submitted',
    explanation: 'Work samples or tool/workshop photos submitted for basic plausibility check.',
  },
};
