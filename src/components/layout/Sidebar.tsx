import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  ArrowRightLeft, 
  FileText, 
  Settings, 
  GraduationCap,
  BookOpen,
  Wallet,
  Receipt,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';
import { UserSession } from '../../types';

interface SidebarProps {
  currentView: string;
  user: UserSession | null;
  onSelectView: (view: string) => void;
  pendingDisposisiCount: number;
  pendingMutasiCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  user,
  onSelectView,
  pendingDisposisiCount,
  pendingMutasiCount,
}) => {
  const role = user?.role || 'operator_superadmin';

  // Construct role-specific navigation menus
  const getNavItems = () => {
    // 1. BENDAHARA: KHUSUS KEUANGAN SAJA
    if (role === 'bendahara') {
      return [
        {
          id: 'keuangan',
          label: 'Keuangan & BKU',
          icon: Wallet,
          badge: 'Kas Aktif',
          badgeColor: 'bg-emerald-500 text-white',
        },
      ];
    }

    // 2. TATA USAHA: BUKU INDUK, PERSURATAN & PERMOHONAN MUTASI
    if (role === 'tata_usaha' || role === 'kasubag_tu' || role === 'staf_persuratan') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard TU',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'buku-induk',
          label: 'Buku Induk Siswa',
          icon: BookOpen,
          badge: 'Data Pokok',
          badgeColor: 'bg-sky-100 text-sky-800',
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
          label: 'Permohonan Mutasi',
          icon: ArrowRightLeft,
          badge: 'Ajukan Masuk/Keluar',
          badgeColor: 'bg-amber-100 text-amber-800',
        },
        {
          id: 'template',
          label: 'Template Surat Resmi',
          icon: FileText,
          badge: 'SPPD & GTK',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
      ];
    }

    // 3. KEPALA SEKOLAH: MONITORING & DISPOSISI
    if (role === 'kepala_sekolah' || role === 'kepsek') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard Eksekutif',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'buku-induk',
          label: 'Buku Induk Siswa',
          icon: BookOpen,
          badge: null,
        },
        {
          id: 'surat-masuk',
          label: 'Surat Masuk & Disposisi',
          icon: Inbox,
          badge: pendingDisposisiCount > 0 ? `${pendingDisposisiCount} Perlu Disposisi` : null,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'surat-keluar',
          label: 'Surat Keluar & Pengesahan',
          icon: Send,
          badge: null,
        },
        {
          id: 'mutasi',
          label: 'Monitoring Mutasi Siswa',
          icon: ArrowRightLeft,
          badge: null,
        },
        {
          id: 'keuangan',
          label: 'Monitoring Keuangan & BOS',
          icon: Wallet,
          badge: null,
        },
      ];
    }

    // 4. OPERATOR SEKOLAH + SUPER ADMIN (VERSI LENGKAP - AKSES PENUH)
    return [
      {
        id: 'dashboard',
        label: 'Dashboard Lengkap',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        id: 'buku-induk',
        label: 'Buku Induk Siswa',
        icon: BookOpen,
        badge: 'Data Pokok',
        badgeColor: 'bg-sky-100 text-sky-800',
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
        label: 'Approval Mutasi (Dapodik)',
        icon: ArrowRightLeft,
        badge: pendingMutasiCount > 0 ? `${pendingMutasiCount} Approval` : null,
        badgeColor: 'bg-rose-500 text-white font-bold',
      },
      {
        id: 'template',
        label: 'Template Surat Resmi',
        icon: FileText,
        badge: 'SPPD & GTK',
        badgeColor: 'bg-emerald-100 text-emerald-800',
      },
      {
        id: 'keuangan',
        label: 'Keuangan & Kas Sekolah',
        icon: Wallet,
        badge: 'BOS & SPP',
        badgeColor: 'bg-emerald-500/20 text-emerald-300',
      },
      {
        id: 'settings',
        label: 'Pengaturan Sekolah & Kop',
        icon: Settings,
        badge: 'Super Admin',
        badgeColor: 'bg-purple-900/60 text-purple-300',
      },
    ];
  };

  const navItems = getNavItems();

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
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-medium truncate">
              {role === 'bendahara' 
                ? 'Portal Keuangan & BKU'
                : role === 'tata_usaha'
                ? 'Portal Tata Usaha & Arsip'
                : 'Sistem Terpadu Sekolah'}
            </span>
          </div>
        </div>

        {/* Current Role Indicator */}
        <div className="mx-3 mt-3 px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="truncate text-[11px]">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Peran Aktif:</span>
            <span className="font-bold text-white block truncate">
              {user?.roleLabel || 'Operator & Super Admin'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Kedinasan
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
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
          <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-semibold text-slate-300 text-[11px]">Standar Administrasi Resmi</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
          {role === 'bendahara'
            ? 'Khusus Keuangan: Kas Masuk, Kas Keluar, SPP, BOS & Kwitansi.'
            : role === 'tata_usaha'
            ? 'Buku Induk, Persuratan & Pengajuan Mutasi terhubung ke Operator.'
            : 'Operator Sekolah & Super Admin terintegrasi penuh.'}
        </p>
      </div>
    </aside>
  );
};
