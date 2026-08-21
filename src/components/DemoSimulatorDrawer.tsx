import React from 'react';
import { useApp } from '../context/AppContext';

export const DemoSimulatorDrawer: React.FC = () => {
  const {
    students,
    currentStudent,
    setCurrentStudent,
    simulatedDistance,
    setSimulatedDistance,
    activeSession,
    isSimulatorOpen,
    setIsSimulatorOpen,
    userRole
  } = useApp();

  const maxRadius = activeSession?.geofenceRadius || 100;
  const isInRange = simulatedDistance <= maxRadius;

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {!isSimulatorOpen ? (
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur shadow-lg border border-[#c2c6d3] rounded-full text-xs font-semibold text-[#00346f] hover:bg-[#dee8ff] hover:scale-105 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-[#004a99]">tune</span>
          <span>Classroom GPS Simulator</span>
          <span className={`w-2 h-2 rounded-full ${isInRange ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#c2c6d3] p-4 w-80 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00346f] text-[18px]">tune</span>
              <span className="text-xs font-bold text-[#111c2d]">Classroom GPS Simulator</span>
            </div>
            <button
              onClick={() => setIsSimulatorOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="mt-3 space-y-3.5 text-xs">
            {/* Student Switcher */}
            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] mb-1">
                Active Student Identity:
              </label>
              <select
                value={currentStudent.id}
                onChange={(e) => {
                  const s = students.find(item => item.id === e.target.value);
                  if (s) setCurrentStudent(s);
                }}
                className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2 text-xs font-medium text-[#111c2d]"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#111c2d]">
                  Simulated Distance to Podium:
                </label>
                <span className={`font-mono font-bold text-[11px] ${isInRange ? 'text-emerald-700' : 'text-red-600'}`}>
                  {simulatedDistance}m {isInRange ? '(In Geofence)' : '(Violation)'}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="250"
                step="1"
                value={simulatedDistance}
                onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                className="w-full accent-[#00346f] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 font-mono">
                <span>2m (Front Row)</span>
                <span>{maxRadius}m limit</span>
                <span>250m (Dorm)</span>
              </div>
            </div>

            {/* Quick Distance Presets */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSimulatedDistance(12)}
                className="flex-1 py-1 px-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100"
              >
                12m (Valid)
              </button>
              <button
                onClick={() => setSimulatedDistance(165)}
                className="flex-1 py-1 px-2 rounded bg-red-50 text-red-800 border border-red-200 text-[11px] font-semibold hover:bg-red-100"
              >
                165m (Proxy Test)
              </button>
            </div>

            <p className="text-[10px] text-[#515f74] leading-tight pt-1">
              Use this simulator to test anti-proxy detection and geofence verification across student scans.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
