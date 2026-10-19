import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto my-20 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-teal-600">
        <Search className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-navy-950">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or service listing you requested does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Workers</span>
        </Link>
      </div>
    </div>
  );
};
