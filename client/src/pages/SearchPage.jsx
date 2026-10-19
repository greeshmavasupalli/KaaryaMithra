import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { WorkerCard } from '../components/worker/WorkerCard.jsx';
import { EnquiryModal } from '../components/common/EnquiryModal.jsx';
import { WorkerMapView, calculateDistanceKm, VIZAG_CENTER } from '../components/common/WorkerMapView.jsx';
import { VoiceInputButton } from '../components/common/VoiceAccessibilityModule.jsx';
import { LeftSidebar } from '../components/common/LeftSidebar.jsx';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Navigation,
  Compass,
  Map as MapIcon,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Inputs
  const [service, setService] = useState(searchParams.get('service') || '');
  const [radiusKm, setRadiusKm] = useState(
    searchParams.get('radius') ? Number(searchParams.get('radius')) : 10
  );
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [trustLabel, setTrustLabel] = useState(searchParams.get('trustLabel') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // View state: 'grid' or 'map'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // User live location (default to Vizag center)
  const [userLocation, setUserLocation] = useState(VIZAG_CENTER);
  const [gpsDetected, setGpsDetected] = useState(false);

  // Data states
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Enquiry modal state
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Detect browser geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // If within Andhra Pradesh approx range, use it
          if (pos.coords.latitude > 15 && pos.coords.latitude < 20) {
            setUserLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setGpsDetected(true);
          }
        },
        () => {
          // Fallback gracefully to Visakhapatnam center
          setUserLocation(VIZAG_CENTER);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch workers when search params change
  const fetchWorkers = async () => {
    setLoading(true);
    setError('');

    try {
      const query = {
        service: searchParams.get('service') || undefined,
        category: searchParams.get('category') || undefined,
        availability: searchParams.get('availability') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        trustLabel: searchParams.get('trustLabel') || undefined,
        language: searchParams.get('language') || undefined,
        sortBy: searchParams.get('sortBy') || 'relevance',
        page: searchParams.get('page') || 1,
        limit: 35,
      };

      const res = await api.get('/workers', query);
      if (res.success) {
        // Calculate distance in km from user coordinates for each worker
        const workersWithDistance = res.data.map((w) => {
          const coords = w.approximateCoordinates || {
            latitude: 17.7226 + ((w.displayName.charCodeAt(0) % 7) - 3) * 0.012,
            longitude: 83.3100 + ((w.displayName.charCodeAt(1) % 7) - 3) * 0.012,
          };
          const dist = calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            coords.latitude,
            coords.longitude
          );
          return {
            ...w,
            approximateCoordinates: coords,
            distanceKm: dist,
          };
        });

        // Filter by Near Me radius if set
        const filtered =
          radiusKm > 0
            ? workersWithDistance.filter((w) => w.distanceKm <= radiusKm)
            : workersWithDistance;

        setWorkers(filtered);
        setPagination({
          total: filtered.length,
          page: Number(searchParams.get('page')) || 1,
          pages: Math.ceil(filtered.length / 12) || 1,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to search workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [searchParams, radiusKm, userLocation]);

  // Sync state to URL params on submit
  const applyFilters = (overridePage = 1) => {
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (radiusKm) params.set('radius', radiusKm.toString());
    if (category) params.set('category', category);
    if (availability) params.set('availability', availability);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (trustLabel) params.set('trustLabel', trustLabel);
    if (language) params.set('language', language);
    if (sortBy) params.set('sortBy', sortBy);
    params.set('page', overridePage.toString());

    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setService('');
    setRadiusKm(10);
    setCategory('');
    setAvailability('');
    setMinPrice('');
    setMaxPrice('');
    setTrustLabel('');
    setLanguage('');
    setSortBy('relevance');
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const openEnquiry = (worker) => {
    setSelectedWorker(worker);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar - Locality checking completely deleted; Near Me & Google Map added */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters(1);
          }}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          {/* Skill / Service Input with Voice Input */}
          <div className="flex-1 flex items-center gap-2 w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:bg-white transition">
            <Search className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Search trade or skill (e.g. Electrician, Plumber, Painter, AC Repair)..."
              className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
            />
            {/* Voice microphone button */}
            <VoiceInputButton
              onTranscript={(transcript) => {
                setService(transcript);
              }}
            />
          </div>

          {/* Near Me Option with Distance Radius Dropdown */}
          <div className="flex items-center gap-1.5 w-full md:w-auto px-3 py-2 bg-teal-50/70 rounded-xl border border-teal-200/80">
            <Navigation className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span className="text-xs font-bold text-teal-900 whitespace-nowrap">Near Me:</span>
            <select
              value={radiusKm}
              onChange={(e) => {
                const r = Number(e.target.value);
                setRadiusKm(r);
                const p = new URLSearchParams(searchParams);
                if (r > 0) p.set('radius', r.toString());
                else p.delete('radius');
                setSearchParams(p);
              }}
              className="text-xs font-semibold bg-white border border-teal-300 rounded-lg px-2 py-1 text-teal-900 focus:outline-none cursor-pointer"
            >
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={15}>Within 15 km</option>
              <option value={25}>Within 25 km</option>
              <option value={0}>All City (Unlimited)</option>
            </select>
          </div>

          {/* Action Buttons: Search & Google Map View */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="flex-1 md:flex-none px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer"
            >
              Search
            </button>

            {/* Beside Near Me: Google Map Option */}
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap border border-slate-700 cursor-pointer"
              title="Open Google Map View"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Google Map View</span>
            </button>

            {/* Mobile Filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200"
              aria-label="Open filter panel"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* View Switcher: Card Grid vs Interactive Map */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Display:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'map'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Google Map View</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Near Me Distance Filter: <strong>{radiusKm > 0 ? `${radiusKm} km radius` : 'All City'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar (Filters + Trust & Safety) + Results Grid / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Left Sidebar: Filters & Trust & Safety */}
        <div className="hidden lg:block lg:col-span-1">
          <LeftSidebar
            radiusKm={radiusKm}
            setRadiusKm={(r) => {
              setRadiusKm(r);
              const p = new URLSearchParams(searchParams);
              if (r > 0) p.set('radius', r.toString());
              else p.delete('radius');
              setSearchParams(p);
            }}
            category={category}
            setCategory={setCategory}
            availability={availability}
            setAvailability={setAvailability}
            trustLabel={trustLabel}
            setTrustLabel={setTrustLabel}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            language={language}
            setLanguage={setLanguage}
            categories={categories}
            onApplyFilters={() => applyFilters(1)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Summary and Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{workers.length}</strong> verified tradespeople within{' '}
              <strong className="text-teal-700">{radiusKm > 0 ? `${radiusKm} km` : 'entire area'}</strong>
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const p = new URLSearchParams(searchParams);
                  p.set('sortBy', e.target.value);
                  p.set('page', '1');
                  setSearchParams(p);
                }}
                className="text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50 focus:bg-white focus:outline-none"
              >
                <option value="relevance">Nearest & Relevant</option>
                <option value="rating">Highest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Toggle Display: Google Map View vs Card Grid */}
          {viewMode === 'map' ? (
            <div className="h-[600px] w-full">
              <WorkerMapView
                workers={workers}
                userLocation={userLocation}
                radiusKm={radiusKm}
                onRadiusChange={(r) => setRadiusKm(r)}
                onEnquire={openEnquiry}
              />
            </div>
          ) : (
            <>
              {/* Card Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-slate-200 rounded-xl" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <p className="text-xs font-semibold text-rose-700">{error}</p>
                  <button
                    onClick={fetchWorkers}
                    className="text-xs text-teal-700 underline font-semibold"
                  >
                    Retry Search
                  </button>
                </div>
              ) : workers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No matching local workers found within {radiusKm} km
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Try expanding your "Near Me" radius to 15km or All City, or clearing category filters.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      onClick={() => setRadiusKm(25)}
                      className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                    >
                      Expand to 25 km
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {workers.map((worker) => (
                    <WorkerCard
                      key={worker._id}
                      worker={worker}
                      onSendEnquiry={openEnquiry}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && viewMode === 'grid' && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={pagination.page <= 1}
                onClick={() => applyFilters(pagination.page - 1)}
                className="p-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-600 font-medium px-3">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => applyFilters(pagination.page + 1)}
                className="p-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google Map Full Modal */}
      {isMapModalOpen && (
        <WorkerMapView
          workers={workers}
          userLocation={userLocation}
          radiusKm={radiusKm}
          isModal={true}
          onRadiusChange={(r) => setRadiusKm(r)}
          onClose={() => setIsMapModalOpen(false)}
          onEnquire={(w) => {
            setIsMapModalOpen(false);
            openEnquiry(w);
          }}
        />
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        worker={selectedWorker}
        categories={categories}
      />

      {/* Mobile Left Sidebar Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-0 mr-auto w-full max-w-sm bg-white h-full shadow-2xl p-4 overflow-y-auto z-10">
            <LeftSidebar
              radiusKm={radiusKm}
              setRadiusKm={(r) => {
                setRadiusKm(r);
                const p = new URLSearchParams(searchParams);
                if (r > 0) p.set('radius', r.toString());
                else p.delete('radius');
                setSearchParams(p);
              }}
              category={category}
              setCategory={setCategory}
              availability={availability}
              setAvailability={setAvailability}
              trustLabel={trustLabel}
              setTrustLabel={setTrustLabel}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              language={language}
              setLanguage={setLanguage}
              categories={categories}
              onApplyFilters={() => applyFilters(1)}
              onResetFilters={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
