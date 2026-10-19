import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, Wrench } from 'lucide-react';

export const DemoBanner = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const handleDemoSwitch = async (roleKey, redirectPath) => {
    try {
      setLoadingRole(roleKey);
      await quickDemoLogin(roleKey);
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Demo login failed', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="bg-slate-100 text-slate-700 text-xs border-b border-slate-200 px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={loadingRole !== null}
            onClick={() => handleDemoSwitch('customer', '/customer/dashboard')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 px-2.5 py-1 rounded-md shadow-2xs transition disabled:opacity-50 cursor-pointer text-xs font-semibold"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Try as Customer</span>
          </button>

          <button
            type="button"
            disabled={loadingRole !== null}
            onClick={() => handleDemoSwitch('worker', '/worker/dashboard')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-md shadow-2xs transition disabled:opacity-50 cursor-pointer text-xs font-semibold"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            <span>Try as Worker</span>
          </button>

          <button
            type="button"
            disabled={loadingRole !== null}
            onClick={() => handleDemoSwitch('admin', '/admin')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded-md shadow-2xs transition disabled:opacity-50 cursor-pointer text-xs font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Try as Admin</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center space-x-1.5 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
              <span className="text-slate-500">Active:</span>
              <span className="font-semibold text-slate-800">{user.displayName}</span>
              <span className="uppercase text-[9px] font-bold bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded border border-teal-200">
                {user.role}
              </span>
            </div>
          )}

          <div className="text-[11px] text-slate-600">
            Simulated OTP code: <strong className="text-teal-700 font-mono font-bold">123456</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

