import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Menu,
  X,
  Globe,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Wrench,
  Search,
  Briefcase,
  ChevronDown,
  MessageSquare,
  Shield,
} from 'lucide-react';

import { KaaryaMithraLogo } from './KaaryaMithraLogo.jsx';

export const Navbar = () => {
  const { user, isWorker, isAdmin, isCustomer, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: KaaryaMithra Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl p-1 transition"
            aria-label="KaaryaMithra Home"
          >
            <KaaryaMithraLogo size={38} showText={true} showTagline={true} />
          </Link>

          {/* Center Navigation Links: Services first, then Find Workers immediately to its right */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/services"
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/services')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('nav.services')}
            </Link>

            <Link
              to="/search"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/search')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-teal-600" />
              <span>{t('nav.findWorkers')}</span>
            </Link>
          </nav>

          {/* Far Right: Language Selector + Profile Option beside each other */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200 transition cursor-pointer"
                aria-expanded={langDropdownOpen}
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>{lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer ${
                      lang === 'en'
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer ${
                      lang === 'hi'
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('te');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer ${
                      lang === 'te'
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                </div>
              )}
            </div>

            {/* Circular Profile Icon with Dropdown beside Language Selector */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-teal-500 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                aria-label="Profile and account menu"
                aria-expanded={profileDropdownOpen}
              >
                {user ? (
                  <span className="font-bold text-xs text-teal-700">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user && (
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] text-slate-500 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                      <span className="inline-block uppercase text-[10px] font-semibold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200 mt-1">
                        {user.role}
                      </span>
                    </div>
                  )}

                  {/* Options: Sign Up, Log In, Join as Worker */}
                  <div className="space-y-0.5">
                    <Link
                      to="/register"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition"
                    >
                      <UserPlus className="w-4 h-4 text-teal-600" />
                      <span>{t('nav.register')} (Sign Up)</span>
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <LogIn className="w-4 h-4 text-slate-500" />
                      <span>{t('nav.login')} (Log In)</span>
                    </Link>

                    <Link
                      to="/join"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition"
                    >
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <span>{t('nav.joinAsWorker')}</span>
                    </Link>
                  </div>

                  {/* User specific logged in dashboard links */}
                  {user && (
                    <>
                      <div className="border-t border-slate-100 my-1" />

                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                          >
                            <MessageSquare className="w-4 h-4 text-teal-600" />
                            <span>My Enquiries</span>
                          </Link>
                          <Link
                            to="/services"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                          >
                            <Briefcase className="w-4 h-4 text-slate-500" />
                            <span>Book a Service</span>
                          </Link>
                        </>
                      )}

                      {isWorker && (
                        <>
                          <Link
                            to="/worker/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                          >
                            <Briefcase className="w-4 h-4 text-teal-600" />
                            <span>{t('nav.dashboard')}</span>
                          </Link>
                          <Link
                            to="/worker/profile/edit"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                          >
                            <Wrench className="w-4 h-4 text-slate-500" />
                            <span>Edit Profile</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                        >
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span>{t('nav.adminPortal')}</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {t('nav.services')}
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-teal-600" />
              <span>{t('nav.findWorkers')}</span>
            </Link>
            <Link
              to="/trust-and-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md flex items-center gap-2"
            >
              <span>Trust & Safety Center</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Account</p>
            <div className="space-y-1">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 rounded-md"
              >
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>{t('nav.register')} (Sign Up)</span>
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>{t('nav.login')} (Log In)</span>
              </Link>
              <Link
                to="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-md"
              >
                <Wrench className="w-4 h-4 text-saffron-600" />
                <span>{t('nav.joinAsWorker')}</span>
              </Link>

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>{t('nav.logout')} ({user.displayName})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
