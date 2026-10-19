import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { AiVoiceNotificationPlayer } from '../components/common/AiVoiceNotificationPlayer.jsx';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Star,
  Eye,
  Edit,
  Inbox,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Send,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export const WorkerDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, enqRes] = await Promise.all([
        api.get('/worker-profile/me'),
        api.get('/enquiries/mine'),
      ]);

      if (profileRes.success) setProfile(profileRes.data);
      if (enqRes.success) setEnquiries(enqRes.data);
    } catch (err) {
      console.error('Failed to load worker dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleAvailability = async () => {
    if (!profile) return;
    setUpdatingAvailability(true);
    try {
      const newStatus = profile.availability === 'available' ? 'busy' : 'available';
      const res = await api.patch('/worker-profile/me', { availability: newStatus });
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle availability', err);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // Calculate profile completion percentage
  let completionScore = 20; // base registration
  if (profile?.categories?.length > 0) completionScore += 20;
  if (profile?.skills?.length > 0) completionScore += 20;
  if (profile?.bio?.length > 20) completionScore += 15;
  if (profile?.indicativePriceMin > 0) completionScore += 15;
  if (profile?.verificationStatus?.phoneConfirmed) completionScore += 10;

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold text-navy-950">
              Welcome, {profile?.displayName || user?.displayName}
            </h1>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize border ${
                profile?.profileStatus === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Profile {profile?.profileStatus || 'Draft'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile?.locality}, {profile?.districtCity} • Primary Category:{' '}
            <strong className="text-slate-800">
              {profile?.categories?.[0]?.name || 'Not set'}
            </strong>
          </p>
        </div>

        {/* Quick Availability Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs">
            <span className="text-slate-500 block">Status:</span>
            <span className="font-bold text-slate-900 capitalize">
              {profile?.availability} for work
            </span>
          </div>

          <button
            onClick={toggleAvailability}
            disabled={updatingAvailability}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
              profile?.availability === 'available'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <span>{profile?.availability === 'available' ? 'Set as Busy' : 'Set as Available'}</span>
          </button>
        </div>
      </div>

      {/* Completion Progress & Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Completion Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">Profile Readiness</span>
            <span className="text-teal-700 font-bold">{completionScore}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {completionScore < 100
              ? 'Complete your profile with indicative pricing, bio, and skills to get higher neighborhood discovery.'
              : 'Your profile is completely filled out and ready for local customer discovery!'}
          </p>
        </div>

        {/* Rating Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Reputation & Feedback</span>
          <div className="flex items-center gap-1.5 pt-1">
            <Star className="w-5 h-5 text-saffron-500 fill-saffron-400" />
            <span className="text-xl font-bold text-slate-900">
              {profile?.averageRating > 0 ? profile.averageRating.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-slate-400">
              ({profile?.reviewCount || 0} reviews)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            From verified completed jobs
          </span>
        </div>

        {/* Notifications Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Notifications</span>
          <div className="flex items-center gap-2 pt-1">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <span className="text-xl font-bold text-slate-900">{enquiries.length}</span>
            {newEnquiriesCount > 0 && (
              <span className="text-[11px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                {newEnquiriesCount} New
              </span>
            )}
          </div>
          <Link
            to="/worker/enquiries"
            className="text-[11px] font-semibold text-teal-600 hover:underline block pt-1"
          >
            Manage Notifications →
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/worker/profile/edit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Edit className="w-3.5 h-3.5 text-teal-600" />
          <span>Edit Profile & Services</span>
        </Link>

        {profile && (
          <Link
            to={`/workers/${profile.slug || profile._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>View Public Profile</span>
          </Link>
        )}

        <Link
          to="/worker/enquiries"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>View All Incoming Notifications ({enquiries.length})</span>
        </Link>
      </div>

      {/* Recent Notifications Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>Recent Notifications</span>
          </h2>
          <Link
            to="/worker/enquiries"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No notifications received yet. Make sure your profile is published and availability is set to Available!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq._id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {enq.customerId?.displayName || 'Customer'}
                      </span>
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                        {enq.categoryId?.name || 'Service'}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          enq.status === 'New'
                            ? 'bg-rose-100 text-rose-800'
                            : enq.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'Completed'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Locality: <strong className="text-slate-800">{enq.locality}</strong> • Received {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to="/worker/enquiries"
                    className="self-start sm:self-center px-3.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition"
                  >
                    Manage Status
                  </Link>
                </div>

                {/* AI Voice Notification Audio Player */}
                <AiVoiceNotificationPlayer enquiry={enq} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
