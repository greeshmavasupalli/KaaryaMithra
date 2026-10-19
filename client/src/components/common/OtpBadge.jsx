import React, { useState } from 'react';
import { PhoneCall, CheckCircle, ShieldCheck, X, Info } from 'lucide-react';

export const OtpBadge = ({ 
  isVerified = true, 
  size = 'sm', 
  phone = '', 
  compact = false 
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!isVerified) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs transition-all hover:scale-105 cursor-pointer ${
          size === 'lg'
            ? 'px-3.5 py-1.5 text-xs bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'px-2.5 py-0.5 text-[11px] bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
        }`}
        title="Phone (OTP) Verified - Click for safeguard details"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <PhoneCall className="w-3 h-3 text-emerald-600" />
        <span>OTP Verified</span>
        {!compact && (
          <CheckCircle className="w-3 h-3 text-emerald-600 ml-0.5" />
        )}
      </button>

      {/* Interactive Explanation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Phone (OTP) Verified</h3>
                  <p className="text-[11px] text-emerald-100">Core Trust & Safety Guarantee</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3 bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="leading-relaxed">
                  <strong>Authentic Mobile Control:</strong> This individual has authenticated their live phone via a simulated 6-digit one-time passcode (OTP). Burner or duplicate spam accounts are blocked.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                  <p><strong>Mutual Contact Privacy:</strong> Phone numbers are never exposed publicly on search pages. Direct phone contact is unlocked only upon mutual enquiry acceptance.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                  <p><strong>Factual Standard:</strong> This badge verifies direct control of the registered mobile line. It is never sold as a paid "gold star" or artificial certification.</p>
                </div>
              </div>

              {phone && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Verified Line:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    +91 •••••••{phone.slice(-3) || '420'}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
