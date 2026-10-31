import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  UserCheck, 
  Wallet, 
  Settings, 
  FileText,
  BadgeAlert
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  pendingMutationCount: number;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  pendingMutationCount,
  onSelectTab
}) => {
  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    allowedRoles: UserRole[];
    badge?: number;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      allowedRoles: ['operator', 'tu', 'bendahara', 'kepsek']
    },
    {
      id: 'buku-induk',
      label: 'Buku Induk Siswa',
      icon: Users,
      allowedRoles: ['operator', 'tu', 'kepsek'] // Bendahara excluded
    },
    {
      id: 'persuratan',
      label: 'Persuratan & Disposisi',
      icon: Mail,
      allowedRoles: ['operator', 'tu', 'kepsek'] // Bendahara excluded
    },
    {
      id: 'mutasi',
      label: currentRole === 'tu' ? 'Pengajuan Mutasi' : 'Mutasi Siswa (Dapodik)',
      icon: UserCheck,
      allowedRoles: ['operator', 'tu', 'kepsek'], // Bendahara excluded
      badge: currentRole === 'operator' && pendingMutationCount > 0 ? pendingMutationCount : undefined
    },
    {
      id: 'keuangan',
      label: currentRole === 'bendahara' ? 'Buku Kas Umum (BKU)' : 'Monitoring Keuangan',
      icon: Wallet,
      allowedRoles: ['operator', 'bendahara', 'kepsek'] // TU excluded
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Kop Sekolah',
      icon: Settings,
      allowedRoles: ['operator'] // Only Super Admin/Operator
    }
  ];

  const visibleNavs = navItems.filter((item) => item.allowedRoles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)] border-r border-slate-800">
      {/* Role Indicator Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          HAK AKSES RESMI
        </div>
        <div className="text-xs font-bold text-white mt-0.5">
          {currentRole === 'operator' && '👑 Operator + Super Admin'}
          {currentRole === 'tu' && '📋 Staf Tata Usaha (TU)'}
          {currentRole === 'bendahara' && '💰 Bendahara BOS'}
          {currentRole === 'kepsek' && '🏛️ Kepala Sekolah'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {visibleNavs.map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => onSelectTab(nav.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{nav.label}</span>
              </div>

              {nav.badge !== undefined && nav.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                  {nav.badge} Baru
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        <div>SIMAS Kedinasan v2.6</div>
        <div className="text-[10px] text-slate-600 mt-0.5">
          Kemendikbudristek & Kemenag Sync
        </div>
      </div>
    </aside>
  );
};
