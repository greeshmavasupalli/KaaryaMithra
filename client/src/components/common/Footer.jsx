import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { KaaryaMithraLogo } from './KaaryaMithraLogo.jsx';

export const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 text-sm border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl">
              <KaaryaMithraLogo size={36} showText={true} showTagline={true} />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A responsive, mobile-first platform empowering informal workers and local tradespeople
              with transparent profiles, direct enquiries, voice accessibility, and community trust safeguards.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">Platform</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/services" className="hover:text-teal-600 transition">
                  Browse Service Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-teal-600 transition">
                  Find Local Workers (Near Me & Maps)
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-teal-600 transition">
                  Join as a Worker
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-600 transition">
                  About KaaryaMithra
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">Trust & Safety</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/trust-and-safety" className="text-teal-700 hover:text-teal-800 font-semibold transition flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Trust & Safety Center</span>
                </Link>
              </li>
              <li>
                <Link to="/trust-and-safety#verify" className="hover:text-teal-600 transition">
                  VERIFY: OTP & Badge Validation
                </Link>
              </li>
              <li>
                <Link to="/trust-and-safety#protect" className="hover:text-teal-600 transition">
                  PROTECT: Women's Safety & Live Tracking
                </Link>
              </li>
              <li>
                <Link to="/trust-and-safety#resolve" className="hover:text-teal-600 transition">
                  RESOLVE: In-App Report & Grievance SLAs
                </Link>
              </li>
              <li>
                <Link to="/safety-and-privacy" className="hover:text-teal-600 transition">
                  Data Handling & Contact Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Co-Design Pilot Phase Community Disclaimer */}
        <div className="mt-8 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl text-center">
          <p className="text-xs text-teal-900 leading-relaxed font-medium">
            🛡️ <strong>Pilot Phase Community Disclaimer:</strong> These safeguards are proposed for our pilot phase and co-designed with the community, informal worker collectives, and resident welfare associations.
          </p>
        </div>

        {/* Bottom Bar: Neutral prototype status, NO team name, NO "built by" */}
        <div className="border-t border-slate-200 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">KaaryaMithra</span>
            <span>•</span>
            <span className="text-teal-700 font-medium">Your work your skill</span>
            <span>•</span>
            <span>Seva First Innovation Challenge</span>
          </div>

          <div className="text-slate-500 text-center sm:text-right text-[11px]">
            Unorganised Workforce Integration & Hyperlocal Service Accessibility
          </div>
        </div>
      </div>
    </footer>
  );
};
