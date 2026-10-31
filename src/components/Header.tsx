import React from 'react';
import { Search, Plus, Printer, Sparkles, Building2, BookOpen, Download, KeyRound, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    schoolProfile,
    globalSearchQuery,
    setGlobalSearchQuery,
    setIsSettingsOpen,
    setIsGuideOpen,
    currentUser,
    logout,
    setIsChangePasswordOpen,
  } = useApp();

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Ringkasan Eksekutif & Statistik Operasional';
      case 'students':
        return 'Buku Induk Siswa & Administrasi Kesiswaan';
      case 'staff':
        return 'Data Pendidik & Tenaga Kependidikan (PTK)';
      case 'mail':
        return 'Agenda Persuratan Dinas & Lembar Disposisi';
      case 'finance':
        return 'Administrasi Keuangan, SPP & Rekap Kas Sekolah';
      case 'inventory':
        return 'Inventaris Sarana & Prasarana Sekolah (Sarpras)';
      case 'ai-letters':
        return 'Asisten Generator Draf Surat Dinas Resmi AI';
      default:
        return 'Tata Usaha Sekolah';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 no-print">
      {/* Zone 1: Breadcrumb / Section Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tata Usaha</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800 font-medium capitalize">{currentView.replace('-', ' ')}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 truncate tracking-tight">{getBreadcrumbTitle()}</h2>
        </div>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          placeholder="Cari siswa (NISN/Nama), guru, nomor surat, atau aset..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
        />
        {globalSearchQuery && (
          <button
            onClick={() => setGlobalSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Zone 3: Quick Action Buttons & User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setCurrentView('ai-letters')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Buat Surat AI</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          title="Pengaturan Kop Surat Sekolah"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Kop Sekolah</span>
        </button>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          title="Buka dan Unduh Buku Panduan PDF Lengkap"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Panduan PDF</span>
        </button>

        <a
          href="/api/download-source-zip"
          download="SI-TATAUSAHA-LENGKAP.zip"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          title="Unduh Paket Kode Sumber Terbaru (.ZIP) berisi Fitur Login & Akun"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700" />
          <span>Unduh ZIP Terbaru</span>
        </a>

        {/* User Account Capsule */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 py-1 px-2 rounded-xl border border-slate-200">
              <div
                className={`w-7 h-7 rounded-lg ${currentUser.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-[11px] font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser.name.split(',')[0]}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-none">
                  {currentUser.roleLabel.split(' ')[0]}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Ganti Kata Sandi Akun"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
                  logout();
                }
              }}
              className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

