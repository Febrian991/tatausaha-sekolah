import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { SuratMasuk, ScanFileInfo } from '../../types';
import { SAMPLE_SCAN_DOCUMENT_IMAGE } from '../../lib/constants';

interface SuratMasukModalProps {
  surat: SuratMasuk | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SuratMasuk) => void;
}

export const SuratMasukModal: React.FC<SuratMasukModalProps> = ({
  surat,
  isOpen,
  onClose,
  onSave,
}) => {
  const [noAgenda, setNoAgenda] = useState(surat ? surat.noAgenda : `AG/SM/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [noSurat, setNoSurat] = useState(surat ? surat.noSurat : '');
  const [tanggalSurat, setTanggalSurat] = useState(surat ? surat.tanggalSurat : new Date().toISOString().slice(0, 10));
  const [tanggalDiterima, setTanggalDiterima] = useState(surat ? surat.tanggalDiterima : new Date().toISOString().slice(0, 10));
  const [asalSurat, setAsalSurat] = useState(surat ? surat.asalSurat : '');
  const [perihal, setPerihal] = useState(surat ? surat.perihal : '');
  const [ringkasan, setRingkasan] = useState(surat ? surat.ringkasan : '');
  const [klasifikasi, setKlasifikasi] = useState<SuratMasuk['klasifikasi']>(surat ? surat.klasifikasi : 'Biasa');
  const [scanFile, setScanFile] = useState<ScanFileInfo | undefined>(surat?.scanFile);
  const [fileNamePreview, setFileNamePreview] = useState<string>(surat?.scanFile?.namaFile || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNamePreview(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScanFile({
        id: `scan-${Date.now()}`,
        namaFile: file.name,
        tipe: file.type.includes('pdf') ? 'pdf' : 'image',
        ukuran: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dataUrl: result.startsWith('data:image') ? result : SAMPLE_SCAN_DOCUMENT_IMAGE,
        uploadedAt: new Date().toLocaleString('id-ID'),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSurat || !asalSurat || !perihal) return;

    const data: SuratMasuk = {
      id: surat ? surat.id : `sm-${Date.now()}`,
      noAgenda,
      noSurat,
      tanggalSurat,
      tanggalDiterima,
      asalSurat,
      perihal,
      ringkasan,
      klasifikasi,
      statusDisposisi: surat?.statusDisposisi || 'Belum',
      disposisi: surat?.disposisi,
      scanFile: scanFile || (surat?.scanFile ? surat.scanFile : undefined),
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold">
              {surat ? 'Edit Agenda Surat Masuk' : 'Registrasi Surat Masuk Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Agenda TU
              </label>
              <input
                type="text"
                value={noAgenda}
                onChange={e => setNoAgenda(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Klasifikasi Kecepatan
              </label>
              <select
                value={klasifikasi}
                onChange={e => setKlasifikasi(e.target.value as SuratMasuk['klasifikasi'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Segera">Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nomor Surat Asli
            </label>
            <input
              type="text"
              value={noSurat}
              onChange={e => setNoSurat(e.target.value)}
              placeholder="Contoh: 421.3/2890-Set.Disdik/2026"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Tertera Surat
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={e => setTanggalSurat(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Diterima TU
              </label>
              <input
                type="date"
                value={tanggalDiterima}
                onChange={e => setTanggalDiterima(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Asal Instansi / Pengirim Surat
            </label>
            <input
              type="text"
              value={asalSurat}
              onChange={e => setAsalSurat(e.target.value)}
              placeholder="Contoh: Dinas Pendidikan Provinsi Jawa Barat"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Perihal / Hal Surat
            </label>
            <input
              type="text"
              value={perihal}
              onChange={e => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi Kurikulum Merdeka"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Ringkasan Isi / Catatan Khusus
            </label>
            <textarea
              rows={2}
              value={ringkasan}
              onChange={e => setRingkasan(e.target.value)}
              placeholder="Poin penting atau tindak lanjut awal..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          {/* Upload Scan Fisik Surat Masuk */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Unggah Scan Fisik Surat (PDF / JPG / PNG)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arsip digital fisik untuk pratinjau lightbox dan pembuktian cap dinas.
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {fileNamePreview && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-white border border-slate-200 rounded text-xs text-slate-700 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate flex-1">{fileNamePreview}</span>
                <span className="text-emerald-700 text-[11px] font-sans font-medium">Siap Diarsipkan</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {surat ? 'Simpan Perubahan' : 'Daftarkan Surat Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
