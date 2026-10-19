import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Navigation,
  ArrowRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const LeftSidebar = ({
  radiusKm = 10,
  setRadiusKm,
  category = '',
  setCategory,
  availability = '',
  setAvailability,
  trustLabel = '',
  setTrustLabel,
  minPrice = '',
  setMinPrice,
  maxPrice = '',
  setMaxPrice,
  language = '',
  setLanguage,
  categories = [],
  onApplyFilters,
  onResetFilters,
  onCloseMobile,
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  // Active filter count
  const activeCount = [
    category,
    availability,
    trustLabel,
    minPrice,
    maxPrice,
    language,
    radiusKm !== 10 && radiusKm > 0,
  ].filter(Boolean).length;

  return (
    <aside className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-navy-950">Discovery Menu</span>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Option 1: Filters (Expandable / Collapsible) */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 overflow-hidden transition-all">
        {/* Accordion Toggle Header */}
        <div className="p-3 bg-white flex items-center justify-between border-b border-slate-100">
          <button
            type="button"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center gap-2 font-bold text-xs sm:text-sm text-navy-950 hover:text-teal-700 transition cursor-pointer flex-1 text-left"
            aria-expanded={isFiltersExpanded}
          >
            <Filter className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                {activeCount}
              </span>
            )}
            <span className="ml-auto text-slate-400 pr-2">
              {isFiltersExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Collapsible Filter Body */}
        {isFiltersExpanded && (
          <div className="p-3.5 space-y-4 text-xs animate-in fade-in duration-150">
            {/* Radius Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  <span>Near Me Radius</span>
                </label>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                  {radiusKm > 0 ? `${radiusKm} km` : 'All City'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                {[2, 5, 10, 15, 25, 0].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => setRadiusKm && setRadiusKm(km)}
                    className={`py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer ${
                      radiusKm === km
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {km === 0 ? 'All City' : `${km} km`}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Category Filter */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Trade Category</label>
              <select
                value={category}
                onChange={(e) => setCategory && setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability && setAvailability(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="">Any Availability</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy / In Service</option>
                <option value="away">Away / On Leave</option>
              </select>
            </div>

            {/* Trust Safeguards */}
            {setTrustLabel && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Trust Indicator</label>
                <select
                  value={trustLabel}
                  onChange={(e) => setTrustLabel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="">All Verified Workers</option>
                  <option value="phone_confirmed">Phone (OTP) Confirmed</option>
                  <option value="community_reference">Community Reference Added</option>
                  <option value="skill_evidence">Skill Evidence Submitted</option>
                </select>
              </div>
            )}

            {/* Indicative Budget */}
            {setMinPrice && setMaxPrice && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Indicative Budget (₹)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Language Preference */}
            {setLanguage && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="">Any Language</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                </select>
              </div>
            )}

            {/* Apply Button */}
            {onApplyFilters && (
              <button
                type="button"
                onClick={() => {
                  onApplyFilters();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Apply Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Option 2: Trust & Safety (Navigate to its existing page) */}
      <div className="pt-1">
        <Link
          to="/trust-and-safety"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
          }}
          className="group flex items-start gap-3 p-3.5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 hover:from-emerald-100/70 hover:to-teal-100/50 transition shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-emerald-950 group-hover:text-emerald-800">
                Trust & Safety
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-emerald-800/80 leading-snug mt-0.5">
              Verified phone OTP, job sharing, and 2h grievance redressal.
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSidebar;
