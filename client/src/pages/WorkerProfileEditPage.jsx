import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { TrustBadge } from '../components/common/TrustBadge.jsx';
import {
  Save,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Plus,
  Trash2,
  Shield,
  MapPin,
  IndianRupee,
} from 'lucide-react';

export const WorkerProfileEditPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [skillsText, setSkillsText] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [locality, setLocality] = useState('');
  const [districtCity, setDistrictCity] = useState('Visakhapatnam');
  const [state, setState] = useState('Andhra Pradesh');
  const [serviceRadius, setServiceRadius] = useState(10);
  const [indicativePriceMin, setIndicativePriceMin] = useState('');
  const [indicativePriceMax, setIndicativePriceMax] = useState('');
  const [languagesText, setLanguagesText] = useState('Telugu, Hindi');
  const [availability, setAvailability] = useState('available');
  const [contactPreference, setContactPreference] = useState('in_app');
  const [contactVisibility, setContactVisibility] = useState('accepted_enquiries_only');
  const [profileStatus, setProfileStatus] = useState('published');

  // Preview state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, profileRes] = await Promise.all([
          api.get('/categories'),
          api.get('/worker-profile/me'),
        ]);

        if (catRes.success) setCategories(catRes.data);

        if (profileRes.success && profileRes.data) {
          const p = profileRes.data;
          setProfile(p);
          setDisplayName(p.displayName || '');
          setSelectedCategories(
            p.categories ? p.categories.map((c) => (typeof c === 'object' ? c._id : c)) : []
          );
          setSkillsText(p.skills ? p.skills.join(', ') : '');
          setBio(p.bio || '');
          setExperienceYears(p.experienceYears || 0);
          setLocality(p.locality || '');
          setDistrictCity(p.districtCity || 'Visakhapatnam');
          setState(p.state || 'Andhra Pradesh');
          setServiceRadius(p.serviceRadius || 10);
          setIndicativePriceMin(p.indicativePriceMin !== null ? p.indicativePriceMin : '');
          setIndicativePriceMax(p.indicativePriceMax !== null ? p.indicativePriceMax : '');
          setLanguagesText(p.languages ? p.languages.join(', ') : 'Telugu, Hindi');
          setAvailability(p.availability || 'available');
          setContactPreference(p.contactPreference || 'in_app');
          setContactVisibility(p.contactVisibility || 'accepted_enquiries_only');
          setProfileStatus(p.profileStatus || 'published');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryToggle = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) {
        setError('Please keep at least one primary service category selected.');
        return;
      }
      setSelectedCategories(selectedCategories.filter((id) => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const languagesArray = languagesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      setError('Please provide at least one skill.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        displayName,
        categories: selectedCategories,
        skills: skillsArray,
        bio,
        experienceYears: Number(experienceYears),
        locality,
        districtCity,
        state,
        serviceRadius: Number(serviceRadius),
        indicativePriceMin: indicativePriceMin !== '' ? Number(indicativePriceMin) : null,
        indicativePriceMax: indicativePriceMax !== '' ? Number(indicativePriceMax) : null,
        languages: languagesArray,
        availability,
        contactPreference,
        contactVisibility,
        profileStatus,
      };

      const res = await api.patch('/worker-profile/me', payload);
      if (res.success) {
        setProfile(res.data);
        setMessage('Your worker profile has been updated and published!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const confirmation = window.confirm(
      newStatus === 'deactivated'
        ? 'Are you sure you want to deactivate your profile? You will not appear in customer searches.'
        : 'Request permanent profile removal? An admin will review and process your request.'
    );
    if (!confirmation) return;

    try {
      const res = await api.patch('/worker-profile/me', { profileStatus: newStatus });
      if (res.success) {
        setProfileStatus(newStatus);
        setMessage(`Profile status set to: ${newStatus}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile status.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-20 bg-slate-200 rounded-2xl" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/worker/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Worker Dashboard</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-teal-600" />
            <span>Preview Profile</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Edit Worker Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your skills, locality, and indicative charges up to date for local neighbors.
          </p>
        </div>

        {message && (
          <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Basic Identity */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Basic Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Short Bio / Background (max 1000 characters)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Describe your trade experience, typical services provided, and work ethics..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                maxLength={1000}
              />
              <div className="text-[10px] text-slate-400 text-right mt-1">
                {bio.length} / 1000 characters
              </div>
            </div>
          </div>

          {/* 2. Service Categories & Skills */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Categories & Skills
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Primary Categories <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => {
                  const isChecked = selectedCategories.includes(c._id);
                  return (
                    <button
                      type="button"
                      key={c._id}
                      onClick={() => handleCategoryToggle(c._id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{c.name}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Specific Skills (comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. Inverter wiring, Switchboards, MCB replacement, Ceiling fan"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Separate distinct skills with commas so customers can find you via keyword search.
              </span>
            </div>
          </div>

          {/* 3. Location & Service Radius */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Locality & Working Area
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Locality / Neighborhood <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. MVP Colony"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  District / City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={districtCity}
                  onChange={(e) => setDistrictCity(e.target.value)}
                  placeholder="e.g. Visakhapatnam"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Andhra Pradesh"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Service Radius: <strong>{serviceRadius} km</strong>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(e.target.value)}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 km (immediate neighborhood)</span>
                <span>25 km</span>
                <span>50 km (wider metro)</span>
              </div>
            </div>
          </div>

          {/* 4. Indicative Pricing & Languages */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Indicative Pricing & Languages
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Indicative Minimum Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={indicativePriceMin}
                  onChange={(e) => setIndicativePriceMin(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Indicative Maximum Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={indicativePriceMax}
                  onChange={(e) => setIndicativePriceMax(e.target.value)}
                  placeholder="e.g. 800"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Languages Spoken (comma separated)
              </label>
              <input
                type="text"
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder="e.g. Telugu, Hindi, English"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Privacy & Availability Settings */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Privacy & Availability Safeguards
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="available">Available Now for Work</option>
                  <option value="busy">Busy / Fully Booked</option>
                  <option value="away">Away / Vacation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number Visibility
                </label>
                <select
                  value={contactVisibility}
                  onChange={(e) => setContactVisibility(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="accepted_enquiries_only">
                    Share only after I accept an enquiry (Default Safe)
                  </option>
                  <option value="private">
                    Keep completely private (Use in-app messages only)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Profile Discovery Status
              </label>
              <select
                value={profileStatus}
                onChange={(e) => setProfileStatus(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="published">Published (Discoverable in search)</option>
                <option value="draft">Draft (Hidden while being edited)</option>
                <option value="deactivated">Deactivated (Temporarily paused)</option>
                <option value="removal_requested">Removal Requested (Pending deletion)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStatusChange('deactivated')}
                className="text-xs text-amber-700 hover:text-amber-800 underline"
              >
                Deactivate Profile
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleStatusChange('removal_requested')}
                className="text-xs text-rose-600 hover:text-rose-700 underline"
              >
                Request Profile Removal
              </button>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving changes...' : 'Save & Publish Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Eye className="w-4 h-4 text-teal-600" />
                <span>Public Profile Preview</span>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-800 to-teal-800 text-white font-bold flex items-center justify-center text-lg">
                  {displayName.slice(0, 2).toUpperCase() || 'WD'}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-navy-950">{displayName || 'Worker Name'}</h3>
                  <div className="text-xs text-slate-500">
                    {locality || 'Locality'}, {districtCity} ({state})
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block capitalize">
                    {availability}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border text-xs text-slate-600 leading-relaxed">
                {bio || 'No bio provided yet.'}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillsText
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                    .map((sk, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {sk}
                      </span>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border">
                <div>
                  <span className="text-slate-400 text-[10px] block">Indicative Pricing</span>
                  <span className="font-semibold text-slate-800">
                    {indicativePriceMin ? `₹${indicativePriceMin} – ₹${indicativePriceMax || '+'}` : 'Direct quote'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Service Area</span>
                  <span className="font-semibold text-slate-800">Within {serviceRadius} km</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-teal-600 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
