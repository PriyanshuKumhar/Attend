import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';

interface ActiveSessionsViewProps {
  onStartNewSession: () => void;
}

export const ActiveSessionsView: React.FC<ActiveSessionsViewProps> = ({ onStartNewSession }) => {
  const {
    activeSession,
    qrToken,
    qrSecondsLeft,
    qrCountdown,
    isQrPaused,
    toggleQrPause,
    endSession,
    records,
    students,
    markStudentAttendance,
    isProjectorMode,
    setIsProjectorMode,
    settings,
    updateSettings
  } = useApp();

  const [selectedStudentForManual, setSelectedStudentForManual] = useState<string>('');
  const [showManualModal, setShowManualModal] = useState(false);

  if (!activeSession || activeSession.status === 'ended') {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 rounded-full bg-[#dee8ff] flex items-center justify-center text-[#00346f] mb-4">
          <span className="material-symbols-outlined text-[40px]">qr_code_2</span>
        </div>
        <h2 className="text-2xl font-bold text-[#111c2d]">No Active Session Currently Running</h2>
        <p className="text-sm text-[#515f74] max-w-md mt-2">
          Start a new live attendance session to broadcast a rotating cryptographic QR code to your lecture hall smartboard or projector.
        </p>
        <button
          onClick={onStartNewSession}
          className="mt-6 px-6 py-3 bg-[#00346f] hover:bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          Launch New Live Session
        </button>
      </div>
    );
  }

  const sessionRecords = records.filter(r => r.sessionId === activeSession.id || r.courseCode === activeSession.courseCode);
  const presentRecords = sessionRecords.filter(r => r.status === 'present');
  const flaggedRecords = sessionRecords.filter(r => r.status === 'geo-flagged');

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isProjectorMode ? 'fixed inset-0 z-50 bg-[#001b3f] text-white overflow-y-auto p-10 max-w-none' : ''}`}>
      
      {/* Session Top Action Bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isProjectorMode 
          ? 'bg-[#00346f]/60 border-[#004a99]' 
          : 'bg-white border-[#c2c6d3]/60 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${isQrPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-ping'}`}></span>
            <span className={`text-xs font-bold uppercase tracking-wider ${isProjectorMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              {isQrPaused ? 'Session Paused' : 'Live Smartboard Session Active'}
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isProjectorMode ? 'text-white' : 'text-[#111c2d]'}`}>
            {activeSession.courseName}
          </h1>
          <p className={`text-xs mt-0.5 ${isProjectorMode ? 'text-[#dee8ff]' : 'text-[#515f74]'}`}>
            {activeSession.hall} • Started at {activeSession.startTime} • Instructor: {activeSession.instructor}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isProjectorMode 
                ? 'bg-white text-[#00346f] border-white hover:bg-gray-100' 
                : 'bg-[#f0f3ff] text-[#00346f] border-[#c2c6d3] hover:bg-[#dee8ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isProjectorMode ? 'fullscreen_exit' : 'fullscreen'}
            </span>
            {isProjectorMode ? 'Exit Fullscreen' : 'Projector Mode'}
          </button>

          <button
            onClick={toggleQrPause}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isQrPaused 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isQrPaused ? 'play_arrow' : 'pause'}
            </span>
            {isQrPaused ? 'Resume Rotation' : 'Pause QR'}
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 bg-[#f0f3ff] text-[#00346f] border border-[#c2c6d3] hover:bg-[#dee8ff] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Manual Check-In
          </button>

          <button
            onClick={endSession}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">stop_circle</span>
            End Session
          </button>
        </div>
      </div>

      {/* Main Classroom Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Central Left Area: Large Dynamic Rotating QR Code on Smartboard */}
        <div className={`lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-2xl border text-center relative overflow-hidden ${
          isProjectorMode 
            ? 'bg-[#00244f] border-[#004a99] shadow-2xl' 
            : 'bg-white border-[#c2c6d3]/60 shadow-md'
        }`}>
          {/* Header instructions for students */}
          <div className="mb-4">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#004a99]/20 text-[#004a99] dark:text-[#9bbdff]">
              Anti-Proxy Dynamic Cryptography
            </span>
            <h2 className={`text-xl font-bold mt-2 ${isProjectorMode ? 'text-white' : 'text-[#111c2d]'}`}>
              Scan with QRAttend Student App
            </h2>
            <p className={`text-xs max-w-md mx-auto mt-1 ${isProjectorMode ? 'text-[#dee8ff]' : 'text-[#515f74]'}`}>
              Code auto-refreshes every {activeSession.refreshInterval}s. Screenshots will expire and fail verification.
            </p>
          </div>

          {/* High Contrast QR Code Container */}
          <div className="relative p-6 bg-white rounded-2xl shadow-xl border-4 border-[#00346f] my-3">
            {/* Corner styling */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-4 border-l-4 border-[#00346f]"></div>
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-4 border-r-4 border-[#00346f]"></div>
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-4 border-l-4 border-[#00346f]"></div>
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-4 border-r-4 border-[#00346f]"></div>

            <QRCodeSVG 
              value={qrToken}
              size={isProjectorMode ? 320 : 240}
              level="H"
              includeMargin={false}
            />

            {isQrPaused && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-white">
                <span className="material-symbols-outlined text-[48px] text-amber-400">pause_circle</span>
                <span className="text-sm font-bold mt-1">QR Code Rotation Frozen</span>
              </div>
            )}
          </div>

          {/* Countdown & Security Hash Bar */}
          <div className="w-full max-w-md mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={isProjectorMode ? 'text-gray-300' : 'text-[#515f74]'}>
                Next QR Token Refresh:
              </span>
              <span className="font-mono text-emerald-500 font-bold">
                {isQrPaused ? 'PAUSED' : `${qrSecondsLeft}s`}
              </span>
            </div>

            {/* Circular or linear progress bar */}
            <div className="w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00346f] transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${qrCountdown}%` }}
              ></div>
            </div>

            {/* Cryptographic Hash token string */}
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-1">
              <span>Token: <strong className="text-[#004a99]">{qrToken.slice(0, 18)}...</strong></span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                100m Geofence Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Area: Live Roster & Geofence Radar */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Attendance Stats Card */}
          <div className={`p-5 rounded-2xl border ${
            isProjectorMode 
              ? 'bg-[#00244f] border-[#004a99]' 
              : 'bg-white border-[#c2c6d3]/60 shadow-xs'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#515f74] dark:text-gray-300">Live Turnout</span>
                <div className={`text-3xl font-black mt-0.5 ${isProjectorMode ? 'text-white' : 'text-[#00346f]'}`}>
                  {activeSession.presentCount} / {activeSession.totalEnrolled}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600 block">
                  {Math.round((activeSession.presentCount / activeSession.totalEnrolled) * 100)}% Rate
                </span>
                <span className="text-[11px] text-gray-400">
                  {activeSession.totalEnrolled - activeSession.presentCount} remaining
                </span>
              </div>
            </div>

            {/* Progress fill bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(activeSession.presentCount / activeSession.totalEnrolled) * 100}%` }}
              ></div>
            </div>

            {/* Geofence radius control */}
            <div className="mt-4 pt-3 border-t border-gray-100/40 flex items-center justify-between text-xs">
              <span className={isProjectorMode ? 'text-gray-300' : 'text-[#515f74]'}>
                Classroom Radius:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSettings({ defaultGeofenceRadius: Math.max(50, settings.defaultGeofenceRadius - 25) })}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  -
                </button>
                <span className="font-bold font-mono text-[#00346f] dark:text-white">
                  {settings.defaultGeofenceRadius}m
                </span>
                <button
                  onClick={() => updateSettings({ defaultGeofenceRadius: Math.min(300, settings.defaultGeofenceRadius + 25) })}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Live attendee stream */}
          <div className={`p-5 rounded-2xl border flex flex-col h-[380px] ${
            isProjectorMode 
              ? 'bg-[#00244f] border-[#004a99]' 
              : 'bg-white border-[#c2c6d3]/60 shadow-xs'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100/30">
              <h3 className={`font-bold text-sm ${isProjectorMode ? 'text-white' : 'text-[#111c2d]'}`}>
                Recent Validations ({sessionRecords.length})
              </h3>
              {flaggedRecords.length > 0 && (
                <span className="text-[11px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                  {flaggedRecords.length} Flagged
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto flex-1 pr-1">
              {sessionRecords.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400">
                  Waiting for first student scan in lecture hall...
                </div>
              ) : (
                sessionRecords.map(record => (
                  <div 
                    key={record.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      record.status === 'geo-flagged' 
                        ? 'bg-red-50/80 border-red-200 text-red-900' 
                        : isProjectorMode 
                          ? 'bg-[#00346f]/40 border-[#004a99] text-white' 
                          : 'bg-[#f0f3ff] border-[#c2c6d3]/40 text-[#111c2d]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={record.studentAvatar} 
                        alt={record.studentName} 
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-white"
                      />
                      <div>
                        <span className="font-bold block leading-tight">{record.studentName}</span>
                        <span className="text-[10px] text-gray-400">{record.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                        record.status === 'geo-flagged' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                        {record.distanceFromDesk.toFixed(1)}m away
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Manual Check-in Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d3] animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#111c2d]">Manual Student Attendance Override</h3>
            <p className="text-xs text-[#515f74] mt-1">
              Manually register a student if their phone battery died or scanner hardware failed.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">Select Student</label>
                <select
                  value={selectedStudentForManual}
                  onChange={(e) => setSelectedStudentForManual(e.target.value)}
                  className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs text-[#111c2d]"
                >
                  <option value="">-- Choose Student from Roster --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedStudentForManual) {
                    markStudentAttendance(activeSession.courseId, 0);
                    setShowManualModal(false);
                    setSelectedStudentForManual('');
                  }
                }}
                disabled={!selectedStudentForManual}
                className="px-4 py-2 bg-[#00346f] text-white text-xs font-bold rounded-lg hover:bg-[#004a99] disabled:opacity-50"
              >
                Confirm Manual Mark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
