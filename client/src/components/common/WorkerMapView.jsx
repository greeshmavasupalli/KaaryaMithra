import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  User,
  Star,
  IndianRupee,
  Phone,
  Send,
  X,
  ShieldCheck,
  Clock,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { OtpBadge } from './OtpBadge.jsx';
import { AiVoiceReadoutButton } from './VoiceAccessibilityModule.jsx';

// Default Visakhapatnam Center coordinates
export const VIZAG_CENTER = {
  latitude: 17.7226,
  longitude: 83.3100,
};

// Haversine distance formula in km
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // fallback reasonable distance
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

// Realistic mock customer enquiries with real AP coordinates for worker view
const DEMO_CUSTOMER_ENQUIRIES = [
  {
    id: 'ENQ-MOCK-1',
    customerName: 'Ananya Sharma',
    service: 'Electrician (MCB Tripping & Inverter)',
    locality: 'MVP Colony, Sector 4',
    coordinates: { latitude: 17.7423, longitude: 83.3353 },
    preferredTime: 'Today, 5:00 PM',
    urgency: 'high',
    message: 'Main power switch tripping repeatedly when geyser or AC turned on.',
  },
  {
    id: 'ENQ-MOCK-2',
    customerName: 'Vikram Reddy',
    service: 'Plumber (Overhead Tank Valve Leak)',
    locality: 'Seethammadhara North',
    coordinates: { latitude: 17.7348, longitude: 83.3168 },
    preferredTime: 'Tomorrow Morning',
    urgency: 'medium',
    message: 'Terrace water tank inlet pipe is overflowing. Need ball valve replacement.',
  },
  {
    id: 'ENQ-MOCK-3',
    customerName: 'Priya Rao',
    service: 'House Cleaning (Pre-Festival Kitchen Deep Clean)',
    locality: 'Siripuram Towers',
    coordinates: { latitude: 17.7214, longitude: 83.3204 },
    preferredTime: 'This Saturday',
    urgency: 'low',
    message: 'Kitchen cabinets, chimney degreasing, and utility washroom cleaning.',
  },
  {
    id: 'ENQ-MOCK-4',
    customerName: 'Karthik Varma',
    service: 'Carpenter (Door Lock & Alignment)',
    locality: 'Dwaraka Nagar 2nd Lane',
    coordinates: { latitude: 17.7226, longitude: 83.3082 },
    preferredTime: 'Immediate',
    urgency: 'emergency',
    message: 'Main teakwood entrance door latch jammed from inside.',
  },
  {
    id: 'ENQ-MOCK-5',
    customerName: 'Srinivas Murthy',
    service: 'Mason / Civil Work (Balcony Tile Repair)',
    locality: 'Madhurawada, Sector 2',
    coordinates: { latitude: 17.7984, longitude: 83.3592 },
    preferredTime: 'Next Week',
    urgency: 'low',
    message: 'Weatherproofing and relaying loose terrace tiles before monsoon.',
  },
];

export const WorkerMapView = ({
  workers = [],
  customerEnquiriesList = null,
  onSelectWorker,
  onEnquire,
  userLocation = VIZAG_CENTER,
  radiusKm = 10,
  onRadiusChange,
  isModal = false,
  onClose,
  initialPerspective = 'workers', // 'workers' | 'enquiries'
}) => {
  const [mapPerspective, setMapPerspective] = useState(initialPerspective); // 'workers' | 'enquiries'
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Filter workers based on distance and category
  const filteredWorkers = useMemo(() => {
    return workers
      .map((w) => {
        const coords = w.approximateCoordinates || {
          latitude: 17.7226 + ((w.displayName.charCodeAt(0) % 9) - 4) * 0.012,
          longitude: 83.3100 + ((w.displayName.charCodeAt(1) % 9) - 4) * 0.012,
        };
        const dist = calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          coords.latitude,
          coords.longitude
        );
        return {
          ...w,
          coordinates: coords,
          distanceKm: dist,
        };
      })
      .filter((w) => {
        const withinRadius = !radiusKm || w.distanceKm <= radiusKm;
        const matchesCategory =
          activeCategoryFilter === 'all' ||
          (w.categories &&
            w.categories.some(
              (c) =>
                (typeof c === 'object' ? c.slug : c) === activeCategoryFilter
            ));
        return withinRadius && matchesCategory;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [workers, userLocation, radiusKm, activeCategoryFilter]);

  // Filter customer enquiries with distance
  const filteredEnquiries = useMemo(() => {
    const rawList = customerEnquiriesList && customerEnquiriesList.length > 0 
      ? customerEnquiriesList 
      : DEMO_CUSTOMER_ENQUIRIES;

    return rawList.map((enq) => {
      const coords = enq.coordinates || {
        latitude: 17.7226 + ((enq.locality ? enq.locality.charCodeAt(0) : 70) % 9 - 4) * 0.014,
        longitude: 83.3100 + ((enq.customerName ? enq.customerName.charCodeAt(0) : 65) % 9 - 4) * 0.014,
      };

      const dist = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        coords.latitude,
        coords.longitude
      );
      return {
        ...enq,
        coordinates: coords,
        distanceKm: dist,
      };
    }).filter((enq) => !radiusKm || enq.distanceKm <= radiusKm);
  }, [userLocation, radiusKm, customerEnquiriesList]);

  // Convert GPS coordinates into 2D SVG canvas percentages relative to Vizag bounding box
  // Vizag approx box: lat 17.65 to 17.85, lon 83.15 to 83.40
  const getCoordinatesPct = (lat, lon) => {
    const minLat = 17.66;
    const maxLat = 17.84;
    const minLon = 83.16;
    const maxLon = 83.39;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const userPct = getCoordinatesPct(userLocation.latitude, userLocation.longitude);

  const containerContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
      {/* Top Google Maps Style Header & Controls */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                KaaryaMithra Hyperlocal Live Map
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live GPS Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visakhapatnam Metropolitan & Local Sub-Centres
            </p>
          </div>
        </div>

        {/* Perspective Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => {
              setMapPerspective('workers');
              setSelectedEntity(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              mapPerspective === 'workers'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Find Nearby Workers ({filteredWorkers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setMapPerspective('enquiries');
              setSelectedEntity(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              mapPerspective === 'enquiries'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Worker View: Customer Enquiries ({filteredEnquiries.length})
          </button>
        </div>

        {/* Close button if in modal */}
        {isModal && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Bar: Radius Selector & Category Pills */}
      <div className="bg-slate-950/80 px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        {/* Near Me Radius Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            Near Me Distance:
          </span>
          <div className="flex items-center gap-1">
            {[2, 5, 10, 15, 25].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onRadiusChange && onRadiusChange(km)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                  radiusKm === km
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Within {km} km
              </button>
            ))}
            <button
              type="button"
              onClick={() => onRadiusChange && onRadiusChange(0)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                radiusKm === 0
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All City
            </button>
          </div>
        </div>

        {/* User GPS indicator */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Center: <strong>MVP Colony / Visakhapatnam City</strong></span>
        </div>
      </div>

      {/* Map Canvas Viewport */}
      <div className="relative flex-1 min-h-[460px] sm:min-h-[520px] bg-[#0E1A29] overflow-hidden select-none">
        {/* SVG Styled Vector Map representing Visakhapatnam Coastline, Roads & Blocks */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {/* Landmass background */}
          <rect width="100" height="100" fill="#0F1F33" />

          {/* Bay of Bengal Coastline (Water on east/south-east) */}
          <path
            d="M 68 0 Q 75 25 72 45 T 78 70 Q 82 85 92 100 L 100 100 L 100 0 Z"
            fill="#081423"
          />

          {/* Water wave texture line */}
          <path
            d="M 68 0 Q 75 25 72 45 T 78 70 Q 82 85 92 100"
            stroke="#163152"
            strokeWidth="0.8"
            fill="none"
            strokeDasharray="2,2"
          />

          {/* Major Roads / Highways (NH-16 & Beach Road) */}
          {/* NH-16 Highway through city */}
          <path
            d="M 12 100 Q 30 70 38 48 T 58 10 T 64 0"
            stroke="#1E3858"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Beach Road */}
          <path
            d="M 66 12 Q 71 35 68 55 T 74 78"
            stroke="#1B3F68"
            strokeWidth="0.9"
            fill="none"
          />
          {/* Connecting Arterial Roads */}
          <path d="M 38 48 L 72 45" stroke="#182F4B" strokeWidth="0.7" fill="none" />
          <path d="M 30 70 L 68 62" stroke="#182F4B" strokeWidth="0.7" fill="none" />
          <path d="M 46 32 L 68 28" stroke="#182F4B" strokeWidth="0.7" fill="none" />
          <path d="M 20 85 L 50 82" stroke="#182F4B" strokeWidth="0.7" fill="none" />

          {/* Sub-Centres / Neighborhood Labels on Map */}
          <text x="65" y="32" fill="#385D88" fontSize="2.8" fontWeight="bold">MVP Colony</text>
          <text x="50" y="44" fill="#385D88" fontSize="2.8" fontWeight="bold">Dwaraka Nagar</text>
          <text x="25" y="75" fill="#385D88" fontSize="2.8" fontWeight="bold">Gajuwaka</text>
          <text x="54" y="22" fill="#385D88" fontSize="2.8" fontWeight="bold">Madhurawada</text>
          <text x="60" y="55" fill="#385D88" fontSize="2.8" fontWeight="bold">Siripuram</text>
          <text x="80" y="40" fill="#1C385B" fontSize="3" fontWeight="bold" letterSpacing="1">BAY OF BENGAL</text>

          {/* User's Radius Circle Visualizer */}
          {radiusKm > 0 && (
            <circle
              cx={userPct.x}
              cy={userPct.y}
              r={Math.min(38, radiusKm * 1.8)}
              fill="rgba(13, 148, 136, 0.08)"
              stroke="#0D9488"
              strokeWidth="0.4"
              strokeDasharray="1.5,1.5"
            />
          )}
        </svg>

        {/* User's Live Location Pin */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ left: `${userPct.x}%`, top: `${userPct.y}%` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-teal-400 opacity-60" />
            <div className="w-5 h-5 rounded-full bg-teal-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-bold text-[9px]">
              You
            </div>
          </div>
        </div>

        {/* Mode 1: Render All Verified Workers as Map Markers */}
        {mapPerspective === 'workers' &&
          filteredWorkers.map((worker) => {
            const pct = getCoordinatesPct(
              worker.coordinates.latitude,
              worker.coordinates.longitude
            );
            const isSelected = selectedEntity?._id === worker._id;
            const primaryCat = worker.categories && worker.categories[0];
            const catName = typeof primaryCat === 'object' ? primaryCat.name : 'Trade';

            return (
              <div
                key={worker._id}
                className="absolute -translate-x-1/2 -translate-y-full z-15 cursor-pointer transition-transform duration-150 hover:scale-125"
                style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                onClick={() => setSelectedEntity(worker)}
              >
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border text-[11px] font-bold ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40'
                      : worker.availability === 'available'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-700 text-slate-200 border-slate-500'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">
                    {worker.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] opacity-80">({catName.slice(0, 4)})</span>
                </div>
              </div>
            );
          })}

        {/* Mode 2: Worker View -> Customer Enquiries Markers */}
        {mapPerspective === 'enquiries' &&
          filteredEnquiries.map((enq) => {
            const pct = getCoordinatesPct(
              enq.coordinates.latitude,
              enq.coordinates.longitude
            );
            const isSelected = selectedEntity?.id === enq.id;

            return (
              <div
                key={enq.id}
                className="absolute -translate-x-1/2 -translate-y-full z-15 cursor-pointer transition-transform duration-150 hover:scale-125"
                style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                onClick={() => setSelectedEntity(enq)}
              >
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border text-[11px] font-bold ${
                    isSelected
                      ? 'bg-rose-500 text-white border-white ring-4 ring-rose-400/40'
                      : enq.urgency === 'emergency'
                      ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                      : 'bg-blue-600 text-white border-blue-400'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{enq.customerName.split(' ')[0]}</span>
                  <span className="text-[9px] bg-white/20 px-1 rounded">
                    {enq.distanceKm} km
                  </span>
                </div>
              </div>
            );
          })}

        {/* Selected Entity Info Popup (Google Maps InfoWindow Style) */}
        {selectedEntity && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full max-w-sm sm:max-w-md px-4 z-30 animate-in slide-in-from-bottom-4 duration-150">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-navy-950">
                      {selectedEntity.displayName || selectedEntity.customerName}
                    </h4>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      📍 {selectedEntity.distanceKm} km away
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{selectedEntity.locality}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* If Worker */}
              {selectedEntity.displayName && (
                <div className="space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{selectedEntity.averageRating ? selectedEntity.averageRating.toFixed(1) : '4.8'}</span>
                      <span className="text-slate-400 font-normal">({selectedEntity.reviewCount || 1} verified)</span>
                    </div>

                    <div className="font-bold text-slate-900 flex items-center">
                      <IndianRupee className="w-3 h-3 text-slate-500" />
                      <span>
                        {selectedEntity.indicativePriceMin || 250} - {selectedEntity.indicativePriceMax || 800}
                      </span>
                    </div>

                    <OtpBadge size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {selectedEntity.bio || 'Skilled local service provider offering reliable trades across residential colonies.'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <AiVoiceReadoutButton
                      text={`${selectedEntity.displayName}, ${selectedEntity.locality}. Charges starting from ${selectedEntity.indicativePriceMin || 250} rupees.`}
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => onEnquire && onEnquire(selectedEntity)}
                      className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Enquiry</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Customer Enquiry (Worker View) */}
              {selectedEntity.customerName && (
                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs">
                      Requested Service: {selectedEntity.service}
                    </span>
                    <p className="text-slate-600 text-[11px] mt-1 italic">
                      "{selectedEntity.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedEntity.preferredTime}
                    </span>
                    <span className="font-semibold text-rose-600 uppercase">
                      Urgency: {selectedEntity.urgency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <AiVoiceReadoutButton
                      text={`Customer ${selectedEntity.customerName} in ${selectedEntity.locality} requests ${selectedEntity.service}. Message: ${selectedEntity.message}`}
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => alert(`Simulated Acceptance: Enquiry #${selectedEntity.id} accepted. Customer contact unlocked.`)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Accept Service Job</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Map Zoom & Recenter Controls */}
        <div className="absolute right-4 bottom-5 flex flex-col gap-2 z-20">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 flex items-center justify-center shadow-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 flex items-center justify-center shadow-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedEntity(null);
            }}
            className="w-9 h-9 rounded-xl bg-teal-600 text-white border border-teal-500 hover:bg-teal-500 flex items-center justify-center shadow-lg transition"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-5xl h-[90vh]">{containerContent}</div>
      </div>
    );
  }

  return containerContent;
};
