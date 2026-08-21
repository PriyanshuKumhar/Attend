/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StudentScanner } from './components/StudentScanner';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { ActiveSessionsView } from './components/ActiveSessionsView';
import { AttendanceReportsView } from './components/AttendanceReportsView';
import { SettingsView } from './components/SettingsView';
import { NewSessionModal } from './components/NewSessionModal';
import { HelpModal } from './components/HelpModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width 72 = 18rem) */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header onOpenHelp={() => setIsHelpOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="relative pt-16 min-h-screen bg-[#f9f9ff]">
          {currentView === 'student-view' && <StudentScanner />}
          {currentView === 'professor-dashboard' && (
            <ProfessorDashboard onStartNewSession={() => setIsNewSessionOpen(true)} />
          )}
          {currentView === 'active-sessions' && (
            <ActiveSessionsView onStartNewSession={() => setIsNewSessionOpen(true)} />
          )}
          {currentView === 'attendance-reports' && <AttendanceReportsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <NewSessionModal isOpen={isNewSessionOpen} onClose={() => setIsNewSessionOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
