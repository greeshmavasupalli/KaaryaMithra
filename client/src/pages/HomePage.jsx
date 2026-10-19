import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Users,
  FileCheck,
  CheckCircle2,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Utensils,
  Car,
  Boxes,
  Scissors,
  Tv,
  Trees,
  BookOpen,
  Navigation,
  Compass,
  Mic,
  Share2,
  Ban,
  Clock,
} from 'lucide-react';
import { WorkerMapView } from '../components/common/WorkerMapView.jsx';
import { VoiceInputButton, AiVoiceReadoutButton } from '../components/common/VoiceAccessibilityModule.jsx';

const ICON_MAP = {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Sparkles,
  Utensils,
  Car,
  Boxes,
  Scissors,
  Tv,
  Trees,
  BookOpen,
};

export const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [service, setService] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const [catRes, workerRes] = await Promise.all([
          api.get('/categories'),
          api.get('/workers', { limit: 35 }),
        ]);
        if (catRes.success) {
          setCategories(catRes.data);
        }
        if (workerRes.success) {
          setAllWorkers(workerRes.data);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set('service', service.trim());
    if (radiusKm) params.set('radius', radiusKm.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-teal-50/20 to-slate-50 text-slate-900 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-teal-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="tracking-wide uppercase font-bold text-[11px]">Your work your skill</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {t('hero.tagline')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search Box - Locality Checking Completely Removed; Near Me & Voice Search Added */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-3 rounded-2xl shadow-xl max-w-3xl mx-auto border border-slate-200 text-slate-800 flex flex-col md:flex-row items-center gap-2.5"
          >
            {/* Service & Voice Input */}
            <div className="flex-1 flex items-center gap-2 w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:bg-white transition">
              <Search className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="What service do you need? (e.g. Electrician, Plumber, Clean)"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
              />
              {/* Voice Input Microphone for uneducated persons */}
              <VoiceInputButton
                onTranscript={(transcript) => setService(transcript)}
              />
            </div>

            {/* Near Me Distance Selector */}
            <div className="flex items-center gap-1.5 w-full md:w-auto px-3 py-2 bg-teal-50/70 rounded-xl border border-teal-200/80">
              <Navigation className="w-4 h-4 text-teal-700 flex-shrink-0" />
              <span className="text-xs font-bold text-teal-900 whitespace-nowrap">Near Me:</span>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="text-xs font-semibold bg-white border border-teal-300 rounded-lg px-2 py-1 text-teal-900 focus:outline-none cursor-pointer"
              >
                <option value={2}>Within 2 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={15}>Within 15 km</option>
                <option value={25}>Within 25 km</option>
              </select>
            </div>

            {/* Submit Find Workers */}
            <button
              type="submit"
              className="w-full md:w-auto px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Find Workers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Google Map View Button */}
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="w-full md:w-auto px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap border border-slate-700 cursor-pointer"
              title="Open Google Map View"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Google Map</span>
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
            <span className="font-semibold text-slate-500">Quick Filters:</span>
            {[
              { label: '⚡ Electricians Near Me', query: 'Electrician' },
              { label: '🔧 Plumbers Within 5km', query: 'Plumber' },
              { label: '🧹 Deep Cleaners', query: 'House Cleaning' },
              { label: '🔨 Carpenters', query: 'Carpenter' },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setService(chip.query);
                  navigate(`/search?service=${encodeURIComponent(chip.query)}&radius=5`);
                }}
                className="bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Framework Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Three Core Pillars: VERIFY • PROTECT • RESOLVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Integrated Trust & Safety Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Co-designed for the Seva First Innovation Challenge: Phone (OTP) authentication, live visit tracking with emergency contacts, first-meeting guidelines for women, in-app report & block, and guaranteed 2h emergency grievance redressal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              to="/trust-and-safety"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Explore Trust & Safety Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <AiVoiceReadoutButton
              text="Explore KaaryaMithra Trust and Safety Framework. Verified Phone OTP, Live Job Details Sharing, In-App Report and Block, and Grievance Redressal."
            />
          </div>
        </div>
      </section>

      {/* Google Map Modal when opened from Home */}
      {isMapModalOpen && (
        <WorkerMapView
          workers={allWorkers}
          isModal={true}
          radiusKm={radiusKm}
          onRadiusChange={(r) => setRadiusKm(r)}
          onClose={() => setIsMapModalOpen(false)}
          onEnquire={(w) => {
            setIsMapModalOpen(false);
            navigate(`/workers/${w.slug || w._id}`);
          }}
        />
      )}

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('categories.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with skilled informal workers across 12 essential service categories.
            </p>
          </div>
          <Link
            to="/services"
            id="view-all-categories-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span>{t('categories.viewAll')}</span>
          </Link>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Wrench;
              return (
                <div
                  key={cat._id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-teal-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group h-full"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center mb-3 shadow-inner">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-teal-700 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {cat.description || 'Verified local service'}
                    </span>
                  </div>

                  {/* Clearly visible clicking button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/search?category=${cat.slug}`)}
                    id={`cat-btn-${cat.slug}`}
                    className="mt-3.5 w-full py-2 px-2.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold text-xs rounded-xl border border-teal-200 hover:border-teal-600 shadow-xs hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    <span>Find Workers</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How It Works (For Customers & Workers) */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              {t('hero.howItWorksTitle')}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for low digital friction, transparent community trust, and direct neighborhood connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Customers */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950">{t('hero.howForCustomers')}</h3>
                  <span className="text-xs text-slate-500">Fast, local, direct assistance</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Search by service & neighborhood:</strong> Find nearby electricians, plumbers, cooks, or cleaners within your locality.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Review honest trust labels:</strong> View real badges (Phone confirmed, references, skill evidence) without inflated marketing badges.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Send direct enquiry:</strong> Describe your requirement. Contact details are shared safely upon mutual acceptance.
                  </div>
                </div>
              </div>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-4 py-2.5 rounded-lg border border-teal-200 transition"
              >
                <span>Find a Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* For Workers */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950">{t('hero.howForWorkers')}</h3>
                  <span className="text-xs text-slate-500">Free forever, no commission cuts</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">100% Free Access:</strong> Workers are never charged commission or lead fees. Basic access is always unrestricted.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Control your terms & availability:</strong> Set your own service radius, indicative prices, and toggle your availability on/off anytime.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Build your local reputation:</strong> Earn genuine customer feedback on completed jobs without corporate algorithmic penalties.
                  </div>
                </div>
              </div>

              <Link
                to="/join"
                className="inline-flex items-center gap-2 text-xs font-semibold text-saffron-800 hover:text-saffron-900 bg-saffron-50 px-4 py-2.5 rounded-lg border border-saffron-200 transition"
              >
                <span>Join as a Worker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safeguards Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Transparent & Realistic Safeguards</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Honest Trust Badges with Clear Explanations
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              KaaryaMithra never fabricates claims like "certified professional" or "background checked".
              Instead, we provide transparent, factual indicators of verifiable information.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <PhoneCall className="w-6 h-6 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">Phone Confirmed</h4>
                <p className="text-[11px] text-slate-600">
                  Worker controls their listed mobile number via simulated or SMS OTP verification.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <Users className="w-6 h-6 text-teal-600" />
                <h4 className="text-xs font-bold text-slate-900">Community Reference</h4>
                <p className="text-[11px] text-slate-600">
                  Contact references submitted by local community members or repeat clients.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <FileCheck className="w-6 h-6 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">Skill Evidence</h4>
                <p className="text-[11px] text-slate-600">
                  Photographic samples of toolkits, workshop installations, or past work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inclusion Mission Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Unorganised Workforce Integration & Hyperlocal Accessibility
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Over 90% of local services in Indian cities and towns are provided by informal workers who are often
          priced out or excluded by complex corporate platforms with commission fees. KaaryaMithra acts as an open,
          neutral discovery directory ensuring that every skill gets visibility and respect.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/about"
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            Learn about our mission and principles →
          </Link>
        </div>
      </section>
    </div>
  );
};
