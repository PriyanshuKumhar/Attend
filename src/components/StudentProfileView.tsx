import React from 'react';
import { useApp } from '../context/AppContext';

export const StudentProfileView: React.FC = () => {
  const { currentStudent } = useApp();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111c2d]">Student Identity & Security</h1>
        <p className="text-xs text-[#515f74] mt-0.5">
          Cryptographically tied hardware profile and verified institutional credentials
        </p>
      </div>

      {/* Digital Student ID Badge */}
      <div className="bg-gradient-to-br from-[#00346f] via-[#004a99] to-[#00214a] rounded-2xl p-6 text-white shadow-xl max-w-lg relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute right-12 top-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-200">
              Metropolitan University of Technology
            </span>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">Student Campus Pass</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase">
            Active
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4 relative z-10">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/40 shadow-md"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{currentStudent.name}</h3>
            <p className="text-xs text-blue-200 font-mono">{currentStudent.studentId}</p>
            <p className="text-xs text-blue-100/80 mt-0.5">{currentStudent.major} • Class of {currentStudent.year}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
          <div>
            <span className="text-[10px] text-blue-200 block uppercase">Device Fingerprint</span>
            <span className="font-mono text-[11px] text-white">{currentStudent.deviceFingerprint}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-blue-200 block uppercase">Status</span>
            <span className="font-bold text-emerald-300">Biometrically Bound</span>
          </div>
        </div>
      </div>

      {/* Security & Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111c2d]">
            <span className="material-symbols-outlined text-[#00346f] text-[18px]">fingerprint</span>
            Hardware Anti-Proxy Lock
          </div>
          <p className="text-xs text-[#515f74] mt-2 leading-relaxed">
            This account is cryptographically pinned to this device's TPM/Secure Enclave. Proxy sign-ins from other phones will be rejected.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111c2d]">
            <span className="material-symbols-outlined text-[#004a99] text-[18px]">gps_fixed</span>
            Live Geofencing Active
          </div>
          <p className="text-xs text-[#515f74] mt-2 leading-relaxed">
            Attendance relies on high-accuracy GPS & WiFi positioning to ensure physical presence inside lecture halls.
          </p>
        </div>
      </div>
    </div>
  );
};
