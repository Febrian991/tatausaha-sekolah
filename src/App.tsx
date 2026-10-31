/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { StudentsView } from './components/StudentsView.tsx';
import { StaffView } from './components/StaffView.tsx';
import { MailArchiveView } from './components/MailArchiveView.tsx';
import { FinanceView } from './components/FinanceView.tsx';
import { InventoryView } from './components/InventoryView.tsx';
import { AILetterStudioView } from './components/AILetterStudioView.tsx';
import { PrintModal } from './components/PrintModal.tsx';
import { SchoolSettingsModal } from './components/SchoolSettingsModal.tsx';
import { BackupRestoreModal } from './components/BackupRestoreModal.tsx';
import { UserGuideModal } from './components/UserGuideModal.tsx';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'staff':
        return <StaffView />;
      case 'mail':
        return <MailArchiveView />;
      case 'finance':
        return <FinanceView />;
      case 'inventory':
        return <InventoryView />;
      case 'ai-letters':
        return <AILetterStudioView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/70">
          <div className="max-w-7xl mx-auto pb-12">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Interactive Overlays & Modals */}
      <PrintModal />
      <SchoolSettingsModal />
      <BackupRestoreModal />
      <UserGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
