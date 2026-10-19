import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { TrustBadge } from '../components/common/TrustBadge.jsx';
import { OtpBadge } from '../components/common/OtpBadge.jsx';
import { EnquiryModal } from '../components/common/EnquiryModal.jsx';
import { ReportModal } from '../components/common/ReportModal.jsx';
import { ShareJobModal } from '../components/common/ShareJobModal.jsx';
import { AiVoiceReadoutButton } from '../components/common/VoiceAccessibilityModule.jsx';
import {
  MapPin,
  Star,
  Clock,
  IndianRupee,
  Languages,
  Send,
  Flag,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Share2,
  Ban,
} from 'lucide-react';

export const WorkerDetailPage = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/workers/${id}`);
        if (res.success) {
          setWorker(res.data);
        }
      } catch (err) {
        setError(err.message || 'Worker profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Worker Profile Unavailable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error || 'This worker listing does not exist or has been deactivated.'}
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-lg shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Workers</span>
        </Link>
      </div>
    );
  }

  const primaryCategory = worker.categories && worker.categories[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </Link>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Illustrated / Initials Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-navy-800 to-teal-800 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md flex-shrink-0">
              {worker.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                  {worker.displayName}
                </h1>
                {worker.verificationStatus?.phoneConfirmed && (
                  <OtpBadge size="lg" />
                )}
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize border ${
                    worker.availability === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : worker.availability === 'busy'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {worker.availability}
                </span>
              </div>

              {primaryCategory && (
                <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md inline-block border border-teal-200/60">
                  {primaryCategory.name}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {worker.locality}, {worker.districtCity} ({worker.state})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-saffron-500 fill-saffron-400" />
                  {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'New Listing'}
                  {worker.reviewCount > 0 && (
                    <span className="text-slate-400 font-normal">
                      ({worker.reviewCount} verified reviews)
                    </span>
                  )}
                </span>
              </div>

              <div className="pt-2">
                <AiVoiceReadoutButton
                  text={`${worker.displayName}, ${primaryCategory?.name || 'Local Service'}. Located in ${worker.locality}. Indicative rates from ${worker.indicativePriceMin || 250} rupees. Experience: ${worker.experienceYears || 5} years. Biography: ${worker.bio || 'Skilled tradesperson.'}`}
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Direct Enquiry</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              title="Share job / visit details with trusted contact"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Share Visit Details</span>
            </button>
          </div>
        </div>

        {/* Trust Safeguards Banner */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Community Trust & Verification Indicators</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
          <p className="text-[11px] text-slate-500 leading-normal">
            Labels reflect factual records (phone controls and local references). KaaryaMithra never guarantees background checks or legal identity certifications.
          </p>
        </div>
      </div>

      {/* Grid: Profile Details & Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Bio, Skills, and Reviews */}
        <div className="md:col-span-2 space-y-8">
          {/* About / Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About the Worker
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {worker.bio || 'Experienced local tradesperson ready to take up neighborhood work.'}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Specific Skills & Work Handled
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {worker.skills && worker.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Customer Feedback ({worker.reviews?.length || 0})
              </h2>
              <span className="text-[11px] text-slate-400">
                Verified reviews from completed enquiries
              </span>
            </div>

            {(!worker.reviews || worker.reviews.length === 0) ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No customer reviews recorded yet for this profile.
              </p>
            ) : (
              <div className="space-y-4">
                {worker.reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-800">
                        {rev.customerId?.displayName || 'Verified Customer'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-saffron-500 fill-saffron-400" />
                        <span className="text-xs font-bold text-slate-700">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Service Attributes & Report Link */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
              Service Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Indicative Pricing:</span>
                <span className="font-semibold text-slate-900">
                  {worker.indicativePriceMin ? (
                    `₹${worker.indicativePriceMin}${worker.indicativePriceMax ? ` – ₹${worker.indicativePriceMax}` : '+'}`
                  ) : (
                    'Direct estimate'
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Experience:</span>
                <span className="font-semibold text-slate-900">
                  {worker.experienceYears > 0 ? `${worker.experienceYears} Years` : 'Local artisan'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Service Radius:</span>
                <span className="font-semibold text-slate-900">
                  Up to {worker.serviceRadius || 10} km
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Languages:</span>
                <span className="font-semibold text-slate-900">
                  {worker.languages && worker.languages.join(', ')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Contact Method:</span>
                <span className="font-semibold text-teal-700">
                  KaaryaMithra Protected Chat
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Enquiry</span>
            </button>
          </div>

          {/* Reporting Safegaurd Button */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center space-y-2">
            <span className="text-[11px] text-slate-500 block">
              Notice any false info, abusive behavior, or suspicious profile activity?
            </span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report this Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        worker={worker}
        categories={worker.categories}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="listing"
        targetId={worker._id}
        targetName={worker.displayName}
      />

      <ShareJobModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        jobData={{
          appointmentId: 'VISIT-' + worker._id.slice(-5).toUpperCase(),
          workerName: worker.displayName,
          categoryName: primaryCategory?.name || 'Local Service',
          locality: `${worker.locality}, ${worker.districtCity}`,
          scheduledTime: 'Immediate / Next Available Slot',
          status: 'Scheduled Visit',
          emergencyContact: '112 / 181',
        }}
      />
    </div>
  );
};
