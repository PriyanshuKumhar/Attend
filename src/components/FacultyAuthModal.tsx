import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const FacultyAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    setUserRole, 
    setCurrentView,
    addNotification
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin' || pin === '') {
      setUserRole('professor');
      setCurrentView('professor-dashboard');
      setIsAuthModalOpen(false);
      setPin('');
      setError(false);
      addNotification({
        title: 'Faculty Portal Authenticated',
        message: 'Logged in as Dr. Sarah Chen (Department Head).',
        type: 'success'
      });
    } else {
      setError(true);
    }
  };

  const handleQuickDemoAccess = () => {
    setUserRole('professor');
    setCurrentView('professor-dashboard');
    setIsAuthModalOpen(false);
    setPin('');
    setError(false);
    addNotification({
      title: 'Faculty Portal Authenticated',
      message: 'Logged in as Dr. Sarah Chen (Department Head).',
      type: 'success'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d3] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00346f] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111c2d]">Faculty Clearance Required</h3>
              <p className="text-[11px] text-gray-500">Restricted to Professors & Administrators</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsAuthModalOpen(false); setPin(''); setError(false); }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Warning Badge for Student */}
        <div className="my-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-amber-700 text-[18px] mt-0.5">security</span>
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Access Control:</span> Students cannot access grading, active broadcast sessions, or attendance audit logs.
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1.5">
              Enter Faculty PIN / Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter PIN (Demo default: 1234)"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                autoFocus
                className={`w-full bg-[#f0f3ff] border rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono text-[#111c2d] focus:outline-none transition-all ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#c2c6d3] focus:border-[#00346f]'
                }`}
              />
              <span className="material-symbols-outlined text-gray-400 text-[18px] absolute left-3 top-2.5">
                key
              </span>
            </div>
            {error && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">
                Invalid faculty PIN. Try 1234 or use Instant Faculty Auth below.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Authenticate as Faculty
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2 bg-[#dee8ff] text-[#00346f] text-xs font-bold rounded-xl hover:bg-[#d5e3fc] transition-all cursor-pointer"
            >
              Instant Faculty Sign-In (Demo 1-Click)
            </button>

            <button
              type="button"
              onClick={() => { setIsAuthModalOpen(false); setPin(''); }}
              className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel & Stay in Student Portal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
