import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { ShareJobModal } from '../components/common/ShareJobModal.jsx';
import { AiVoiceReadoutButton } from '../components/common/VoiceAccessibilityModule.jsx';
import {
  Inbox,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  MessageSquare,
  Share2,
} from 'lucide-react';

export const CustomerDashboardPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareJobData, setShareJobData] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries/mine');
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const totalCount = enquiries.length;
  const activeCount = enquiries.filter((e) => ['New', 'Responded', 'Accepted'].includes(e.status)).length;
  const completedCount = enquiries.filter((e) => e.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Display Notification with Message symbol */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950">Notifications & Service Requests</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Real-time messages, direct responses, and contact updates for local trades you requested.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find More Services</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Notifications Placed</span>
          <div className="text-2xl font-bold text-navy-950">{totalCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-teal-700">Active / In Progress</span>
          <div className="text-2xl font-bold text-teal-700">{activeCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Completed Services</span>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No service notifications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our verified local tradespeople, plumbers, electricians, or cleaners and send your first request!
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold text-xs rounded-xl shadow-sm"
          >
            Explore Services Near You
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const worker = enq.workerId;
            return (
              <div
                key={enq._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-500/60 transition"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-navy-950">
                      {worker?.displayName || 'Local Worker'}
                    </span>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                      {enq.categoryId?.name || 'Service'}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
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
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{enq.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>Locality: {enq.locality}</span>
                    <span>•</span>
                    <span>Timing: {enq.preferredTime}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-1">
                    <AiVoiceReadoutButton
                      text={`Service request with ${worker?.displayName || 'worker'} for ${enq.categoryId?.name || 'service'}. Status: ${enq.status}. Message: ${enq.message}`}
                      compact
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 self-start md:self-center">
                  {['Accepted', 'Completed'].includes(enq.status) && (
                    <button
                      type="button"
                      onClick={() =>
                        setShareJobData({
                          appointmentId: 'VISIT-' + enq._id.slice(-5).toUpperCase(),
                          workerName: worker?.displayName || 'Tradesperson',
                          categoryName: enq.categoryId?.name || 'Service',
                          locality: enq.locality,
                          scheduledTime: enq.preferredTime,
                          status: enq.status === 'Completed' ? 'Completed Service' : 'In Progress (Active Visit)',
                          emergencyContact: '112 / 181',
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Share Job Details</span>
                    </button>
                  )}

                  <Link
                    to={`/customer/enquiries/${enq._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-xl border border-teal-200 transition"
                  >
                    <span>View Timeline & Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Job Details Modal */}
      {shareJobData && (
        <ShareJobModal
          isOpen={Boolean(shareJobData)}
          onClose={() => setShareJobData(null)}
          jobData={shareJobData}
        />
      )}
    </div>
  );
};
