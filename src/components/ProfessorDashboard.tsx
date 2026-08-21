import React from 'react';
import { useApp } from '../context/AppContext';

interface ProfessorDashboardProps {
  onStartNewSession: () => void;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onStartNewSession }) => {
  const { 
    courses, 
    activeSession, 
    records, 
    setCurrentView,
    updateRecordStatus
  } = useApp();

  const totalEnrolled = courses.reduce((acc, c) => acc + c.totalStudents, 0);
  const todayRecords = records.filter(r => r.date === 'Today');
  const presentCount = todayRecords.filter(r => r.status === 'present').length;
  const flaggedCount = records.filter(r => r.status === 'geo-flagged').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#00346f] to-[#004a99] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#9bbdff]">Faculty Portal</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Welcome back, Dr. Sarah Chen</h1>
          <p className="text-sm text-[#dee8ff] mt-1">
            Department of Computer Science • Spring Semester 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeSession && activeSession.status === 'active' ? (
            <button
              onClick={() => setCurrentView('active-sessions')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 animate-bounce"
            >
              <span className="material-symbols-outlined text-[18px]">screen_share</span>
              View Live Smartboard ({activeSession.courseCode})
            </button>
          ) : (
            <button
              onClick={onStartNewSession}
              className="px-5 py-2.5 bg-white text-[#00346f] hover:bg-[#f0f3ff] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Start New Class Session
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#c2c6d3]/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#515f74] uppercase tracking-wider">Active Session</span>
            <div className="text-2xl font-bold text-[#00346f] mt-1">
              {activeSession && activeSession.status === 'active' ? activeSession.courseCode : 'None Active'}
            </div>
            <span className="text-xs text-[#424751] mt-1 block">
              {activeSession && activeSession.status === 'active' 
                ? `${activeSession.presentCount}/${activeSession.totalEnrolled} checked in (${Math.round((activeSession.presentCount/activeSession.totalEnrolled)*100)}%)` 
                : 'Ready to launch'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d5e3fc] flex items-center justify-center text-[#00346f]">
            <span className="material-symbols-outlined text-[26px]">sensors</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#c2c6d3]/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#515f74] uppercase tracking-wider">Today's Check-ins</span>
            <div className="text-2xl font-bold text-[#111c2d] mt-1">{presentCount} Scans</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8% vs last week
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[26px]">how_to_reg</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#c2c6d3]/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#515f74] uppercase tracking-wider">Avg Attendance</span>
            <div className="text-2xl font-bold text-[#111c2d] mt-1">94.8%</div>
            <span className="text-xs text-[#424751] mt-1 block">Across {courses.length} courses</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e7eeff] flex items-center justify-center text-[#004a99]">
            <span className="material-symbols-outlined text-[26px]">analytics</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#c2c6d3]/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#515f74] uppercase tracking-wider">Proxy Fraud Blocked</span>
            <div className="text-2xl font-bold text-amber-700 mt-1">{flaggedCount} Flagged</div>
            <span className="text-xs text-amber-600 font-medium mt-1 block">Geofence out-of-bounds</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <span className="material-symbols-outlined text-[26px]">security</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Courses + Live Attendance Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Courses and Active Sessions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Live Session Banner if active */}
          {activeSession && activeSession.status === 'active' && (
            <div className="bg-white rounded-xl border-2 border-[#00346f]/30 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004a99]/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Active Session</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111c2d] mt-1">{activeSession.courseName}</h3>
                  <p className="text-xs text-[#515f74] mt-0.5">
                    {activeSession.hall} • Started at {activeSession.startTime} • Geofence {activeSession.geofenceRadius}m
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView('active-sessions')}
                    className="px-4 py-2 bg-[#00346f] hover:bg-[#004a99] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                    Open Smartboard QR View
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-[#424751] mb-1">
                  <span>Attendance Progress</span>
                  <span>{activeSession.presentCount} / {activeSession.totalEnrolled} Students ({Math.round((activeSession.presentCount/activeSession.totalEnrolled)*100)}%)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00346f] to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(activeSession.presentCount / activeSession.totalEnrolled) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Department Courses */}
          <div className="bg-white rounded-xl border border-[#c2c6d3]/60 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#111c2d]">Assigned Courses</h2>
                <p className="text-xs text-[#515f74]">Click any course to review syllabus, roster, or launch sessions</p>
              </div>
              <button
                onClick={onStartNewSession}
                className="text-xs font-bold text-[#00346f] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Session
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(course => (
                <div 
                  key={course.id}
                  className="p-4 rounded-xl border border-[#c2c6d3]/50 hover:border-[#00346f]/60 hover:shadow-md transition-all bg-[#f9f9ff] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white" style={{ backgroundColor: course.color }}>
                        {course.code}
                      </span>
                      <span className="text-xs font-medium text-[#515f74]">{course.totalStudents} Enrolled</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#111c2d] mt-2 line-clamp-1">{course.name}</h4>
                    <p className="text-xs text-[#515f74] mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {course.hall}
                    </p>
                    <p className="text-xs text-[#515f74] mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {course.schedule}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#c2c6d3]/40 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentView('attendance-reports')}
                      className="text-xs text-[#00346f] font-semibold hover:underline"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => {
                        useApp;
                        setCurrentView('active-sessions');
                      }}
                      className="px-3 py-1 bg-[#00346f] hover:bg-[#004a99] text-white text-xs font-semibold rounded-md shadow-2xs"
                    >
                      Launch QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Live Scans Ticker */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#c2c6d3]/60 p-6 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00346f]">history</span>
                <h3 className="font-bold text-base text-[#111c2d]">Live Check-in Feed</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Real-time
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {records.slice(0, 8).map(record => (
                <div 
                  key={record.id}
                  className="p-3 bg-[#f0f3ff] hover:bg-[#dee8ff]/50 rounded-xl border border-[#c2c6d3]/40 transition-all text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={record.studentAvatar} 
                      alt={record.studentName} 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white shadow-2xs"
                    />
                    <div>
                      <span className="font-bold text-[#111c2d] block leading-tight">{record.studentName}</span>
                      <span className="text-[11px] text-[#515f74]">{record.courseCode} • {record.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                      record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                      record.status === 'geo-flagged' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                      {record.distanceFromDesk > 0 ? `${record.distanceFromDesk.toFixed(1)}m` : '0m'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('attendance-reports')}
              className="mt-4 pt-3 border-t border-gray-100 w-full text-center text-xs font-bold text-[#00346f] hover:underline"
            >
              View Full Attendance Roster →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
