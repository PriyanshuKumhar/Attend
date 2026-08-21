import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceRecord } from '../types';

export const AttendanceReportsView: React.FC = () => {
  const { records, courses, updateRecordStatus } = useApp();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<AttendanceRecord['status']>('present');
  const [overrideNote, setOverrideNote] = useState<string>('');

  const filteredRecords = records.filter(rec => {
    if (selectedCourse !== 'all' && rec.courseCode !== selectedCourse) return false;
    if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.studentName.toLowerCase().includes(q);
      const matchId = rec.studentCode.toLowerCase().includes(q);
      const matchCourse = rec.courseName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCourse) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Record ID', 'Student ID', 'Student Name', 'Course', 'Date', 'Time', 'Status', 'Distance (m)', 'Device Verified', 'IP / Notes'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.studentCode,
      `"${r.studentName}"`,
      r.courseCode,
      r.date,
      r.timestamp,
      r.status,
      r.distanceFromDesk.toFixed(1),
      r.deviceVerified ? 'Yes' : 'No',
      `"${r.notes || r.ipAddress || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QRAttend_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveOverride = () => {
    if (!selectedRecord) return;
    updateRecordStatus(selectedRecord.id, overrideStatus, overrideNote || selectedRecord.notes);
    setSelectedRecord(null);
    setOverrideNote('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Export toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111c2d] tracking-tight">Attendance Reports & Logs</h1>
          <p className="text-xs text-[#515f74] mt-0.5">
            Audit trail of all cryptographic QR scans, GPS geofence checks, and attendance statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-[#00346f] hover:bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c2c6d3]/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search by student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg text-xs text-[#111c2d] focus:outline-none focus:ring-1 focus:ring-[#00346f]"
            />
          </div>

          {/* Course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg px-3 py-2 text-xs font-medium text-[#111c2d] focus:outline-none focus:ring-1 focus:ring-[#00346f]"
          >
            <option value="all">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg px-3 py-2 text-xs font-medium text-[#111c2d] focus:outline-none focus:ring-1 focus:ring-[#00346f]"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present (In Range)</option>
            <option value="late">Late Arrival</option>
            <option value="geo-flagged">Geo-Flagged (Proxy Alert)</option>
            <option value="excused">Excused Medical/Official</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-[#515f74]">
          Showing {filteredRecords.length} records
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#c2c6d3]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f3ff] border-b border-[#c2c6d3]/60 text-[#424751] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">GPS Proximity</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No matching attendance logs found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr 
                    key={record.id}
                    className={`hover:bg-[#dee8ff]/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9ff]'
                    }`}
                  >
                    {/* Student info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={record.studentAvatar}
                          alt={record.studentName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <div className="font-bold text-[#111c2d]">{record.studentName}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{record.studentCode}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3 px-4 font-semibold text-[#00346f]">
                      {record.courseCode}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-[#111c2d]">{record.timestamp}</div>
                      <div className="text-[10px] text-gray-400">{record.date}</div>
                    </td>

                    {/* GPS Distance */}
                    <td className="py-3 px-4 font-mono">
                      <span className={record.distanceFromDesk > 100 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                        {record.distanceFromDesk > 0 ? `${record.distanceFromDesk.toFixed(1)}m` : '0.0m'}
                      </span>
                    </td>

                    {/* Verification details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-[16px] ${
                          record.deviceVerified ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {record.deviceVerified ? 'verified_user' : 'gpp_bad'}
                        </span>
                        <span className="text-[11px] text-gray-600 truncate max-w-[150px]" title={record.notes || record.ipAddress}>
                          {record.notes || record.ipAddress || 'Verified Hardware'}
                        </span>
                      </div>
                    </td>

                    {/* Status Chip */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                        record.status === 'geo-flagged' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setOverrideStatus(record.status);
                          setOverrideNote(record.notes || '');
                        }}
                        className="text-xs font-semibold text-[#00346f] hover:underline"
                      >
                        Audit / Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down / Override Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c6d3] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#111c2d]">Attendance Record Audit</h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 p-3 bg-[#f0f3ff] rounded-xl">
                <img 
                  src={selectedRecord.studentAvatar} 
                  alt={selectedRecord.studentName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#111c2d]">{selectedRecord.studentName}</h4>
                  <p className="text-gray-500 font-mono">{selectedRecord.studentCode}</p>
                  <p className="text-[#004a99] font-medium">{selectedRecord.courseName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Logged Timestamp</span>
                  <span className="font-bold text-gray-800">{selectedRecord.date} at {selectedRecord.timestamp}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Proximity to Podium</span>
                  <span className="font-bold text-gray-800">{selectedRecord.distanceFromDesk.toFixed(1)} meters</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">Status Override</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as AttendanceRecord['status'])}
                  className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs font-medium"
                >
                  <option value="present">Present (In Attendance)</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused (Medical/Official)</option>
                  <option value="geo-flagged">Geo-Flagged (Suspected Proxy)</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">Faculty Audit Note</label>
                <textarea
                  rows={2}
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  placeholder="e.g. Student provided medical note from campus health clinic..."
                  className="w-full bg-[#f0f3ff] border border-[#c2c6d3] rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-4 py-2 bg-[#00346f] text-white text-xs font-bold rounded-lg hover:bg-[#004a99]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
