import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  const { 
    currentView, 
    setCurrentView, 
    notifications, 
    markNotificationsAsRead,
    activeSession 
  } = useApp();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#f9f9ff]/90 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b border-[#c2c6d3]/40 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left side quick status breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#515f74]">System</span>
        <span className="text-xs text-[#737783]">•</span>
        <div className="flex items-center gap-2">
          {activeSession && activeSession.status === 'active' ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-emerald-800">
                Live Session: {activeSession.courseCode} ({activeSession.presentCount}/{activeSession.totalEnrolled})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span className="text-xs font-medium text-slate-600">Idle / No Active Session</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side actions matching the design */}
      <div className="flex items-center gap-6">
        {/* Quick Role Switcher */}
        <div className="flex items-center bg-[#dee8ff] p-1 rounded-lg">
          <button
            onClick={() => setCurrentView('student-view')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              currentView === 'student-view'
                ? 'bg-[#00346f] text-white shadow-xs'
                : 'text-[#00346f] hover:bg-white/50'
            }`}
          >
            Student Mode
          </button>
          <button
            onClick={() => setCurrentView('professor-dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              currentView !== 'student-view'
                ? 'bg-[#00346f] text-white shadow-xs'
                : 'text-[#00346f] hover:bg-white/50'
            }`}
          >
            Professor Mode
          </button>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(prev => !prev);
              if (!showNotifs && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="p-1.5 text-[#424751] hover:text-[#00346f] transition-colors relative rounded-full hover:bg-[#dee8ff]"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-[#c2c6d3]/60 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-bold text-[#111c2d]">Notifications</span>
                <span className="text-xs text-gray-500">{notifications.length} alerts</span>
              </div>
              <div className="mt-2 divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-2">
                      <span className={`material-symbols-outlined text-[18px] mt-0.5 ${
                        n.type === 'warning' ? 'text-amber-600' :
                        n.type === 'success' ? 'text-emerald-600' : 'text-[#004a99]'
                      }`}>
                        {n.type === 'warning' ? 'warning' : n.type === 'success' ? 'check_circle' : 'info'}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#111c2d]">{n.title}</p>
                        <p className="text-xs text-[#424751] mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Question Icon */}
        <button
          onClick={onOpenHelp}
          className="p-1.5 text-[#424751] hover:text-[#00346f] transition-colors rounded-full hover:bg-[#dee8ff]"
          title="System Instructions & Geofence FAQ"
        >
          <span className="material-symbols-outlined text-[22px]">help</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-[#c2c6d3]"></div>

        {/* Logout Button */}
        <button
          onClick={() => {
            setCurrentView('student-view');
          }}
          className="flex items-center gap-1.5 text-[#424751] hover:text-[#ba1a1a] transition-colors group px-2 py-1 rounded-lg hover:bg-red-50"
        >
          <span className="text-sm font-medium">Logout</span>
          <span className="material-symbols-outlined text-[20px] text-[#424751] group-hover:text-[#ba1a1a] transition-colors">
            logout
          </span>
        </button>
      </div>
    </header>
  );
};
