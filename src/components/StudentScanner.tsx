import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

type ScanStage = 'scanner' | 'locating' | 'success' | 'failure';

export const StudentScanner: React.FC = () => {
  const { 
    activeSession, 
    markStudentAttendance, 
    currentStudent,
    simulatedDistance,
    setSimulatedDistance,
    settings,
    setCurrentView
  } = useApp();

  const [stage, setStage] = useState<ScanStage>('scanner');
  const [loggedTime, setLoggedTime] = useState<string>('10:04 AM');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Real camera stream support
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop camera when not scanning
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useRealCamera && stage === 'scanner') {
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
  }, [useRealCamera, stage]);

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

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-[#f9f9ff]">
      {/* Centered Clean Card matching prompt screenshot */}
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col items-center justify-center relative min-h-[480px] border border-[#c2c6d3]/40 p-6 animate-in zoom-in-95 duration-200">
        
        {/* 1. SCANNER VIEW */}
        {stage === 'scanner' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            <div className="text-center mb-6 space-y-1.5">
              <h2 className="text-2xl font-bold text-[#111c2d] tracking-tight">Mark Attendance</h2>
              <p className="text-sm text-[#424751] leading-relaxed">
                Please ensure you are within 100m of the professor's desk and scan the rotating QR code on the screen.
              </p>
            </div>

            {/* Viewfinder with corner brackets */}
            <div className="relative w-full aspect-square rounded-xl bg-[#263143] flex items-center justify-center overflow-hidden shadow-sm group">
              {/* Inner focus guide */}
              <div className="absolute inset-4 border-2 border-[#004a99]/40 rounded-lg pointer-events-none z-20"></div>
              
              {/* Laser sweep animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#004a99]/30 to-transparent w-full h-[15%] animate-scan pointer-events-none z-20"></div>
              
              {/* Central icon */}
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

              {/* Camera toggle button inside viewfinder */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUseRealCamera(prev => !prev);
                }}
                className="absolute bottom-4 px-2.5 py-1 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full text-[11px] text-white font-medium z-30 flex items-center gap-1 border border-white/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {useRealCamera ? 'videocam_off' : 'videocam'}
                </span>
                {useRealCamera ? 'Use POV Projection' : 'Use Device Camera'}
              </button>
            </div>

            {/* Scan Action Button matching screenshot */}
            <button
              onClick={handleStartScan}
              className="mt-6 w-full py-3.5 bg-[#00346f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-[#004a99] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">camera</span>
              SCAN QR CODE
            </button>

            {/* Status Pill matching screenshot */}
            <div className="mt-3 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d8e3fb] self-center">
              <span className="material-symbols-outlined text-[#424751] text-[16px] animate-pulse">radar</span>
              <span className="text-xs font-semibold text-[#424751] tracking-wide">Waiting to scan...</span>
            </div>
          </div>
        )}

        {/* 2. LOCATION CHECKING VIEW */}
        {stage === 'locating' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300 py-2">
            <div className="text-center mb-6 space-y-1">
              <h2 className="text-2xl font-bold text-[#111c2d] tracking-tight">Checking Location</h2>
              <p className="text-sm text-[#424751]">Verifying you are within the 100m radius of the lecture hall.</p>
            </div>

            {/* Radar visualization */}
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden mb-6 bg-[#f0f3ff]">
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
              Acquiring GPS Signal & Proximity Handshake...
            </p>
          </div>
        )}

        {/* 3. SUCCESS VIEW */}
        {stage === 'success' && (
          <div className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 py-2">
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
                  <span className="text-[11px] font-bold text-[#146c2e]">Verified ({simulatedDistance.toFixed(1)}m)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
              <button
                onClick={handleResetFlow}
                className="w-full py-2.5 bg-[#00346f] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#004a99] transition-all cursor-pointer"
              >
                SCAN ANOTHER QR CODE
              </button>
              <button
                onClick={() => setCurrentView('student-history')}
                className="text-xs text-[#00346f] hover:underline font-semibold"
              >
                View My Attendance Log →
              </button>
            </div>
          </div>
        )}

        {/* 4. OUT OF BOUNDS / FAILURE VIEW */}
        {stage === 'failure' && (
          <div className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 py-2">
            <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-5 relative">
              <span className="material-symbols-outlined text-[44px] text-red-600">location_off</span>
            </div>

            <h2 className="text-2xl font-bold text-red-700 text-center mb-1">Out of Bounds</h2>
            <p className="text-xs text-[#424751] text-center mb-5 max-w-xs leading-relaxed">
              {errorMessage || 'Your location is outside the allowable 100m geofence radius for this lecture.'}
            </p>

            <div className="w-full bg-red-50/70 rounded-xl p-4 space-y-2.5 border border-red-200 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Measured Distance:</span>
                <span className="font-mono font-bold text-red-700">{simulatedDistance.toFixed(1)} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Geofence Radius:</span>
                <span className="font-mono font-bold text-gray-800">{settings.defaultGeofenceRadius} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Anti-Proxy System:</span>
                <span className="text-red-700 font-semibold">Flagged & Logged</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
              <button
                onClick={() => {
                  setSimulatedDistance(12.0); // reset to valid in-range for easy testing
                  handleResetFlow();
                }}
                className="w-full py-2.5 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99] transition-all cursor-pointer"
              >
                Reset GPS Inside Room & Retry
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

      {/* Security Note at bottom */}
      <div className="text-center text-xs text-[#515f74] max-w-md mt-4">
        <p>
          Anti-Proxy Protection: QR codes refresh dynamically every 7 seconds. Screenshots and remote scans will be rejected.
        </p>
      </div>
    </div>
  );
};
