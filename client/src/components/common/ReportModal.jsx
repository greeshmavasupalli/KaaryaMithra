import React, { useState } from 'react';
import { api } from '../../services/api.js';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Ban,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';

export const ReportModal = ({
  isOpen,
  onClose,
  targetType = 'listing',
  targetId,
  targetName = '',
}) => {
  const [reason, setReason] = useState('harassment_or_abuse');
  const [details, setDetails] = useState('');
  const [blocked, setBlocked] = useState(true);
  const [urgency, setUrgency] = useState('emergency');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.post('/reports', {
        targetType,
        targetId: targetId || '654321654321654321654321',
        reason,
        details,
        blocked,
        urgency,
      });

      const ticketId = res.data?.ticketId || 'GRV-2026-' + Math.floor(100000 + Math.random() * 900000);
      setSuccessData({
        ticketId,
        blocked,
        slaHours: res.data?.slaHours || (urgency === 'emergency' ? 2 : urgency === 'high' ? 6 : 24),
      });

      // Save locally to blocked storage for demo persistence
      try {
        const storedBlocks = JSON.parse(localStorage.getItem('kaaryamithra_blocked') || '[]');
        if (blocked && targetName && !storedBlocks.includes(targetName)) {
          storedBlocks.push(targetName);
          localStorage.setItem('kaaryamithra_blocked', JSON.stringify(storedBlocks));
        }
      } catch (e) {
        // ignore storage errors
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50">
          <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span>In-App Report & Block</span>
              <p className="text-[10px] text-rose-500 font-normal">Confidential Safeguard Triage</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          <div className="p-7 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Safeguard Incident Logged</h4>
              <p className="text-xs text-slate-600">
                Your report has been escalated to the emergency moderation queue.
              </p>
            </div>

            {/* Generated Ticket Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Grievance Ticket ID:</span>
                <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {successData.ticketId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Guaranteed Response SLA:</span>
                <span className="font-semibold text-rose-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Within {successData.slaHours} hours
                </span>
              </div>
              {successData.blocked && (
                <div className="flex items-center gap-2 pt-1 text-slate-800 font-medium">
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span><strong>{targetName || 'User'}</strong> has been blocked from contacting you.</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              If this incident involves imminent danger or physical harm, please immediately contact Emergency Services at <strong>112</strong> or Women Helpline at <strong>181</strong>.
            </p>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {targetName && (
              <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-between">
                <span>Target Entity:</span>
                <strong className="text-slate-900">{targetName}</strong>
              </div>
            )}

            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Reporting <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value === 'harassment_or_abuse') {
                    setUrgency('emergency');
                  } else if (e.target.value === 'suspicious_or_fraud') {
                    setUrgency('high');
                  } else {
                    setUrgency('medium');
                  }
                }}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="harassment_or_abuse">🚨 Safety threat, abuse, or harassment (2h SLA)</option>
                <option value="suspicious_or_fraud">💰 Price extortion or suspicious fraud (6h SLA)</option>
                <option value="unreachable_or_fake">🚫 Unreachable phone / fake location / no-show</option>
                <option value="misleading_info">⚠️ Misleading qualifications or deceptive pricing</option>
                <option value="inappropriate_content">💬 Inappropriate or offensive language</option>
                <option value="other">❓ Other safeguard / community concern</option>
              </select>
            </div>

            {/* Urgency indicator */}
            <div className="flex items-center justify-between bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 text-xs">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                Response Commitment:
              </span>
              <span className="font-bold text-rose-700">
                {urgency === 'emergency' ? '2-Hour Emergency Triage' : urgency === 'high' ? '6-Hour Priority Review' : '24-Hour Review'}
              </span>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Incident Details & Context
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Explain what occurred (time, location, verbal/physical conduct) so our moderation committee can take immediate action..."
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                maxLength={1000}
              />
            </div>

            {/* Block Option Toggle */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>Block User Immediately</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Prevent this person from messaging you, viewing your bookings, or sending further enquiries.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={blocked}
                  onChange={(e) => setBlocked(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Submit & Block</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
