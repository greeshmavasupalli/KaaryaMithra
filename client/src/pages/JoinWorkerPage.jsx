import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Shield,
  IndianRupee,
  Mic,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';

export const JoinWorkerPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-100 text-saffron-800 border border-saffron-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Worker Empowerment & Inclusion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          Put Your Skills to Work in Your Local Neighborhood
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          KaaryaMithra is built especially for informal workers, independent technicians, and artisans.
          Get discovered by nearby households without middleman commissions or restrictive algorithms.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
          >
            <span>Create Free Worker Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Core Principles for Workers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Zero Commission Forever</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We never take cuts from your hard-earned wages. You agree on rates directly with the customer.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Privacy Under Your Control</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your phone number is hidden from the public internet. Contact is only unlocked when you accept a job.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Flexible Availability</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Toggle your availability on or off anytime with one click from your worker dashboard.
          </p>
        </div>
      </div>

      {/* 3 Step Process */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900">How to get started in 3 steps:</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2">
            <div className="font-bold text-teal-700 text-sm">Step 1: Sign Up</div>
            <p className="leading-relaxed">
              Register with your name, service category, and locality. Optionally confirm your phone with our simulated SMS code.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-teal-700 text-sm">Step 2: Setup Profile</div>
            <p className="leading-relaxed">
              Add your skills, experience years, indicative charges, and service radius. Preview your public listing before publishing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-teal-700 text-sm">Step 3: Receive Enquiries</div>
            <p className="leading-relaxed">
              Neighbors reach out with their service needs. Respond, schedule, and earn positive community feedback!
            </p>
          </div>
        </div>
      </div>

      {/* Voice Assisted Onboarding - Clearly labeled Coming Soon */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800">Voice-Assisted Onboarding</h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                Coming soon
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Future releases will support spoken voice onboarding in Telugu and Hindi for low-literacy workers.
            </p>
          </div>
        </div>

        <button
          disabled
          className="px-4 py-2 bg-slate-200 text-slate-400 font-medium text-xs rounded-lg cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
        >
          <span>Get Started as a Worker</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
