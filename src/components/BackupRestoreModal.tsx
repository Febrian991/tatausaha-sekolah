import React, { useState, useRef } from 'react';
import { DatabaseBackup, Download, Upload, AlertCircle, CheckCircle, RotateCcw, X } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const BackupRestoreModal: React.FC = () => {
  const { isBackupOpen, setIsBackupOpen, exportDataJSON, importDataJSON, resetAllData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isBackupOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      if (res.success) {
        setNotification({ type: 'success', text: res.message });
        setTimeout(() => {
          setNotification(null);
          setIsBackupOpen(false);
        }, 1200);
      } else {
        setNotification({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus semua data dan mengembalikannya ke data bawaan awal sekolah?')) {
      resetAllData();
      setNotification({ type: 'success', text: 'Semua data telah direset ke setelan awal pabrik.' });
      setTimeout(() => {
        setNotification(null);
        setIsBackupOpen(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 overflow-hidden animate-in fade-in text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <DatabaseBackup className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Cadangkan & Pulihkan Data TU</h3>
          </div>
          <button
            onClick={() => setIsBackupOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {notification && (
          <div
            className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Unduh Cadangan (Backup JSON)</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Simpan seluruh rekaman buku induk siswa, arsip persuratan, transaksi kas SPP, dan aset sarpras ke dalam satu file JSON lokal di komputer Anda.
            </p>
            <button
              onClick={exportDataJSON}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Cadangan JSON</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Pulihkan dari Berkas JSON</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Unggah file cadangan yang telah diunduh sebelumnya untuk memulihkan seluruh data operasional sekolah.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Pilih File JSON & Pulihkan</span>
            </button>
          </div>

          {/* Factory Reset */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Data ke Contoh Awal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
