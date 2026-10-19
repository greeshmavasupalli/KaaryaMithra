import React, { useState } from 'react';
import { PhoneCall, Users, FileCheck, Info } from 'lucide-react';

const BADGE_CONFIG = {
  phone_confirmed: {
    label: 'Phone confirmed',
    icon: PhoneCall,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconColor: 'text-emerald-600',
    tooltip: 'Phone confirmed: This worker controls this phone number. It is not an identity, skill, or background check.',
  },
  community_reference: {
    label: 'Community reference added',
    icon: Users,
    color: 'bg-teal-50 text-teal-800 border-teal-200',
    iconColor: 'text-teal-600',
    tooltip: 'Community reference: Local residents or past clients have submitted contact references vouching for past work.',
  },
  skill_evidence: {
    label: 'Skill evidence submitted',
    icon: FileCheck,
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    iconColor: 'text-indigo-600',
    tooltip: 'Skill evidence: Work samples or tool/workshop photos submitted for basic plausibility check.',
  },
};

export const TrustBadge = ({ type, showTooltipOnHover = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = BADGE_CONFIG[type];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-help ${config.color}`}
        aria-label={`${config.label} - click for explanation`}
      >
        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
        <span>{config.label}</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl border border-slate-700 pointer-events-none"
        >
          <div className="font-semibold text-teal-300 mb-0.5">{config.label}</div>
          <div className="leading-snug text-slate-300">{config.tooltip}</div>
          <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};
