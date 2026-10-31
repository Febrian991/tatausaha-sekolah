import React, { useState } from 'react';
import { X, Upload, Send, CheckCircle2 } from 'lucide-react';
import { SuratKeluar, ScanFileInfo, SchoolProfile } from '../../types';
import { SAMPLE_SCAN_DOCUMENT_IMAGE } from '../../lib/constants';

interface SuratKeluarModalProps {
  surat: SuratKeluar | null;
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SuratKeluar) => void;
}

export const SuratKeluarModal: React.FC<SuratKeluarModalProps> = ({
  surat,
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [noAgenda, setNoAgenda] = useState(surat ? surat.noAgenda : `AG/SK/2026/${Math.floor(2000 + Math.random() * 8000)}`);
  const [noSurat, setNoSurat] = useState(surat ? surat.noSurat : `421.3/${Math.floor(500 + Math.random() * 200)}/SMAN.1/XI/2026`);
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(surat ? surat.kodeKlasifikasi : '421.3 (Pendidikan & Pengajaran)');
  const [tujuanSurat, setTujuanSurat] = useState(surat ? surat.tujuanSurat : '');
  const [perihal, setPerihal] = useState(surat ? surat.perihal : '');
  const [ringkasan, setRingkasan] = useState(surat ? surat.ringkasan : '');
  const [tanggalSurat, setTanggalSurat] = useState(surat ? surat.tanggalSurat : new Date().toISOString().slice(0, 10));
  const [penandatangan, setPenandatangan] = useState(surat ? surat.penandatangan : profile.namaKepalaSekolah);
  const [statusArsip, setStatusArsip] = useState<SuratKeluar['statusArsip']>(surat ? surat.statusArsip : 'Terkirim');
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
    if (!noSurat || !tujuanSurat || !perihal) return;

    const data: SuratKeluar = {
      id: surat ? surat.id : `sk-${Date.now()}`,
      noAgenda,
      noSurat,
      kodeKlasifikasi,
      tujuanSurat,
      perihal,
      ringkasan,
      tanggalSurat,
      penandatangan,
      statusArsip,
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
            <Send className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold">
              {surat ? 'Edit Agenda Surat Keluar' : 'Registrasi Surat Keluar Resmi'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Agenda Keluar
              </label>
              <input
                type="text"
                value={noAgenda}
                onChange={e => setNoAgenda(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kode Klasifikasi Surat
              </label>
              <input
                type="text"
                value={kodeKlasifikasi}
                onChange={e => setKodeKlasifikasi(e.target.value)}
                placeholder="Contoh: 421.3 (Kurikulum) / 090 (SPPD)"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nomor Surat Resmi Sekolah
            </label>
            <input
              type="text"
              value={noSurat}
              onChange={e => setNoSurat(e.target.value)}
              placeholder="Contoh: 421.3/515/SMAN.1/XI/2026"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Terbit Surat
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={e => setTanggalSurat(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status Arsip Fisik
              </label>
              <select
                value={statusArsip}
                onChange={e => setStatusArsip(e.target.value as SuratKeluar['statusArsip'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Draft">Draft / Konsep</option>
                <option value="Terkirim">Terkirim ke Tujuan</option>
                <option value="Diarsipkan">Telah Ditandatangani &amp; Diarsipkan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Ditujukan Kepada
            </label>
            <input
              type="text"
              value={tujuanSurat}
              onChange={e => setTujuanSurat(e.target.value)}
              placeholder="Contoh: Kepala Balai Besar Penjaminan Mutu Pendidikan (BBPMP)"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              placeholder="Contoh: Permohonan Narasumber Kurikulum Merdeka"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pejabat Penandatangan
              </label>
              <input
                type="text"
                value={penandatangan}
                onChange={e => setPenandatangan(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Catatan Ekspedisi / Kurir
              </label>
              <input
                type="text"
                value={ringkasan}
                onChange={e => setRingkasan(e.target.value)}
                placeholder="Diserahkan langsung / Pos / Email kedinasan"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Upload Scan Fisik Surat Keluar */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Unggah Scan Fisik Surat Berstempel (PDF / JPG / PNG)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lampirkan salinan surat asli yang telah ditandatangani dan dibubuhi stempel basah sekolah.
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors">
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
                <span className="text-emerald-700 text-[11px] font-sans font-medium">Tersimpan dalam Arsip</span>
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
              {surat ? 'Simpan Perubahan' : 'Daftarkan Surat Keluar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
