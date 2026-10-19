import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Our Vision & Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          About KaaryaMithra
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          KaaryaMithra is an open, community-first discovery directory built to connect local households
          and businesses with unorganised, informal workforce tradespeople.
        </p>
      </div>

      {/* Context note specified in prompt */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
        <strong>Context:</strong> This is a student innovation prototype built for the Seva First Innovation Challenge.
      </div>

      {/* Problem Statement */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-950">The Core Problem</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In Indian cities, towns, and suburban localities, over 90% of household service needs—such as plumbing,
          electrical wiring, masonry, carpentry, deep cleaning, and appliance servicing—are delivered by informal
          workers.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          However, traditional aggregator apps frequently charge prohibitive lead fees, levy 20–30% commissions,
          demand steep onboarding requirements, or impose algorithmic penalties that exclude grassroots workers.
          Meanwhile, customers struggle to find trustworthy, nearby help without relying on unreliable word-of-mouth.
        </p>
      </div>

      {/* Core Promises */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-teal-600 font-bold text-sm">1. 100% Free Access</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Workers are never charged commissions, listing subscriptions, or lead fees.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-teal-600 font-bold text-sm">2. Transparent Trust</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clear labels show verified phone controls, community references, and sample photos without inflated claims.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-teal-600 font-bold text-sm">3. Privacy Safeguards</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Worker contact details are safeguarded and only revealed when both parties accept an enquiry.
          </p>
        </div>
      </div>

      {/* Honest Prototype Statement */}
      <div className="bg-slate-50 text-slate-700 p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs leading-relaxed">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Prototype Scope & Simulated Integrations
        </h3>
        <p>
          KaaryaMithra is demonstrated as a functional conceptual prototype. To maintain realistic engineering honesty:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Seeded profiles and reviews represent fictional demonstration accounts (primarily modeled around Visakhapatnam and neighboring Andhra Pradesh localities).</li>
          <li>SMS and OTP verifications are simulated using standard prototype codes (e.g., demo code <code className="text-teal-700 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">123456</code>).</li>
          <li>Distances are based on service radius parameters rather than paid proprietary mapping APIs.</li>
          <li>Voice-assisted onboarding is planned as a future initiative for regional language speech recognition.</li>
        </ul>
      </div>

      <div className="pt-2 text-center">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-teal-700 transition"
        >
          Explore Local Service Discovery
        </Link>
      </div>
    </div>
  );
};
