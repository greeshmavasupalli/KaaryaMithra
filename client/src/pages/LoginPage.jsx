import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, LogIn, Sparkles, UserCheck, Wrench, Shield } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.user.role === 'worker') {
        navigate(redirectPath !== '/' ? redirectPath : '/worker/dashboard');
      } else if (res.user.role === 'admin') {
        navigate(redirectPath !== '/' ? redirectPath : '/admin');
      } else {
        navigate(redirectPath !== '/' ? redirectPath : '/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type, path) => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin(type);
      navigate(path);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-navy-950">Welcome Back to KaaryaMithra</h1>
        <p className="text-xs text-slate-500">
          Sign in to manage your worker profile or track your service enquiries.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>One-Click Prototype Demo Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer', '/customer/dashboard')}
              className="p-2 text-[11px] bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg text-slate-700 font-medium transition text-center"
            >
              Customer (Ananya)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('worker', '/worker/dashboard')}
              className="p-2 text-[11px] bg-slate-50 hover:bg-saffron-50 hover:text-saffron-800 border border-slate-200 rounded-lg text-slate-700 font-medium transition text-center"
            >
              Worker (Ramesh)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '/admin')}
              className="p-2 text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200 rounded-lg text-slate-700 font-medium transition text-center"
            >
              Admin Portal
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
