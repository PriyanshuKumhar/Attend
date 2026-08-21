import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

type ScanStage = 'scanner' | 'locating' | 'success' | 'failure';

export const StudentScanner: React.FC = () => {
  const { 
    activeSession, 
    markStudentAttendance, 
    setCurrentView,
    currentStudent,
    students,
    setCurrentStudent,
    simulatedDistance,
    setSimulatedDistance,
    records,
    settings
  } = useApp();

  const [stage, setStage] = useState<ScanStage>('scanner');
  const [loggedTime, setLoggedTime] = useState<string>('10:04 AM');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'profile'>('scan');
  
  // Real camera stream support
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop camera when not scanning
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useRealCamera && stage === 'scanner' && activeTab === 'scan') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setUseRealCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useRealCamera, stage, activeTab]);

  const handleStartScan = () => {
    setStage('locating');

    // Simulate location verification and cryptographic handshake
    setTimeout(() => {
      const now = new Date();
      setLoggedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      const result = markStudentAttendance();

      if (result.success) {
        setStage('success');
        // Confetti celebration
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti is not loaded
        }
      } else {
        setErrorMessage(result.message);
        setStage('failure');
      }
    }, 2200);
  };

  const handleResetFlow = () => {
    setStage('scanner');
    setErrorMessage('');
  };

  const studentRecords = records.filter(r => r.studentId === currentStudent.id);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] items-center justify-center p-6 gap-6 bg-[#f9f9ff]">
      
      {/* Top Test Toolbar to let the user simulate real classroom conditions */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur border border-[#c2c6d3]/60 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#00346f]">Student:</span>
          <select 
            value={currentStudent.id} 
            onChange={(e) => {
              const selected = students.find(s => s.id === e.target.value);
              if (selected) setCurrentStudent(selected);
            }}
            className="bg-[#f0f3ff] border border-[#c2c6d3] rounded-md px-2 py-1 text-xs font-medium text-[#111c2d] focus:outline-none focus:ring-1 focus:ring-[#00346f]"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#00346f]">Simulated GPS Distance:</span>
          <div className="flex items-center gap-1.5 bg-[#f0f3ff] px-2 py-1 rounded-md border border-[#c2c6d3]">
            <input 
              type="range" 
              min="2" 
              max="250" 
              value={simulatedDistance}
              onChange={(e) => setSimulatedDistance(Number(e.target.value))}
              className="w-20 accent-[#00346f] cursor-pointer"
            />
            <span className={`font-mono font-bold text-[11px] ${simulatedDistance <= (activeSession?.geofenceRadius || 100) ? 'text-emerald-700' : 'text-red-600'}`}>
              {simulatedDistance}m {simulatedDistance <= 100 ? '(In Range)' : '(Out of Bounds)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-sm bg-white shadow-xl rounded-xl overflow-hidden flex flex-col items-center justify-center relative min-h-[510px] border border-[#c2c6d3]/40">
        
        {/* Navigation Tabs on Student Card */}
        <div className="w-full flex border-b border-[#c2c6d3]/40 bg-[#f0f3ff]/60">
          <button 
            onClick={() => { setActiveTab('scan'); handleResetFlow(); }}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scan' ? 'text-[#00346f] border-b-2 border-[#00346f] bg-white' : 'text-[#515f74] hover:text-[#111c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            QR Scanner
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'text-[#00346f] border-b-2 border-[#00346f] bg-white' : 'text-[#515f74] hover:text-[#111c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            My Log ({studentRecords.length})
          </button>
        </div>

        {activeTab === 'scan' && (
          <div className="w-full h-full flex flex-col p-6 relative">
            
            {/* 1. SCANNER STATE */}
            {stage === 'scanner' && (
              <div className="w-full h-full flex flex-col items-center animate-in fade-in duration-300">
                <div className="text-center mb-6 space-y-1">
                  <h2 className="text-2xl font-bold text-[#111c2d] tracking-tight">Mark Attendance</h2>
                  <p className="text-sm text-[#424751] leading-relaxed">
                    Please ensure you are within 100m of the professor's desk and scan the rotating QR code on the screen.
                  </p>
                </div>

                {/* Scanner Frame Viewport */}
                <div className="relative w-full aspect-square rounded-xl bg-[#263143] flex items-center justify-center overflow-hidden shadow-sm group">
                  {/* Subtle inner border */}
                  <div className="absolute inset-4 border-2 border-[#004a99]/40 rounded-lg pointer-events-none z-20"></div>
                  
                  {/* Animated laser scanning bar */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#004a99]/30 to-transparent w-full h-[15%] animate-scan pointer-events-none z-20"></div>
                  
                  {/* Central QR placeholder icon */}
                  <span className="material-symbols-outlined text-[#d8e3fb]/40 text-[64px] z-10 select-none">
                    qr_code_scanner
                  </span>

                  {/* Real camera video OR POV Classroom Smartboard Background */}
                  {useRealCamera ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzI1g8uAC0sZDUcEBAAmeDtQFhdCqfjTJ9IvqrZFd11veNbFG1u-F7aQ89cx7GcBnWx8M0vB7ZOV_OHu6--VQ4Lprh6H2WgBmNnzpeGxhkzREHIx88oBASsmaMRMUJfa4rZVjmy-NbuCG7EkccyVJyWSXRZH6IboCtPc4AiSZm08TDptQF9iuuJZz_uOTeuTjWbPuc5OpUKpqSUuvp1VNtl-CHymOLkIhoiNN7o-GhzBVM2plWOUTz')`,
                      }}
                    />
                  )}

                  {/* 4 Blue Corner Accents */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#004a99] z-20"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#004a99] z-20"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#004a99] z-20"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#004a99] z-20"></div>

                  {/* Camera toggle pill inside viewfinder */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUseRealCamera(prev => !prev);
                    }}
                    className="absolute bottom-6 px-2.5 py-1 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full text-[11px] text-white font-medium z-30 flex items-center gap-1 border border-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {useRealCamera ? 'videocam_off' : 'videocam'}
                    </span>
                    {useRealCamera ? 'Switch to POV Room' : 'Use Device Camera'}
                  </button>
                </div>

                {/* Scan Action Button */}
                <button
                  onClick={handleStartScan}
                  className="mt-6 w-full py-3.5 bg-[#00346f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-[#004a99] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">camera</span>
                  SCAN QR CODE
                </button>

                {/* Status Indicator */}
                <div className="mt-3 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d8e3fb] self-center">
                  <span className="material-symbols-outlined text-[#424751] text-[16px] animate-pulse">radar</span>
                  <span className="text-xs font-semibold text-[#424751] tracking-wide">Waiting to scan...</span>
                </div>
              </div>
            )}

            {/* 2. LOCATION CHECKING STATE */}
            {stage === 'locating' && (
              <div className="w-full h-full flex flex-col items-center animate-in fade-in duration-300 py-4">
                <div className="text-center mb-6 space-y-1">
                  <h2 className="text-2xl font-bold text-[#111c2d] tracking-tight">Checking Location</h2>
                  <p className="text-sm text-[#424751]">Verifying you are within the 100m radius of the lecture hall.</p>
                </div>

                {/* Radar visualization */}
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden mb-6 bg-[#f0f3ff]">
                  {/* Expanding Radar Rings */}
                  <div className="absolute inset-4 rounded-full bg-[#00346f]/5 border border-[#00346f]/20 animate-ping"></div>
                  <div className="absolute inset-10 rounded-full border border-[#00346f]/30"></div>
                  <div className="absolute inset-16 rounded-full border border-[#00346f]/40"></div>
                  
                  {/* Rotating radar line */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#004a99]/40 animate-radar"></div>

                  {/* Pin Dot Center */}
                  <div className="relative w-12 h-12 bg-[#00346f] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#d5e3fc]">
                    <span className="material-symbols-outlined text-white text-[22px] animate-bounce">location_on</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#dee8ff] rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#00346f] w-0 animate-progress"></div>
                </div>
                
                <p className="text-center font-mono text-xs text-[#424751] mt-3">
                  Acquiring GPS Signal & Proximity ({simulatedDistance.toFixed(1)}m)...
                </p>
              </div>
            )}

            {/* 3. SUCCESS STATE */}
            {stage === 'success' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 py-2">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
                  <span className="material-symbols-outlined text-[44px] text-[#146c2e]">check_circle</span>
                </div>

                <h2 className="text-2xl font-bold text-[#111c2d] text-center mb-1">Attendance Marked</h2>
                <p className="text-sm text-[#424751] text-center mb-5">You're all set for today's lecture.</p>

                {/* Verification Card Details */}
                <div className="w-full bg-[#f0f3ff] rounded-xl p-4 space-y-3.5 border border-[#c2c6d3]/40">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#424751] font-medium">Course</span>
                    <span className="text-sm font-bold text-[#111c2d]">
                      {activeSession ? activeSession.courseName : 'CS401: Algorithms'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#424751] font-medium">Student</span>
                    <span className="text-xs font-semibold text-[#111c2d]">{currentStudent.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#424751] font-medium">Time Logged</span>
                    <span className="font-mono text-xs font-bold text-[#111c2d]">{loggedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#424751] font-medium">Location</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300">
                      <span className="material-symbols-outlined text-[#146c2e] text-[13px]">my_location</span>
                      <span className="text-[11px] font-bold text-[#146c2e]">Verified ({simulatedDistance}m)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    onClick={handleResetFlow}
                    className="text-[#00346f] text-xs font-bold uppercase tracking-wider hover:text-[#004a99] transition-colors cursor-pointer"
                  >
                    SCAN ANOTHER QR CODE
                  </button>
                  <button
                    onClick={() => setCurrentView('professor-dashboard')}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    Go to Professor Dashboard →
                  </button>
                </div>
              </div>
            )}

            {/* 4. FAILURE / GEOFENCE VIOLATION STATE */}
            {stage === 'failure' && (
              <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 py-2">
                <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-5 relative">
                  <span className="material-symbols-outlined text-[44px] text-red-600">location_off</span>
                </div>

                <h2 className="text-2xl font-bold text-red-700 text-center mb-1">Out of Bounds</h2>
                <p className="text-xs text-[#424751] text-center mb-5 max-w-xs">
                  {errorMessage || 'Your location is outside the allowable 100m geofence radius for this lecture.'}
                </p>

                <div className="w-full bg-red-50/70 rounded-xl p-4 space-y-2 border border-red-200 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Measured Distance:</span>
                    <span className="font-mono font-bold text-red-700">{simulatedDistance} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Geofence Radius:</span>
                    <span className="font-mono font-bold text-gray-800">{settings.defaultGeofenceRadius} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fraud Prevention:</span>
                    <span className="text-red-700 font-semibold">Flagged & Logged</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setSimulatedDistance(12.0); // reset to valid in-range
                      handleResetFlow();
                    }}
                    className="px-4 py-2 bg-[#00346f] text-white text-xs font-bold rounded-lg hover:bg-[#004a99]"
                  >
                    Adjust GPS to 12m & Retry
                  </button>
                  <button
                    onClick={handleResetFlow}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Student Attendance History */}
        {activeTab === 'history' && (
          <div className="w-full h-full flex flex-col p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#111c2d]">{currentStudent.name}'s Records</h3>
                <p className="text-xs text-[#424751]">{currentStudent.studentId} • {currentStudent.major}</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {currentStudent.attendanceRate}% Rate
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {studentRecords.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No attendance logs found for this student.
                </div>
              ) : (
                studentRecords.map((r) => (
                  <div 
                    key={r.id}
                    className="p-3 bg-[#f0f3ff] rounded-lg border border-[#c2c6d3]/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#111c2d]">{r.courseCode}</div>
                      <div className="text-[11px] text-gray-500">{r.date} • {r.timestamp}</div>
                      {r.notes && <div className="text-[10px] text-gray-400 mt-0.5">{r.notes}</div>}
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'late' ? 'bg-amber-100 text-amber-800' :
                        r.status === 'geo-flagged' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveTab('scan')}
              className="mt-auto pt-4 text-center text-xs font-bold text-[#00346f] hover:underline"
            >
              ← Return to Scanner
            </button>
          </div>
        )}

      </div>

      {/* Instructions footer note */}
      <div className="text-center text-xs text-[#515f74] max-w-md">
        <p>
          Anti-Proxy Protection: QR codes refresh dynamically every 7 seconds. Screenshots and shared links will be rejected.
        </p>
      </div>
    </div>
  );
};
