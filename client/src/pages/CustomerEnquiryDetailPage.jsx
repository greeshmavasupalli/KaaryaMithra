import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { FeedbackModal } from '../components/common/FeedbackModal.jsx';
import { ShareJobModal } from '../components/common/ShareJobModal.jsx';
import { OtpBadge } from '../components/common/OtpBadge.jsx';
import { AiVoiceReadoutButton } from '../components/common/VoiceAccessibilityModule.jsx';
import {
  ArrowLeft,
  Phone,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  XCircle,
  Share2,
} from 'lucide-react';

export const CustomerEnquiryDetailPage = () => {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEnquiry = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/enquiries/${id}`);
      if (res.success) {
        setEnquiry(res.data);
      }
    } catch (err) {
      setError(err.message || 'Enquiry not found or access restricted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const handleStatusChange = async (newStatus, note = '') => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/enquiries/${id}/status`, {
        status: newStatus,
        note,
      });
      if (res.success) {
        await fetchEnquiry();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Notification Details Unavailable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Back to Notifications</span>
        </Link>
      </div>
    );
  }

  const worker = enquiry.workerId;
  const isAcceptedOrComplete = ['Accepted', 'Completed'].includes(enquiry.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <span>Back to Notifications</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
              {enquiry.categoryId?.name || 'Service Request'}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                Notification for {worker?.displayName || 'Worker'}
              </h1>
              <OtpBadge size="sm" />
            </div>
            <div className="text-xs text-slate-500">
              Target locality: <strong className="text-slate-800">{enquiry.locality}</strong> • Timing: {enquiry.preferredTime}
            </div>
            <div className="pt-2">
              <AiVoiceReadoutButton
                text={`Enquiry for ${worker?.displayName || 'worker'}. Status: ${enquiry.status}. Locality: ${enquiry.locality}. Preferred timing: ${enquiry.preferredTime}. Your sent message: ${enquiry.message}`}
                compact
              />
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                enquiry.status === 'New'
                  ? 'bg-rose-100 text-rose-800'
                  : enquiry.status === 'Responded'
                  ? 'bg-blue-100 text-blue-800'
                  : enquiry.status === 'Accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : enquiry.status === 'Completed'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Status: {enquiry.status}
            </span>

            {isAcceptedOrComplete && (
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Job Details</span>
              </button>
            )}

            <span className="text-[11px] text-slate-400">
              Created {new Date(enquiry.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Your Sent Message:
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line italic">
            "{enquiry.message}"
          </p>
        </div>

        {/* Worker Contact Visibility (Privacy Controlled) */}
        <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-700" />
              <span>Worker Contact Coordinates</span>
            </span>
            <span className="text-[10px] text-teal-700 font-medium">Privacy Safeguard Active</span>
          </div>

          {isAcceptedOrComplete && enquiry.workerContact?.phone ? (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-700">Direct Phone:</span>
              <strong className="text-base text-teal-900 font-mono tracking-wider">
                {enquiry.workerContact.phone}
              </strong>
              <OtpBadge size="sm" phone={enquiry.workerContact.phone} />
            </div>
          ) : (
            <p className="text-xs text-teal-900 leading-relaxed">
              Worker phone details remain protected. As soon as {worker?.displayName || 'the worker'} accepts your enquiry, direct phone contact will unlock here.
            </p>
          )}
        </div>

        {/* Timeline of Status History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Status Progress Timeline
          </h3>

          <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pb-2">
            {enquiry.statusHistory &&
              enquiry.statusHistory.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-600 border-2 border-white" />
                  <div className="text-xs font-bold text-slate-900">{step.status}</div>
                  {step.note && (
                    <p className="text-xs text-slate-600 italic mt-0.5">{step.note}</p>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(step.changedAt).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Action Controls for Customer */}
        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            {enquiry.status === 'Accepted' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleStatusChange(
                    'Completed',
                    'Customer confirmed satisfactory service completion'
                  )
                }
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Service as Completed</span>
              </button>
            )}

            {enquiry.status === 'Completed' && (
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Leave Verified Feedback</span>
              </button>
            )}
          </div>

          <div>
            {enquiry.status !== 'Completed' && enquiry.status !== 'Closed' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleStatusChange('Closed', 'Enquiry cancelled by customer')
                }
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                Cancel Enquiry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        enquiryId={enquiry._id}
        workerName={worker?.displayName}
        onSuccess={fetchEnquiry}
      />

      {/* Share Job Details Modal */}
      <ShareJobModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        jobData={{
          appointmentId: 'VISIT-' + enquiry._id.slice(-5).toUpperCase(),
          workerName: worker?.displayName || 'Tradesperson',
          categoryName: enquiry.categoryId?.name || 'Local Service',
          locality: enquiry.locality,
          scheduledTime: enquiry.preferredTime,
          status: enquiry.status === 'Completed' ? 'Completed Service' : 'In Progress (Active Visit)',
          emergencyContact: '112 / 181',
        }}
      />
    </div>
  );
};
