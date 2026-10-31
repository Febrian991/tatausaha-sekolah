import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  LogOut, 
  Printer, 
  Bell,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Trash2
} from 'lucide-react';
import { UserSession, SchoolProfile, AppNotification } from '../../types';

interface HeaderProps {
  currentView: string;
  user: UserSession | null;
  profile: SchoolProfile;
  notifications: AppNotification[];
  onLogout: () => void;
  onOpenQuickPrint?: () => void;
  onNavigate: (view: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  user,
  profile,
  notifications,
  onLogout,
  onOpenQuickPrint,
  onNavigate,
  onMarkNotificationRead,
  onClearNotifications,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Administrasi & Statistik Sekolah';
      case 'buku-induk': return 'Buku Induk Register Peserta Didik';
      case 'surat-masuk': return 'Buku Agenda Surat Masuk & Lembar Disposisi';
      case 'surat-keluar': return 'Buku Agenda Surat Keluar & Pengarsipan';
      case 'mutasi': return 'Manajemen Mutasi Siswa & Alur Persetujuan Dapodik';
      case 'template': return 'Generator Template Surat Kedinasan (SPPD, Undangan, Panggilan)';
      case 'keuangan': return 'Pengelolaan Kas Sekolah, SPP & Realisasi BOS';
      case 'settings': return 'Pengaturan Identitas Sekolah & Kop Dinas';
      default: return 'Sistem Informasi Tata Usaha & Keuangan';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'operator_superadmin':
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tata_usaha':
      case 'kasubag_tu':
      case 'staf_persuratan':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'bendahara':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'kepala_sekolah':
      case 'kepsek':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 shadow-xs z-30 relative">
      {/* Zone 1: Breadcrumb and Context Title */}
      <div className="flex items-center gap-3 truncate">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="truncate">{profile.namaSekolah}</span>
          <span>/</span>
        </div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
          {getViewTitle()}
        </h1>
      </div>

      {/* Zone 2: Fast Quick Action & Notifications Center */}
      <div className="flex items-center gap-3 text-xs">
        {onOpenQuickPrint && (
          <button
            onClick={onOpenQuickPrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Cepat</span>
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Pemberitahuan Sistem & Pengajuan TU"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-xs">Pemberitahuan Kedinasan</span>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-[10px] text-slate-400 hover:text-rose-300 flex items-center gap-1"
                      title="Bersihkan Semua Notifikasi"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 text-xs transition-colors ${
                        n.read ? 'bg-white hover:bg-slate-50' : 'bg-sky-50/70 hover:bg-sky-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between pt-1">
                        {n.type.startsWith('mutasi') ? (
                          <button
                            onClick={() => {
                              onNavigate('mutasi');
                              onMarkNotificationRead(n.id);
                              setIsNotifOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900"
                          >
                            <span>Buka Verifikasi Mutasi</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Notifikasi Sistem</span>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => onMarkNotificationRead(n.id)}
                            className="text-[10px] text-slate-500 hover:text-slate-800"
                          >
                            Tandai Dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada notifikasi baru.
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500">
                Notifikasi Pengajuan Mutasi dari Tata Usaha ke Operator Sekolah
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Account Profile & Logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadge(user.role)}`}>
                  {user.roleLabel}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={onLogout}
              title="Keluar dari Akun"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Masuk
          </button>
        )}
      </div>
    </header>
  );
};
