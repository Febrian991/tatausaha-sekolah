import React from 'react';
import { Search, Plus, Printer, Sparkles, Building2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, schoolProfile, globalSearchQuery, setGlobalSearchQuery, setIsSettingsOpen, setIsGuideOpen } = useApp();

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

      {/* Zone 3: Quick Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setCurrentView('ai-letters')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Buat Surat AI</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          title="Pengaturan Kop Surat Sekolah"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Kop Sekolah</span>
        </button>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          title="Buka dan Unduh Buku Panduan PDF Lengkap"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Panduan PDF</span>
        </button>
      </div>
    </header>
  );
};
