import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  ArrowRightLeft, 
  FileText, 
  Settings, 
  GraduationCap
} from 'lucide-react';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  pendingDisposisiCount: number;
  pendingMutasiCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingDisposisiCount,
  pendingMutasiCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard TU',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'surat-masuk',
      label: 'Surat Masuk',
      icon: Inbox,
      badge: pendingDisposisiCount > 0 ? `${pendingDisposisiCount} Disposisi` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'surat-keluar',
      label: 'Surat Keluar',
      icon: Send,
      badge: null,
    },
    {
      id: 'mutasi',
      label: 'Mutasi Siswa',
      icon: ArrowRightLeft,
      badge: pendingMutasiCount > 0 ? `${pendingMutasiCount} Dapodik` : null,
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'template',
      label: 'Template Surat Resmi',
      icon: FileText,
      badge: 'SPPD & GTK',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'settings',
      label: 'Pengaturan Sekolah',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80">
          <TutWuriHandayaniLogo className="w-8 h-8 shrink-0" />
          <div className="truncate">
            <span className="text-sm font-bold text-white tracking-tight block truncate">
              SI-TATAUSAHA
            </span>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-medium">
              Administrasi Sekolah Lengkap
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 m-3 rounded-lg bg-slate-950/40">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <GraduationCap className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-300">Standar Kemdikbudristek</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Kop Logo Ganda, Titi Mangsa Fleksibel, &amp; Alur Dapodik Terintegrasi.
        </p>
      </div>
    </aside>
  );
};
