import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { SchoolProfile, TitiMangsaPosition } from '../../types';
import { KopSurat } from '../surat/KopSurat';

interface SettingsViewProps {
  profile: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (field: keyof SchoolProfile, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSuccessMsg('Profil satuan pendidikan & konfigurasi kop berhasil disimpan!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = onImportBackup(reader.result as string);
      if (success) {
        setSuccessMsg('Data cadangan berhasil dipulihkan!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        alert('Format file cadangan JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Pengaturan Identitas Sekolah &amp; Kop Kedinasan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi nama dinas, nomor pokok sekolah nasional (NPSN), pejabat penandatangan, dan posisi titi mangsa.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Live Kop Preview Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pratinjau Langsung Kop Kedinasan Resmi
          </span>
          <span className="text-[11px] text-slate-500">Logo Ganda &amp; Garis Batas Ganda</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto">
          <div className="min-w-[650px] bg-white p-6 shadow-xs border border-slate-200">
            <KopSurat
              profile={formData}
              nomorSurat="421.3/001/SMAN.1/XI/2026"
              perihal="Contoh Penataan Titi Mangsa & Kop Kedinasan"
              tujuanPenerima="Kepala Dinas Pendidikan"
            />
          </div>
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
          A. Struktur Hierarki Dinas &amp; Nama Satuan Pendidikan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pemerintah Daerah (Baris 1)</label>
            <input
              type="text"
              value={formData.namaPemda}
              onChange={e => handleChange('namaPemda', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dinas Pendidikan (Baris 2)</label>
            <input
              type="text"
              value={formData.namaDinas}
              onChange={e => handleChange('namaDinas', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cabang Dinas / Wilayah (Baris 3)</label>
            <input
              type="text"
              value={formData.cabangDinas}
              onChange={e => handleChange('cabangDinas', e.target.value)}
              placeholder="Kosongkan jika SD/SMP naungan Pemkab/Pemkot"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Resmi Sekolah (Baris 4 - Besar)</label>
            <input
              type="text"
              value={formData.namaSekolah}
              onChange={e => handleChange('namaSekolah', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN</label>
            <input
              type="text"
              value={formData.npsn}
              onChange={e => handleChange('npsn', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">NSS</label>
            <input
              type="text"
              value={formData.nss}
              onChange={e => handleChange('nss', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi</label>
            <input
              type="text"
              value={formData.akreditasi}
              onChange={e => handleChange('akreditasi', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Jalan</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={e => handleChange('alamat', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
            <input
              type="text"
              value={formData.kotaKabupaten}
              onChange={e => handleChange('kotaKabupaten', e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Provinsi</label>
            <input
              type="text"
              value={formData.provinsi}
              onChange={e => handleChange('provinsi', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Pos</label>
            <input
              type="text"
              value={formData.kodePos}
              onChange={e => handleChange('kodePos', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon / Fax</label>
            <input
              type="text"
              value={formData.telepon}
              onChange={e => handleChange('telepon', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pos-el / Email Resmi</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Titi Mangsa Setting */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2">
            B. Posisi Standar Titi Mangsa (Tempat &amp; Tanggal Surat)
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Sesuai pembaruan tata naskah dinas, posisi titi mangsa kini terpisah dari kop dan dapat diatur:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                formData.titiMangsaPosition === 'header_right'
                  ? 'bg-sky-50 border-sky-300 text-sky-950 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="titiMangsaPosition"
                checked={formData.titiMangsaPosition === 'header_right'}
                onChange={() => handleChange('titiMangsaPosition', 'header_right')}
                className="mt-0.5 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="font-bold block">1. Bagian Kanan Atas (Sejajar Nomor Surat)</span>
                <span className="text-[11px] text-slate-500">
                  Tempat &amp; tanggal dicetak di sisi kanan atas tepat di bawah garis ganda kop, sejajar kolom Nomor/Hal.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                formData.titiMangsaPosition === 'above_signature'
                  ? 'bg-sky-50 border-sky-300 text-sky-950 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="titiMangsaPosition"
                checked={formData.titiMangsaPosition === 'above_signature'}
                onChange={() => handleChange('titiMangsaPosition', 'above_signature')}
                className="mt-0.5 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="font-bold block">2. Di Atas Tanda Tangan Pejabat</span>
                <span className="text-[11px] text-slate-500">
                  Tempat &amp; tanggal dicetak tepat di atas teks penandatangan (contoh: "Bandung, 30 Oktober 2026 / Kepala Sekolah").
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Pejabat Penandatangan */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            C. Pejabat Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.namaKepalaSekolah}
                onChange={e => handleChange('namaKepalaSekolah', e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={e => handleChange('nipKepalaSekolah', e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan Ruang</label>
              <input
                type="text"
                value={formData.pangkatKepalaSekolah}
                onChange={e => handleChange('pangkatKepalaSekolah', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kasubag Tata Usaha</label>
              <input
                type="text"
                value={formData.namaKasubagTU}
                onChange={e => handleChange('namaKasubagTU', e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kasubag TU</label>
              <input
                type="text"
                value={formData.nipKasubagTU}
                onChange={e => handleChange('nipKasubagTU', e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan TU</label>
              <input
                type="text"
                value={formData.pangkatKasubagTU}
                onChange={e => handleChange('pangkatKasubagTU', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Sekolah</span>
          </button>
        </div>
      </form>

      {/* Backup and Restore Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
          D. Pemeliharaan Data &amp; Cadangan Arsip (JSON)
        </h3>
        <p className="text-xs text-slate-500">
          Ekspor semua data agenda surat, mutasi siswa, berkas scan, dan profil ke format JSON untuk backup lokal komputer Anda.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportBackup}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Lengkap (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-300">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Pulihkan Cadangan (Restore JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menyetel ulang data ke data standar contoh?')) {
                onResetDefaults();
                setSuccessMsg('Data telah disetel ulang ke contoh standar!');
                setTimeout(() => setSuccessMsg(null), 3000);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Contoh Standar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
