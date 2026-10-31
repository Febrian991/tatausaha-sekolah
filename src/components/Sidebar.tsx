import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Mail,
  Receipt,
  Boxes,
  Sparkles,
  School,
  Settings,
  DatabaseBackup,
  BookOpen,
  Download,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ViewMode } from '../types/index.ts';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    stats,
    schoolProfile,
    setIsSettingsOpen,
    setIsBackupOpen,
    setIsGuideOpen,
    currentUser,
    logout,
    setIsChangePasswordOpen,
  } = useApp();

  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Ringkasan Eksekutif',
      icon: LayoutDashboard,
    },
    {
      id: 'mail',
      label: 'Persuratan & Disposisi',
      icon: Mail,
      badge: stats.pendingDispositions,
    },
    {
      id: 'students',
      label: 'Buku Induk Siswa',
      icon: Users,
    },
    {
      id: 'staff',
      label: 'Kepegawaian (PTK)',
      icon: Briefcase,
    },
    {
      id: 'finance',
      label: 'Kas & SPP Sekolah',
      icon: Receipt,
    },
    {
      id: 'inventory',
      label: 'Sarana & Prasarana',
      icon: Boxes,
      badge: stats.damagedInventory > 0 ? stats.damagedInventory : undefined,
    },
    {
      id: 'ai-letters',
      label: 'Asisten Surat Dinas AI',
      icon: Sparkles,
    },
  ];

  // Role-based navigation filtering
  const allowedViews: ViewMode[] = (() => {
    if (!currentUser) return ['dashboard'];
    switch (currentUser.role) {
      case 'bendahara':
        return ['dashboard', 'finance', 'students'];
      case 'kepsek':
        return ['dashboard', 'mail', 'students', 'staff', 'ai-letters'];
      case 'staf_tu':
        return ['dashboard', 'mail', 'students', 'staff', 'inventory', 'ai-letters'];
      case 'kepala_tu':
      default:
        return ['dashboard', 'mail', 'students', 'staff', 'finance', 'inventory', 'ai-letters'];
    }
  })();

  const navItems = allNavItems.filter((item) => allowedViews.includes(item.id));

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col shrink-0 min-h-screen select-none no-print">
      {/* Brand Zone */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <School className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm tracking-tight text-white truncate">SI-TATAUSAHA</h1>
            <p className="text-xs text-slate-400 truncate">{schoolProfile.namaSekolah}</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Modul Tata Usaha</span>
          {currentUser && (
            <span className="text-[9px] text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded font-mono">
              {currentUser.roleLabel.split(' ')[0]}
            </span>
          )}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* School Status & Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900/60">
        {currentUser && (
          <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-8 h-8 rounded-lg ${currentUser.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name.split(',')[0]}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.roleLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/80 rounded-md transition-colors cursor-pointer"
                title="Ganti Password"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Yakin ingin keluar dari akun ini?')) {
                    logout();
                  }
                }}
                className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded-md transition-colors cursor-pointer"
                title="Keluar / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsGuideOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition-colors cursor-pointer"
          title="Buka dan Unduh Buku Panduan PDF Lengkap"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Buku Panduan PDF</span>
        </button>

        {(!currentUser || currentUser.role === 'kepala_tu') && (
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Pengaturan Kop Surat & Identitas Sekolah"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kop Surat</span>
            </button>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Cadangkan atau Pulihkan Data JSON"
            >
              <DatabaseBackup className="w-3.5 h-3.5" />
              <span>Cadangan</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

