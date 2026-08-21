import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, activeSession } = useApp();

  const navItems: { id: ViewMode; label: string; icon: string; badge?: string }[] = [
    { id: 'professor-dashboard', label: 'Professor Dashboard', icon: 'dashboard' },
    { 
      id: 'active-sessions', 
      label: 'Active Sessions', 
      icon: 'qr_code_scanner',
      badge: activeSession && activeSession.status === 'active' ? 'LIVE' : undefined
    },
    { id: 'attendance-reports', label: 'Attendance Reports', icon: 'assessment' },
    { id: 'student-view', label: 'Student View', icon: 'person_search' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#f0f3ff] border-r border-[#c2c6d3]/40 z-50 flex flex-col justify-between shadow-[1px_0_0_0_rgba(0,0,0,0.03)] select-none">
      {/* Top Brand & Navigation */}
      <div>
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3">
          <img
            alt="QRAttend Logo"
            className="h-8 w-auto object-contain drop-shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzoTNc4UR8BGY_ectUgrY71-FJ-FFnu5ybPIi8nPurthyICys0rt6dQR2evzbuCDlRclJc9eYDMu6X6HSi1HbOxCaY3luvnikKUq6TVhe4YaaHyIX72FtRskluWTqyK1AmWGAA3613rWtb4VxKqpsF-jXyU27ViIH0ps4ykJEDuaE8iTg9TsmAPIq_J7iQ2broDDevOdU9v_sb21ThCFo0jlh2HytB6Rg1ML1fJoByNdThsNjFIjz4"
            onError={(e) => {
              // fallback if external hotlink blocked
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-[#00346f] tracking-tight">QRAttend</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#004a99]/10 text-[#004a99]">v2.4</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 mt-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#d5e3fc] text-[#3a485b] font-bold shadow-sm'
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
                  <span className="text-[15px] font-medium leading-none">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-5 border-t border-[#c2c6d3]/60 bg-[#e7eeff]/40">
        <div className="flex items-center gap-3">
          <img
            alt="Dr. Sarah Chen"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00346f]/20 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVIi3fH0OHh5vhshdzHysps9j_x33iMbX2iQxyiLSOgf2ZwuZlFSFwiYlHEGHhf-K2PRBT7Gb4StoNXWbudvsdkDXkJSyj-4EEOgK5k5UN7paA6FGeuGS7ZTN1RLawDPCQZpovfL1y0i2BE7t273j9CVY40W3fv3qrfAJW7i76HAkiOX4R4Y5rG1X09Bk9fOKyhBrdYnnUWGYXdtmb27XNOeqoGTwcspLQIUWMqcgHpft53vLm10J0"
            onError={(e) => {
              // fallback image if network restricts hotlink
              e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[15px] text-[#111c2d] truncate">Dr. Sarah Chen</span>
            <span className="text-[12px] font-medium text-[#424751] truncate">Department Head</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
