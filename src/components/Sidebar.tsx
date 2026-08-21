import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    userRole, 
    currentView, 
    setCurrentView, 
    activeSession, 
    currentStudent, 
    requestRoleSwitch 
  } = useApp();

  const studentNavItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'student-scan', label: 'Mark Attendance', icon: 'qr_code_scanner' },
    { id: 'student-history', label: 'My Attendance Log', icon: 'history' },
    { id: 'student-courses', label: 'My Courses', icon: 'school' },
    { id: 'student-profile', label: 'Digital ID & Pass', icon: 'badge' },
  ];

  const professorNavItems: { id: ViewMode; label: string; icon: string; badge?: string }[] = [
    { id: 'professor-dashboard', label: 'Professor Dashboard', icon: 'dashboard' },
    { 
      id: 'active-sessions', 
      label: 'Active Sessions', 
      icon: 'sensors',
      badge: activeSession && activeSession.status === 'active' ? 'LIVE' : undefined
    },
    { id: 'attendance-reports', label: 'Attendance Reports', icon: 'assessment' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const currentNav = userRole === 'student' ? studentNavItems : professorNavItems;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#f0f3ff] border-r border-[#c2c6d3]/40 z-50 flex flex-col justify-between shadow-[1px_0_0_0_rgba(0,0,0,0.03)] select-none">
      {/* Top Section */}
      <div>
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00346f] text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-[#00346f] tracking-tight">QRAttend</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#004a99]/10 text-[#004a99]">
              {userRole === 'student' ? 'Student' : 'Faculty'}
            </span>
          </div>
        </div>

        {/* Portal Indicator Pill */}
        <div className="mx-4 mb-3 px-3 py-1.5 rounded-lg bg-white/70 border border-[#c2c6d3]/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${userRole === 'student' ? 'bg-blue-500' : 'bg-purple-600'}`}></span>
            <span className="text-[11px] font-bold text-[#111c2d]">
              {userRole === 'student' ? 'Student Portal' : 'Faculty Admin Portal'}
            </span>
          </div>
          <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
            {userRole === 'student' ? 'Verified' : 'Admin'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1">
          {currentNav.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-[#d5e3fc] text-[#00346f] font-bold shadow-xs'
                    : 'text-[#424751] hover:bg-[#dee8ff] hover:text-[#111c2d]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#00346f]' : 'text-[#515f74]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[14px] font-medium leading-none">{item.label}</span>
                </div>
                {'badge' in item && item.badge && (
                  <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switch Callout & Profile Footer */}
      <div className="p-4 border-t border-[#c2c6d3]/60 bg-[#e7eeff]/40 space-y-3">
        {/* Switch Role Button */}
        {userRole === 'student' ? (
          <button
            onClick={() => requestRoleSwitch('professor')}
            className="w-full py-2 px-3 rounded-xl bg-white border border-[#c2c6d3]/70 hover:border-[#00346f] hover:bg-[#d5e3fc]/50 text-[#00346f] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Faculty Portal Login
          </button>
        ) : (
          <button
            onClick={() => requestRoleSwitch('student')}
            className="w-full py-2 px-3 rounded-xl bg-white border border-[#c2c6d3]/70 hover:border-[#00346f] hover:bg-[#d5e3fc]/50 text-[#00346f] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">switch_account</span>
            Switch to Student View
          </button>
        )}

        {/* User Identity Profile Card */}
        <div className="flex items-center gap-3 pt-1">
          {userRole === 'student' ? (
            <>
              <img
                alt={currentStudent.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00346f]/20 shadow-sm"
                src={currentStudent.avatar}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] text-[#111c2d] truncate">{currentStudent.name}</span>
                <span className="text-[11px] font-medium text-[#424751] truncate">{currentStudent.studentId} • {currentStudent.major}</span>
              </div>
            </>
          ) : (
            <>
              <img
                alt="Dr. Sarah Chen"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/30 shadow-sm"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] text-[#111c2d] truncate">Dr. Sarah Chen</span>
                <span className="text-[11px] font-medium text-[#424751] truncate">Department Head</span>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
