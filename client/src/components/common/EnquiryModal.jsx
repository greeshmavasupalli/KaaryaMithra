import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import { Send, X, CheckCircle2, ShieldAlert, Phone, Mic, Volume2 } from 'lucide-react';
import { VoiceInputButton, AiVoiceReadoutButton } from './VoiceAccessibilityModule.jsx';

export const EnquiryModal = ({ isOpen, onClose, worker, categories = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(() => {
    if (worker?.categories && worker.categories.length > 0) {
      return typeof worker.categories[0] === 'object' ? worker.categories[0]._id : worker.categories[0];
    }
    return '';
  });
  const [locality, setLocality] = useState('MVP Colony');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('Flexible / As soon as possible');
  const [contactPreference, setContactPreference] = useState('in_app');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !worker) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user?.role === 'worker' && worker._id === user?._id) {
      setError('You cannot send an enquiry to yourself.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/enquiries', {
        workerId: worker._id,
        categoryId: categoryId || (worker.categories[0]?._id || worker.categories[0]),
        locality,
        message,
        preferredTime,
        contactPreference,
        customerPhone,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        navigate('/customer/dashboard');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Send Direct Service Notification</h3>
            <p className="text-xs text-slate-500">To: {worker.displayName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Notification Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your service request has been notified directly to {worker.displayName}. You can track status in your Customer Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {!isAuthenticated && (
              <div className="p-3 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>You need to be logged in to submit a request. We will direct you to log in.</span>
              </div>
            )}

            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Service Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                >
                  {worker.categories &&
                    worker.categories.map((c) => {
                      const id = typeof c === 'object' ? c._id : c;
                      const name = typeof c === 'object' ? c.name : 'Primary Service';
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Area / Locality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. MVP Colony, Sector 4"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Voice Message & Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">
                  Describe problem or speak voice message <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Voice Accessibility Enabled
                </span>
              </div>

              {/* Voice-First Action Bar for Uneducated/Dialect Users */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100 text-xs">
                <VoiceInputButton
                  onTranscript={(transcript) =>
                    setMessage((prev) => (prev ? prev + ' ' + transcript : transcript))
                  }
                  placeholder="Speak your problem (Voice-to-Text)..."
                />
                {message && (
                  <AiVoiceReadoutButton
                    text={message}
                    label="Listen (AI Voice Output)"
                    compact
                  />
                )}
                <span className="text-[11px] text-slate-500 ml-auto hidden sm:inline">
                  🎤 Speak in Hindi / Telugu / English
                </span>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Tap leaking in bathroom, switch not working. Or click microphone above to speak your message..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                required
                minLength={5}
                maxLength={1000}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Time / Urgency
                </label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="e.g. Tomorrow morning 10 AM"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Preference
                </label>
                <select
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="in_app">KaaryaMithra In-App Inbox (Recommended)</option>
                  <option value="phone">Share phone number upon acceptance</option>
                </select>
              </div>
            </div>

            {contactPreference === 'phone' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Phone Number (Only shared after worker accepts)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-500 leading-normal">
              <strong>Privacy Protection:</strong> Phone numbers are never exposed publicly. Direct contact details are only unlocked after the worker accepts your enquiry.
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
