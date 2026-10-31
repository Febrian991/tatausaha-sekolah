import React from 'react';
import { FilePlus2, School } from 'lucide-react';

interface SituTopNavProps {
  activeView: 'surat' | 'mutasi' | 'arsip' | 'pengaturan';
  setActiveView: (view: 'surat' | 'mutasi' | 'arsip' | 'pengaturan') => void;
}

export const SituTopNav: React.FC<SituTopNavProps> = ({ activeView, setActiveView }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 z-50 sticky top-0 no-print">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => setActiveView('surat')}
        className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors cursor-pointer text-left"
      >
        <span className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
          TU
        </span>
        <span>SI-TU SEKOLAH</span>
      </button>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveView('surat')}
          className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'surat' ? 'text-blue-600 font-bold border-b-2 border-blue-600 py-1' : ''
          }`}
        >
          Persuratan Kedinasan
        </button>

        <button
          onClick={() => setActiveView('mutasi')}
          className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'mutasi' ? 'text-blue-600 font-bold border-b-2 border-blue-600 py-1' : ''
          }`}
        >
          Mutasi Siswa Dapodik
        </button>

        <button
          onClick={() => setActiveView('arsip')}
          className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'arsip' ? 'text-blue-600 font-bold border-b-2 border-blue-600 py-1' : ''
          }`}
        >
          Scan Fisik Arsip Digital
        </button>

        <button
          onClick={() => setActiveView('pengaturan')}
          className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'pengaturan' ? 'text-blue-600 font-bold border-b-2 border-blue-600 py-1' : ''
          }`}
        >
          Kop Resmi & Titi Mangsa
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveView('surat')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Buat Surat Dinas</span>
        </button>
      </div>
    </header>
  );
};
