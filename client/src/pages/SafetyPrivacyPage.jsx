import React from 'react';
import { ShieldCheck, PhoneCall, Lock, AlertTriangle, UserMinus, CheckCircle2 } from 'lucide-react';

export const SafetyPrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>User Protection & Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          Safety Guidance & Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Plain-language principles to ensure respectful, safe, and privacy-conscious interactions
          between local households and service workers.
        </p>
      </div>

      {/* Safety Guidance for Meeting Providers */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
          <span>Guidance for In-Person Service Visits</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Clarify scope and estimates in advance:</strong> Discuss indicative rates, materials costs,
              and timing via the enquiry notes before inviting a provider to your premises.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Daylight and accompaniment:</strong> For first-time visits, arrange service calls during
              daylight hours with another family member or colleague present.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Mutual respect and dignity:</strong> Respect informal workers as independent skilled tradespeople.
              Provide clear access to work areas, electrical sockets, and basic facilities.
            </div>
          </div>
        </div>
      </section>

      {/* Data Handling & Contact Visibility */}
      <section id="data-privacy" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-navy-950">Data Handling & Contact Privacy</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          KaaryaMithra adheres to strict data minimization principles:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>
            <strong>Phone Numbers Are Never Indexed:</strong> We never display personal phone numbers on public profile cards, search pages, or search engine snippets.
          </li>
          <li>
            <strong>Mutual Acceptance Requirement:</strong> Phone numbers are only unlocked in enquiry records after the worker explicitly accepts the customer's request.
          </li>
          <li>
            <strong>Minimal Data Storage:</strong> We do not ask for Aadhaar numbers, biometric scans, or bank account credentials.
          </li>
        </ul>
      </section>

      {/* Reporting & Safeguards */}
      <section id="reporting" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-navy-950">Reporting Safeguards & Moderation</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Every worker profile and customer review includes a prominent <strong>Report Listing</strong> action.
          Reports trigger an automatic entry into the protected moderator triage queue, allowing administrators
          to investigate, add notes, hide listings, or suspend accounts if misconduct is verified.
        </p>
      </section>

      {/* Worker Profile Removal Rights */}
      <section id="removal" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <UserMinus className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-navy-950">Worker Profile Deactivation & Removal</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Workers retain 100% autonomy over their presence on KaaryaMithra. From the profile editor, workers can:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>Temporarily deactivate their profile to pause incoming enquiries without losing their work history.</li>
          <li>Request complete removal of their personal profile data and listings at any time.</li>
        </ul>
      </section>
    </div>
  );
};
