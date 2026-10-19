import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Send,
  Phone,
  ShieldCheck,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  X,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { OtpBadge } from './OtpBadge.jsx';

export const ShareJobModal = ({
  isOpen,
  onClose,
  jobData = null,
}) => {
  // Fallback realistic demo job if not provided
  const job = jobData || {
    appointmentId: 'VISIT-98412-KM',
    workerName: 'Ramesh Kumar',
    categoryName: 'Electrician (MCB & Tripping Repair)',
    locality: 'MVP Colony, Sector 4, Visakhapatnam',
    scheduledTime: 'Today, 4:30 PM - 5:30 PM',
    status: 'In Progress (On-Site)',
    emergencyContact: '112 (National Emergency) / 181 (Women Helpline)',
  };

  const [trustedName, setTrustedName] = useState('Family / Friend');
  const [trustedPhone, setTrustedPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://kaaryamithra.in/live-visit/${job.appointmentId.toLowerCase()}`;
  const shareText = `🛡️ [KaaryaMithra Safety Alert] I have an active service visit with ${job.workerName} (${job.categoryName}) at ${job.locality}. Scheduled: ${job.scheduledTime}. Status: ${job.status}. Track live visit details: ${shareUrl} | Emergency: 112 / 181`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSimulateSms = (e) => {
    e.preventDefault();
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-navy-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Share2 className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Share Live Visit Details</h3>
              <p className="text-[11px] text-teal-100">Live safety tracking sheet for family & trusted contacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Live Visit Card Preview */}
          <div className="bg-gradient-to-b from-slate-50 to-teal-50/40 p-4 rounded-xl border border-teal-200/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                Ref: {job.appointmentId}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{job.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-teal-100/60">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Assigned Tradesperson:</span>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>{job.workerName}</span>
                </div>
                <div className="text-[11px] text-slate-500">{job.categoryName}</div>
                <div className="pt-1">
                  <OtpBadge size="sm" />
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Appointment Window:</span>
                <div className="font-semibold text-slate-800 text-[11px] flex items-center sm:justify-end gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{job.scheduledTime}</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-medium pt-1">Location:</span>
                <div className="text-[11px] text-slate-700 font-medium flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{job.locality}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-teal-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Emergency Hotline:
              </span>
              <span className="font-mono font-bold text-slate-800">112 / 181</span>
            </div>
          </div>

          {/* Share Actions */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Live Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-100 text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-200 font-mono outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <a
              href="tel:112"
              className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-rose-600" />
              <span>Dial Emergency 112</span>
            </a>
          </div>

          {/* SMS Simulation Form */}
          <form onSubmit={handleSimulateSms} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-teal-600" />
                <span>Simulate Sending SMS to Family Contact</span>
              </span>
              <span className="text-[10px] text-slate-400">Prototype Demo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Contact Name (e.g. Sister, Roommate)"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-hidden focus:border-teal-500"
              />
              <input
                type="tel"
                placeholder="Mobile (e.g. 9876543210)"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-hidden focus:border-teal-500"
              />
            </div>

            {smsSent && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>SMS Alert dispatched to <strong>{trustedName || 'Contact'}</strong> with encrypted live link and emergency speeds.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-navy-950 text-white font-semibold text-xs rounded-lg transition shadow-2xs cursor-pointer"
            >
              Dispatch Simulated SMS Alert
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted zero-login public link</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
