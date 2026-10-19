import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Users,
  FileCheck,
  Lock,
  Share2,
  AlertTriangle,
  Ban,
  Clock,
  CheckCircle2,
  HeartHandshake,
  UserCheck,
  HelpCircle,
  FileText,
  Building2,
  EyeOff,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { OtpBadge } from '../components/common/OtpBadge.jsx';
import { ShareJobModal } from '../components/common/ShareJobModal.jsx';
import { ReportModal } from '../components/common/ReportModal.jsx';
import { GrievanceTicketSystem } from '../components/common/GrievanceTicketSystem.jsx';
import { VoiceAccessibilityDemo, AiVoiceReadoutButton } from '../components/common/VoiceAccessibilityModule.jsx';

export const TrustSafetyCenterPage = () => {
  const [activePillar, setActivePillar] = useState('all'); // 'all' | 'verify' | 'protect' | 'resolve'
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="relative bg-white text-slate-900 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-sm border border-slate-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Seva First Innovation Challenge • Trust & Safety Framework</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Trust & Safety Center
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Dignity, safety, and mutual accountability for unorganised workers and everyday households. Co-designed with local resident welfare associations (RWAs) and informal trade collectives.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Simulate "Share Job Details"</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              <span>Test "In-App Report & Block"</span>
            </button>

            <AiVoiceReadoutButton
              text="Welcome to KaaryaMithra Trust and Safety Center. We safeguard unorganised workers and households through three pillars: Verify, Protect, and Resolve."
            />
          </div>
        </div>
      </div>

      {/* Pillar Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl max-w-xl mx-auto border border-slate-200">
        {[
          { id: 'all', label: 'All Framework Pillars' },
          { id: 'verify', label: '1. VERIFY' },
          { id: 'protect', label: '2. PROTECT' },
          { id: 'resolve', label: '3. RESOLVE' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActivePillar(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activePillar === tab.id
                ? 'bg-white text-navy-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PILLAR 1: VERIFY */}
      {(activePillar === 'all' || activePillar === 'verify') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              1
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
                <span>VERIFY: Transparent & Community Validation</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ground-level authenticity without fake marketing labels or exploitative background fee barriers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Phone OTP Verification */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-navy-950">Phone (OTP) Verification</h3>
                  <OtpBadge size="sm" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Both workers and customers must confirm their active mobile number through a 6-digit OTP code.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Eliminates spam bots and fake burner profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Personal numbers protected and never publicly indexed</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Earned Digital Badges */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-teal-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-navy-950">Earned Feedback Badges</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Digital badges are strictly earned via post-service verified customer feedback—never sold or sponsored.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                  🌟 Community Favorite
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ⚡ Prompt Responder
                </span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                  🛡️ Safety First Record
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Reviews are locked to mutually accepted jobs to eliminate bogus smear ratings or fake praise.
              </p>
            </div>

            {/* Card 3: Local Leader & RWA Validation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-navy-950">Local Leader / RWA Validation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Collaboration with local Resident Welfare Associations (RWAs), colony elders, and ward committees.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Neighborhood tradespeople vouched for by local residents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Ward volunteer endorsement channels for non-digital elders</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* PILLAR 2: PROTECT */}
      {(activePillar === 'all' || activePillar === 'protect') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              2
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
                <span>PROTECT: Physical & Digital Safety Safeguards</span>
              </h2>
              <p className="text-xs text-slate-500">
                Active protocols designed to protect vulnerable women workers, households, and tradespeople in the field.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Safety Protocols for Women */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-teal-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-navy-950">Women Workers & Customers Safety</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specialized safeguards for female domestic cleaners, cooks, and women living alone.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Daylight Hours Option:</strong> Default schedule recommendations for daytime visits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Companion Pairing:</strong> Option for domestic helpers to accept jobs in trusted pairs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <span><strong>Zero-Tolerance Code:</strong> Immediate suspension for inappropriate comments or harassment.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Live Job Details Sharing */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-teal-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-navy-950">Live Job Details Sharing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Share your active appointment details, tradesperson name, photo, and live status with a family member in one click.
                </p>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/70 text-xs space-y-2">
                <div className="font-mono text-[10px] text-teal-800">
                  https://kaaryamithra.in/live-visit/visit-98412
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Launch Live Sharing Demo</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Direct integration with WhatsApp and SMS share sheets with emergency helpline speed-dial (112 / 181).
              </p>
            </div>

            {/* Card 3: First Meeting Guidelines */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-navy-950">First-Meeting Practical Checklist</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simple, sensible advice for visiting residential spaces or public consultation spots.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Confirm OTP badge and identity before opening service entrance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Agree explicitly on pricing & scope before commencing tool work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>Keep valuables secured and main entrance unlatched during repair</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* PILLAR 3: RESOLVE & GRIEVANCE REDRESSAL */}
      {(activePillar === 'all' || activePillar === 'resolve') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              3
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
                <span>RESOLVE: In-App Redressal & Accountability</span>
              </h2>
              <p className="text-xs text-slate-500">
                Zero-tolerance dispute handling, automated moderation review triggers, and guaranteed response SLAs.
              </p>
            </div>
          </div>

          {/* Interactive Grievance Redressal Ticket Module */}
          <GrievanceTicketSystem />

          {/* Report & Block Info Banner */}
          <div className="bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 p-6 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>In-App Report & Block Tool</span>
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed max-w-xl">
                Block any harassing user or fraudulent worker instantly. When you block, direct messaging is frozen immediately and an emergency triage ticket is filed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Open Report & Block Modal</span>
            </button>
          </div>
        </section>
      )}

      {/* Community Accountability Section */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-5 border border-slate-800">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>Community Accountability & Governance</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          Public Feedback, Earned Badges & Local Partner Oversight
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-white text-sm">Transparent Public Feedback</h4>
            <p>
              Only customers with completed bookings can submit reviews. Arbitrary downvoting or extortion threats are screened out by verified transaction records.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-white text-sm">Automated Repeat Review Triggers</h4>
            <p>
              If a provider receives 2 or more unresolved complaints within 30 days, their listing is automatically paused and flagged for in-person review with colony leaders.
            </p>
          </div>

          <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-white text-sm">Local Partners Flagging</h4>
            <p>
              Community partners and worker unions hold designated moderator dashboard access to flag safety issues or advocate for wrongful deactivations.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Way Voice Accessibility Section */}
      <VoiceAccessibilityDemo />

      {/* Pilot Phase Disclaimer Note */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-300/80 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 text-teal-600" />
          <span>Innovation Pilot Phase Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
          These safeguards are proposed for our pilot phase and co-designed with the community, informal worker collectives, and resident welfare associations under the Seva First Innovation Challenge.
        </p>
        <p className="text-[11px] text-slate-400">
          KaaryaMithra is an inclusive, non-commission discovery protocol. All simulated mockups demonstrate live system behaviors.
        </p>
      </div>

      {/* Modals */}
      <ShareJobModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetName="Sample Worker / Service Visit"
      />
    </div>
  );
};
