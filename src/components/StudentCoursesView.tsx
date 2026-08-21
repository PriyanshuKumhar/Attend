import React from 'react';
import { useApp } from '../context/AppContext';

export const StudentCoursesView: React.FC = () => {
  const { courses, records, currentStudent, setCurrentView } = useApp();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111c2d]">Enrolled Courses</h1>
          <p className="text-xs text-[#515f74] mt-0.5">
            Fall Semester 2026 • Computer Science & Engineering
          </p>
        </div>
        <button
          onClick={() => setCurrentView('student-scan')}
          className="self-start sm:self-auto px-4 py-2 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99] shadow-sm flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          Scan Class QR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => {
          const courseRecords = records.filter(
            r => r.studentId === currentStudent.id && r.courseCode === c.code
          );
          const presentCount = courseRecords.filter(r => r.status === 'present').length;
          const rate = courseRecords.length > 0 
            ? Math.round((presentCount / courseRecords.length) * 100) 
            : 95;

          return (
            <div key={c.id} className="bg-white rounded-xl border border-[#c2c6d3]/40 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#004a99]/10 text-[#004a99] font-bold text-xs">
                    {c.code}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    {rate}% Attendance
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#111c2d] mt-2.5">{c.name}</h3>
                <p className="text-xs text-[#515f74] mt-0.5">Instructor: {c.instructor}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-[#515f74]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00346f]">schedule</span>
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00346f]">meeting_room</span>
                  <span>{c.hall}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
