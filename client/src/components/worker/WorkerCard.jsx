import React from 'react';
import { Link } from 'react-router-dom';
import { TrustBadge } from '../common/TrustBadge.jsx';
import { OtpBadge } from '../common/OtpBadge.jsx';
import { AiVoiceReadoutButton } from '../common/VoiceAccessibilityModule.jsx';
import { MapPin, Star, Clock, IndianRupee, Languages, Send, Navigation } from 'lucide-react';

export const WorkerCard = ({ worker, onSendEnquiry }) => {
  const primaryCategory = worker.categories && worker.categories[0];
  const catName = typeof primaryCategory === 'object' ? primaryCategory.name : 'Trade';
  const availabilityColors = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    busy: 'bg-amber-50 text-amber-700 border-amber-200',
    away: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const spokenBio = `${worker.displayName}, ${catName}. Located in ${worker.locality}. Indicative charges: ${
    worker.indicativePriceMin ? `${worker.indicativePriceMin} to ${worker.indicativePriceMax || worker.indicativePriceMin} rupees` : 'flexible estimate'
  }. Experience: ${worker.experienceYears || 5} years.`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between hover:border-teal-400">
      <div className="p-5 space-y-4">
        {/* Header: Name, Category, OTP Badge, Availability */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/workers/${worker.slug || worker._id}`}
                className="text-base font-bold text-navy-950 hover:text-teal-700 transition"
              >
                {worker.displayName}
              </Link>
              {worker.verificationStatus?.phoneConfirmed && (
                <OtpBadge size="sm" compact />
              )}
            </div>

            {primaryCategory && (
              <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block border border-teal-200/60">
                {catName}
              </div>
            )}
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize whitespace-nowrap ${
              availabilityColors[worker.availability] || availabilityColors.available
            }`}
          >
            {worker.availability}
          </span>
        </div>

        {/* Locality, Distance & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-semibold text-slate-800">{worker.locality}</span>
            {worker.distanceKm !== undefined && (
              <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 text-[10px]">
                {worker.distanceKm} km
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-bold text-slate-900">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{worker.averageRating > 0 ? worker.averageRating.toFixed(1) : '4.8'}</span>
            <span className="text-slate-400 font-normal">({worker.reviewCount || 1})</span>
          </div>
        </div>

        {/* Skills pill list */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {worker.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{worker.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Indicative Pricing & Experience */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] font-medium">Indicative Charges</span>
            <div className="font-bold text-slate-800 flex items-center">
              {worker.indicativePriceMin ? (
                <>
                  <IndianRupee className="w-3 h-3 text-slate-500" />
                  <span>
                    {worker.indicativePriceMin}
                    {worker.indicativePriceMax ? ` – ${worker.indicativePriceMax}` : '+'}
                  </span>
                </>
              ) : (
                <span className="text-slate-500 font-normal">Flexible quote</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] font-medium">Local Experience</span>
            <span className="font-bold text-slate-800">
              {worker.experienceYears > 0 ? `${worker.experienceYears} yrs verified` : 'Skilled trades'}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {worker.verificationStatus?.phoneConfirmed && (
            <TrustBadge type="phone_confirmed" />
          )}
          {worker.verificationStatus?.communityReferenceAdded && (
            <TrustBadge type="community_reference" />
          )}
          {worker.verificationStatus?.skillEvidenceSubmitted && (
            <TrustBadge type="skill_evidence" />
          )}
        </div>
      </div>

      {/* Card Action Buttons + AI Voice Readout */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/workers/${worker.slug || worker._id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition"
          >
            Profile
          </Link>
          <button
            onClick={() => onSendEnquiry && onSendEnquiry(worker)}
            className="flex-1 py-2 px-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Enquire</span>
          </button>
        </div>

        {/* AI Voice Readout Button for uneducated users */}
        <div className="flex items-center justify-between pt-1">
          <AiVoiceReadoutButton text={spokenBio} compact className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
};
