import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StudentHistoryView: React.FC = () => {
  const { currentStudent, records, courses, setCurrentView } = useApp();
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const studentRecords = records.filter(r => r.studentId === currentStudent.id);
  const filtered = filterCourse === 'all' 
    ? studentRecords 
    : studentRecords.filter(r => r.courseCode === filterCourse);

  const presentCount = studentRecords.filter(r => r.status === 'present').length;
  const flaggedCount = studentRecords.filter(r => r.status === 'geo-flagged').length;
  const lateCount = studentRecords.filter(r => r.status === 'late').length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111c2d]">My Attendance History</h1>
          <p className="text-xs text-[#515f74] mt-0.5">
            Verified check-in logs and cryptographic timestamp proofs for {currentStudent.name}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('student-scan')}
          className="self-start sm:self-auto px-4 py-2 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99] shadow-sm flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          Open Live Scanner
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <span className="text-xs text-[#515f74] font-medium">Overall Rate</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{currentStudent.attendanceRate}%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Good Standing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <span className="text-xs text-[#515f74] font-medium">Present Lectures</span>
          <div className="text-2xl font-bold text-[#111c2d] mt-1">{presentCount}</div>
          <span className="text-[11px] text-gray-500">Verified on-campus</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <span className="text-xs text-[#515f74] font-medium">Late Arrivals</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{lateCount}</div>
          <span className="text-[11px] text-gray-500">Within grace period</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/40 shadow-xs">
          <span className="text-xs text-[#515f74] font-medium">Geofence Flags</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{flaggedCount}</div>
          <span className="text-[11px] text-red-500 font-medium">Proxy / Out of range</span>
        </div>
      </div>

      {/* Filter & Log List */}
      <div className="bg-white rounded-xl border border-[#c2c6d3]/40 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#111c2d]">Verified Check-in Sessions</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#515f74]">Filter Course:</span>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg px-2.5 py-1 text-xs font-medium text-[#111c2d]"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No attendance records match the selected course.
            </div>
          ) : (
            filtered.map((record) => (
              <div key={record.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f9f9ff] transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                    record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                    record.status === 'geo-flagged' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {record.status === 'present' ? 'verified' :
                       record.status === 'late' ? 'schedule' :
                       record.status === 'geo-flagged' ? 'wrong_location' : 'close'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111c2d]">{record.courseCode}</span>
                      <span className="text-xs text-[#515f74]">•</span>
                      <span className="text-xs text-[#515f74] font-medium">{record.courseName}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {record.date} at {record.timestamp} • Proximity: {record.distanceFromDesk.toFixed(1)}m from podium
                    </div>
                    {record.notes && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">{record.notes}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    record.status === 'present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    record.status === 'late' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    record.status === 'geo-flagged' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status === 'geo-flagged' ? 'FLAGGED' : record.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
