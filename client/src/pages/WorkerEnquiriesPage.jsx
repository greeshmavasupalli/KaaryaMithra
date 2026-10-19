import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { ShareJobModal } from '../components/common/ShareJobModal.jsx';
import { AiVoiceNotificationPlayer } from '../components/common/AiVoiceNotificationPlayer.jsx';
import { WorkerMapView } from '../components/common/WorkerMapView.jsx';
import {
  Inbox,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Filter,
  Share2,
  MapPin,
} from 'lucide-react';

export const WorkerEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionNote, setActionNote] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [shareJobData, setShareJobData] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries/mine');
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    setUpdatingId(enquiryId);
    try {
      const note = actionNote[enquiryId] || `Worker updated status to ${newStatus}`;
      const res = await api.patch(`/enquiries/${enquiryId}/status`, {
        status: newStatus,
        note,
      });

      if (res.success) {
        // Refresh list
        await fetchEnquiries();
        setActionNote((prev) => ({ ...prev, [enquiryId]: '' }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update enquiry status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    if (filterStatus === 'ALL') return true;
    return enq.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950">Notifications & Work Requests</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Review incoming customer inquiries, listen to voice descriptions, and respond directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Customer Enquiry Map for Workers */}
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap cursor-pointer"
            title="View from where customers are enquiring on Google Map"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Customer Enquiry Map</span>
          </button>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'New', 'Responded', 'Accepted', 'Completed', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                  filterStatus === status
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">
            No {filterStatus === 'ALL' ? '' : filterStatus} notifications found
          </h3>
          <p className="text-xs text-slate-500">
            When local neighbors request work, your notifications and work alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEnquiries.map((enq) => {
            const isAcceptedOrComplete = ['Accepted', 'Completed'].includes(enq.status);
            const customerName = enq.customerContact?.name || enq.customerId?.displayName || 'Customer';

            return (
              <div
                key={enq._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
              >
                {/* Header row: Customer name, Locality, Status badge, Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {customerName}
                      </span>
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                        {enq.categoryId?.name || 'General Service'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Customer Locality: <strong className="text-slate-800">{enq.locality}</strong> • Preferred Timing: {enq.preferredTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        enq.status === 'New'
                          ? 'bg-rose-100 text-rose-800'
                          : enq.status === 'Responded'
                          ? 'bg-blue-100 text-blue-800'
                          : enq.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'Completed'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {enq.status}
                    </span>

                    {isAcceptedOrComplete && (
                      <button
                        type="button"
                        onClick={() =>
                          setShareJobData({
                            appointmentId: 'VISIT-' + enq._id.slice(-5).toUpperCase(),
                            workerName: 'Self (Worker Active Visit)',
                            categoryName: enq.categoryId?.name || 'Service',
                            locality: enq.locality,
                            scheduledTime: enq.preferredTime,
                            status: enq.status === 'Completed' ? 'Completed Service' : 'On-Site / Active Job',
                            emergencyContact: '112 / 181',
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Share live job safety sheet"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Sheet</span>
                      </button>
                    )}

                    <span className="text-[11px] text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* AI Voice Notification Module & Original Message */}
                <AiVoiceNotificationPlayer enquiry={enq} />

                {/* Contact info (Protected per workflow) */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-700" />
                    <span className="text-slate-700">Customer Phone:</span>
                    <strong className="text-teal-900 font-mono">
                      {isAcceptedOrComplete
                        ? enq.customerContact?.phone || 'Not provided'
                        : 'Unlocked upon accepting enquiry'}
                    </strong>
                  </div>
                  <span className="text-[11px] text-teal-700 font-medium">
                    {enq.contactPreference === 'phone'
                      ? 'Preferred Phone Call'
                      : 'Preferred In-App'}
                  </span>
                </div>

                {/* Status History Timeline */}
                {enq.statusHistory && enq.statusHistory.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Status History & Notes:
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-600 border-l-2 border-slate-200 pl-3">
                      {enq.statusHistory.map((h, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{h.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(h.changedAt).toLocaleString()}
                            </span>
                          </div>
                          {h.note && <p className="text-[11px] text-slate-500 italic">{h.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Update Actions */}
                {enq.status !== 'Completed' && enq.status !== 'Closed' && (
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Add response note (e.g. Can visit at 10 AM tomorrow)..."
                        value={actionNote[enq._id] || ''}
                        onChange={(e) =>
                          setActionNote({ ...actionNote, [enq._id]: e.target.value })
                        }
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {enq.status === 'New' && (
                        <button
                          type="button"
                          disabled={updatingId === enq._id}
                          onClick={() => handleStatusUpdate(enq._id, 'Responded')}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          Mark as Responded
                        </button>
                      )}

                      {(enq.status === 'New' || enq.status === 'Responded') && (
                        <button
                          type="button"
                          disabled={updatingId === enq._id}
                          onClick={() => handleStatusUpdate(enq._id, 'Accepted')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Enquiry (Unlock Phone)</span>
                        </button>
                      )}

                      {enq.status === 'Accepted' && (
                        <button
                          type="button"
                          disabled={updatingId === enq._id}
                          onClick={() => handleStatusUpdate(enq._id, 'Completed')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Service as Completed</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={updatingId === enq._id}
                        onClick={() => handleStatusUpdate(enq._id, 'Closed')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-auto"
                      >
                        Close / Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Share Job Details Safety Sheet Modal */}
      <ShareJobModal
        isOpen={Boolean(shareJobData)}
        onClose={() => setShareJobData(null)}
        jobData={shareJobData}
      />

      {/* Customer Enquiry Locations Google Map View */}
      {showMapModal && (
        <WorkerMapView
          isModal={true}
          onClose={() => setShowMapModal(false)}
          initialPerspective="enquiries"
          customerEnquiriesList={enquiries.map((enq) => ({
            id: enq._id,
            customerName: enq.customerId?.name || enq.customerContact?.name || 'Local Customer',
            service: enq.categoryId?.name || 'Home Service Request',
            locality: enq.locality,
            preferredTime: enq.preferredTime,
            message: enq.message,
            urgency: enq.status === 'New' ? 'high' : 'medium',
          }))}
        />
      )}
    </div>
  );
};
