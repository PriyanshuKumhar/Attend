import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, addNotification } = useApp();

  const [geofence, setGeofence] = useState(settings.defaultGeofenceRadius);
  const [rotation, setRotation] = useState(settings.qrRotationInterval);
  const [lateWindow, setLateWindow] = useState(settings.allowLateWindowMinutes);
  const [strictDevice, setStrictDevice] = useState(settings.antiProxyStrictDeviceCheck);
  const [biometric, setBiometric] = useState(settings.biometricOptional);
  const [buildingName, setBuildingName] = useState(settings.defaultBuilding);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultGeofenceRadius: geofence,
      qrRotationInterval: rotation,
      allowLateWindowMinutes: lateWindow,
      antiProxyStrictDeviceCheck: strictDevice,
      biometricOptional: biometric,
      defaultBuilding: buildingName,
    });

    setSavedSuccess(true);
    addNotification({
      title: 'Settings Updated',
      message: 'Geofence radius and anti-proxy security parameters saved.',
      type: 'success'
    });

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#111c2d] tracking-tight">System & Security Settings</h1>
        <p className="text-xs text-[#515f74] mt-0.5">
          Configure anti-proxy cryptographic policies, geofence radius bounds, and lecture hall locations.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Settings successfully updated and deployed to active sessions.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Geofence & Location */}
        <div className="bg-white p-6 rounded-xl border border-[#c2c6d3]/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="material-symbols-outlined text-[#00346f]">location_on</span>
            <h2 className="text-sm font-bold text-[#111c2d]">Classroom Geofencing Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Default Geofence Radius: <span className="text-[#004a99] font-mono">{geofence} meters</span>
              </label>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={geofence}
                onChange={(e) => setGeofence(Number(e.target.value))}
                className="w-full accent-[#00346f]"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Recommended: 50m for standard classrooms, 100m for large tiered auditoriums.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">Primary Hall Location</label>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: QR Cryptography & Anti-Proxy Security */}
        <div className="bg-white p-6 rounded-xl border border-[#c2c6d3]/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="material-symbols-outlined text-[#00346f]">security</span>
            <h2 className="text-sm font-bold text-[#111c2d]">Anti-Proxy & QR Code Security</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Dynamic QR Rotation Frequency: <span className="text-[#004a99] font-mono">{rotation} seconds</span>
              </label>
              <select
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium"
              >
                <option value={5}>5 seconds (Ultra-High Security - Prevents instant photo relay)</option>
                <option value={7}>7 seconds (Optimal / Recommended)</option>
                <option value={10}>10 seconds (Standard)</option>
                <option value={15}>15 seconds (Relaxed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Late Arrival Tolerance Window
              </label>
              <select
                value={lateWindow}
                onChange={(e) => setLateWindow(Number(e.target.value))}
                className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium"
              >
                <option value={5}>5 minutes after class start</option>
                <option value={10}>10 minutes after class start</option>
                <option value={15}>15 minutes (Standard)</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-3 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictDevice}
                onChange={(e) => setStrictDevice(e.target.checked)}
                className="w-4 h-4 accent-[#00346f] rounded"
              />
              <div>
                <span className="text-xs font-bold text-[#111c2d] block">Strict Hardware Device Fingerprinting</span>
                <span className="text-[11px] text-gray-500">Prevent students from logging in with friends' accounts on the same phone.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={biometric}
                onChange={(e) => setBiometric(e.target.checked)}
                className="w-4 h-4 accent-[#00346f] rounded"
              />
              <div>
                <span className="text-xs font-bold text-[#111c2d] block">Allow Biometric FaceID / TouchID Verification</span>
                <span className="text-[11px] text-gray-500">Prompts student for biometric passkey confirmation when opening scanner.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Faculty Info */}
        <div className="bg-white p-6 rounded-xl border border-[#c2c6d3]/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="material-symbols-outlined text-[#00346f]">badge</span>
            <h2 className="text-sm font-bold text-[#111c2d]">Faculty Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Instructor Name</label>
              <input type="text" readOnly value="Dr. Sarah Chen" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-600" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Department</label>
              <input type="text" readOnly value="Department of Computer Science & Engineering" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#00346f] hover:bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
