import React, { useState } from 'react';
import { X, Send, Printer } from 'lucide-react';
import { SuratMasuk, DisposisiData, SchoolProfile } from '../../types';

interface DisposisiModalProps {
  surat: SuratMasuk | null;
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSurat: SuratMasuk) => void;
  onPrintPreview: (surat: SuratMasuk) => void;
}

const PEJABAT_OPSI = [
  'Wakasek Kurikulum',
  'Wakasek Kesiswaan',
  'Wakasek Sarana Prasarana',
  'Wakasek Hubungan Masyarakat (Humas)',
  'Kasubag Tata Usaha',
  'Bendahara BOS / BOPD',
  'Koordinator Bimbingan Konseling (BK)',
  'Kepala Laboratorium IT',
  'Operator Dapodik',
  'Guru Pembina OSIS',
];

const INSTRUKSI_OPSI = [
  'Tindak lanjuti segera',
  'Hadiri / Wakilkan',
  'Pelajari dan buat telaahan',
  'Siapkan bahan / laporan jawaban',
  'Koordinasikan dengan pihak terkait',
  'Bicarakan dengan Kepala Sekolah',
  'Simpan / Arsipkan',
];

export const DisposisiModal: React.FC<DisposisiModalProps> = ({
  surat,
  profile,
  isOpen,
  onClose,
  onSave,
  onPrintPreview,
}) => {
  if (!isOpen || !surat) return null;

  const existing = surat.disposisi;
  const [tujuan, setTujuan] = useState<string[]>(existing?.tujuanDisposisi || ['Kasubag Tata Usaha']);
  const [instruksi, setInstruksi] = useState<string[]>(existing?.instruksi || ['Tindak lanjuti segera']);
  const [batasWaktu, setBatasWaktu] = useState<string>(existing?.batasWaktu || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [catatan, setCatatan] = useState<string>(existing?.catatanPimpinan || '');
  const [pemberi, setPemberi] = useState<string>(existing?.pemberiDisposisi || profile.namaKepalaSekolah);

  const toggleTujuan = (item: string) => {
    setTujuan(prev => prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]);
  };

  const toggleInstruksi = (item: string) => {
    setInstruksi(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = () => {
    const disposisiData: DisposisiData = {
      id: existing?.id || `disp-${Date.now()}`,
      tujuanDisposisi: tujuan,
      batasWaktu,
      instruksi,
      catatanPimpinan: catatan,
      tglDisposisi: new Date().toISOString().slice(0, 10),
      pemberiDisposisi: pemberi,
    };

    const updated: SuratMasuk = {
      ...surat,
      statusDisposisi: 'Sudah',
      disposisi: disposisiData,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold">Lembar Disposisi Kepala Sekolah</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Info Surat */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor Agenda:</span>
              <span className="font-mono font-bold text-slate-800">{surat.noAgenda}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor Surat:</span>
              <span className="font-semibold text-slate-800">{surat.noSurat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Asal Instansi:</span>
              <span className="text-slate-800">{surat.asalSurat}</span>
            </div>
            <div className="flex justify-between items-start pt-1 border-t border-slate-200">
              <span className="text-slate-500">Perihal:</span>
              <span className="text-right font-medium text-slate-900 max-w-sm">{surat.perihal}</span>
            </div>
          </div>

          {/* Diteruskan Kepada */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Diteruskan Kepada (Pejabat / Staf Dituju)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PEJABAT_OPSI.map(item => (
                <label
                  key={item}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    tujuan.includes(item)
                      ? 'bg-sky-50 border-sky-300 text-sky-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tujuan.includes(item)}
                    onChange={() => toggleTujuan(item)}
                    className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instruksi Pimpinan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Petunjuk / Instruksi Disposisi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INSTRUKSI_OPSI.map(item => (
                <label
                  key={item}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    instruksi.includes(item)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={instruksi.includes(item)}
                    onChange={() => toggleInstruksi(item)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batas Waktu Penyelesaian
              </label>
              <input
                type="date"
                value={batasWaktu}
                onChange={e => setBatasWaktu(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pemberi Disposisi
              </label>
              <input
                type="text"
                value={pemberi}
                onChange={e => setPemberi(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Khusus Pimpinan
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Instruksi tambahan, arahan rapat, atau tenggat waktu khusus..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onPrintPreview(surat)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Pratinjau Lembar Disposisi</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                Simpan &amp; Teruskan Disposisi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
