import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ isOpen, onClose }) => {
  const { courses, startNewSession, settings } = useApp();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'c1');
  const [radius, setRadius] = useState<number>(settings.defaultGeofenceRadius);
  const [interval, setInterval] = useState<number>(settings.qrRotationInterval);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startNewSession(selectedCourseId, radius, interval);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d3] animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00346f]">sensors</span>
            <h3 className="text-lg font-bold text-[#111c2d]">Launch Live Session</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium text-[#111c2d]"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} ({c.totalStudents} enrolled)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              Geofence Radius: <span className="font-mono text-[#004a99]">{radius} meters</span>
            </label>
            <input
              type="range"
              min="30"
              max="200"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-[#00346f]"
            />
            <span className="text-[11px] text-gray-500 mt-0.5 block">
              Students further than this distance from the podium will be rejected and flagged.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              QR Code Dynamic Refresh Interval
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium"
            >
              <option value={5}>5 seconds (Anti-Fraud Ultra Fast)</option>
              <option value={7}>7 seconds (Recommended)</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
            </select>
          </div>

          <div className="p-3 bg-[#e7eeff] rounded-xl text-[#00346f] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
            <span className="text-[11px] leading-relaxed">
              Once initiated, the smartboard projector will display the rotating QR code and accept student check-ins in real-time.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99] shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Start Broadcasting QR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
