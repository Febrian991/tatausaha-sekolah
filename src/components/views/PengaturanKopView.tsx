import React, { useState, useRef } from 'react';
import { SchoolProfile } from '../../types/situ';
import { KopSuratResmi } from '../KopSuratResmi';
import { 
  Settings, 
  Building2, 
  MapPin, 
  UserCheck, 
  Stamp, 
  Upload, 
  Image as ImageIcon,
  Trash2,
  Check, 
  Save, 
  Sparkles,
  FileCheck
} from 'lucide-react';

interface PengaturanKopViewProps {
  profile: SchoolProfile;
  onUpdateProfile: (newProfile: SchoolProfile) => void;
}

export const PengaturanKopView: React.FC<PengaturanKopViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...profile });
  const [savedAlert, setSavedAlert] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoKiriInputRef = useRef<HTMLInputElement>(null);
  const logoKananInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SchoolProfile, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKepalaSekolahChange = (subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      kepalaSekolah: { ...prev.kepalaSekolah, [subField]: value }
    }));
  };

  // Upload Gambar Kop Banner Penuh
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          modeKop: 'GAMBAR_BANNER',
          kopBannerUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Logo Kiri (Pemda / Tut Wuri Handayani)
  const handleLogoKiriUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, logoKiriUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Logo Kanan (Sekolah)
  const handleLogoKananUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, logoKananUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Pengaturan & Upload Kop Surat Resmi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upload gambar kop surat resmi sekolah atau sesuaikan logo ganda dan identitas naskah dinas.
          </p>
        </div>

        {savedAlert && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Berhasil Disimpan & Diterapkan!</span>
          </div>
        )}
      </div>

      {/* Live Preview Kop Surat (Real-time update) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pratinjau Kop Surat Menyesuaikan Hasil Upload (Real-time)</span>
          </span>
          <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
            {formData.modeKop === 'GAMBAR_BANNER' ? 'MODE: GAMBAR KOP PENUH (UPLOAD)' : 'MODE: TEKS RESMI + LOGO GANDA'}
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
          <KopSuratResmi profile={formData} />
        </div>
      </div>

      {/* Mode Pemilihan Kop Surat */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span>Metode / Pilihan Penyesuaian Kop Surat</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opsi 1: Upload Gambar Kop Lengkap */}
          <div
            onClick={() => handleChange('modeKop', 'GAMBAR_BANNER')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.modeKop === 'GAMBAR_BANNER'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  Metode A: Upload Gambar Kop Lengkap (Banner)
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Gunakan gambar kop surat resmi yang sudah siap dari file Word/Scan sekolah Anda (sudah memuat logo & teks).
                </p>
              </div>
              <input
                type="radio"
                name="modeKop"
                checked={formData.modeKop === 'GAMBAR_BANNER'}
                onChange={() => handleChange('modeKop', 'GAMBAR_BANNER')}
                className="mt-1"
              />
            </div>

            {/* Input Upload Banner */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Berkas Kop Surat (JPG/PNG)</span>
                </button>

                {formData.kopBannerUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('kopBannerUrl', '');
                      handleChange('modeKop', 'TEKS_LOGO');
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Gambar</span>
                  </button>
                )}
              </div>

              {formData.kopBannerUrl && (
                <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Gambar Kop Surat Berhasil Diupload & Aktif</span>
                </div>
              )}
            </div>
          </div>

          {/* Opsi 2: Teks Resmi + Upload Logo Kiri & Logo Kanan */}
          <div
            onClick={() => handleChange('modeKop', 'TEKS_LOGO')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.modeKop === 'TEKS_LOGO'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  Metode B: Desain Teks Otomatis + Upload Logo Ganda
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Format teks naskah dinas disusun rapi oleh sistem. Anda dapat mengunggah file Logo Pemda & Logo Sekolah secara terpisah.
                </p>
              </div>
              <input
                type="radio"
                name="modeKop"
                checked={formData.modeKop === 'TEKS_LOGO'}
                onChange={() => handleChange('modeKop', 'TEKS_LOGO')}
                className="mt-1"
              />
            </div>

            {/* Upload Logo Kiri & Kanan */}
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
              {/* Upload Logo Kiri */}
              <div>
                <span className="block text-slate-600 font-semibold mb-1">Logo Kiri (Pemda)</span>
                <input
                  ref={logoKiriInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoKiriUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoKiriInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo</span>
                  </button>
                  {formData.logoKiriUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('logoKiriUrl', '')}
                      className="text-rose-600 hover:underline text-[10px]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Logo Kanan */}
              <div>
                <span className="block text-slate-600 font-semibold mb-1">Logo Kanan (Sekolah)</span>
                <input
                  ref={logoKananInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoKananUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoKananInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo</span>
                  </button>
                  {formData.logoKananUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('logoKananUrl', '')}
                      className="text-rose-600 hover:underline text-[10px]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identitas Satuan Pendidikan & Dinas (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Identitas Instansi Pembina & Sekolah</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Pemerintah Daerah / Provinsi (Baris 1)
              </label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Dinas Pendidikan (Baris 2)
                </label>
                <input
                  type="text"
                  value={formData.dinas}
                  onChange={(e) => handleChange('dinas', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Cabang Dinas / Wilayah (Baris 3)
                </label>
                <input
                  type="text"
                  value={formData.cabangDinas}
                  onChange={(e) => handleChange('cabangDinas', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Nama Lengkap Satuan Pendidikan (Baris 4 - Huruf Tebal Besar)
              </label>
              <input
                type="text"
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => handleChange('npsn', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NSS</label>
                <input
                  type="text"
                  value={formData.nss}
                  onChange={(e) => handleChange('nss', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Akreditasi</label>
                <input
                  type="text"
                  value={formData.akreditasi}
                  onChange={(e) => handleChange('akreditasi', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Alamat Lengkap Sekolah</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.kota}
                  onChange={(e) => handleChange('kota', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => handleChange('kodePos', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Laman Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pos-el (Email Resmi TU)</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pejabat Penandatangan, Titi Mangsa & Stempel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pejabat Penandatangan */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Pejabat Kepala Sekolah Penandatangan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.nama}
                  onChange={(e) => handleKepalaSekolahChange('nama', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NIP (18 Digit)</label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.nip}
                  onChange={(e) => handleKepalaSekolahChange('nip', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pangkat / Golongan Ruang</label>
                <input
                  type="text"
                  value={formData.kepalaSekolah.pangkat}
                  onChange={(e) => handleKepalaSekolahChange('pangkat', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Titi Mangsa Fleksibel & Autentikasi Surat */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <Stamp className="w-4 h-4 text-blue-600" />
              <span>Titi Mangsa Fleksibel & Stempel Basah</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Default Kota Titi Mangsa
                </label>
                <input
                  type="text"
                  value={formData.titiMangsaKota}
                  onChange={(e) => handleChange('titiMangsaKota', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kota ini akan muncul otomatis pada format titi mangsa: [Kota], [Tanggal]
                </p>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gunakanStempel}
                    onChange={(e) => handleChange('gunakanStempel', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bubuhkan Stempel Basah Digital Resmi pada Cetakan Surat</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gunakanTtdDigital}
                    onChange={(e) => handleChange('gunakanTtdDigital', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bubuhkan Tanda Tangan Elektronik Kepala Sekolah</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan Profil</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
