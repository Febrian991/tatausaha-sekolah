import React, { useState } from 'react';
import { Building2, X, CheckCircle, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { defaultSchoolProfile } from '../data/initialData.ts';

export const SchoolSettingsModal: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, isSettingsOpen, setIsSettingsOpen } = useApp();
  const [formData, setFormData] = useState({ ...schoolProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan identitas dan kop surat ke setelan standar?')) {
      setFormData(defaultSchoolProfile);
      updateSchoolProfile(defaultSchoolProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Pengaturan Identitas & Kop Surat Sekolah</h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-lg text-slate-700 leading-relaxed">
            Data pada form ini akan otomatis dicetak pada bagian kepala dokumen (Kop Surat Resmi), kuitansi pembayaran SPP, surat keterangan aktif siswa, serta surat perintah tugas.
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nama Satuan Pendidikan (Sekolah)*</label>
            <input
              type="text"
              required
              value={formData.namaSekolah}
              onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-bold text-slate-900 uppercase"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Instansi Pembina / Dinas Pendidikan (Kop Atas)</label>
            <textarea
              rows={2}
              value={formData.dinasPendidikan}
              onChange={(e) => setFormData({ ...formData, dinasPendidikan: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded uppercase font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">NSS</label>
              <input
                type="text"
                value={formData.nss}
                onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Status Akreditasi</label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Alamat Lengkap Sekolah</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Kecamatan</label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.kotaKabupaten}
                onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Provinsi</label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Telepon Kantor TU</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Resmi Sekolah</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Website Resmi</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-bold text-slate-900 mb-2">Pimpinan & Penandatangan Resmi</h4>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Kepala Sekolah & Gelar*</label>
                <input
                  type="text"
                  required
                  value={formData.kepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Kepala Tata Usaha (KTU)*</label>
                <input
                  type="text"
                  required
                  value={formData.kepalaTU}
                  onChange={(e) => setFormData({ ...formData, kepalaTU: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">NIP Kepala Tata Usaha</label>
                <input
                  type="text"
                  value={formData.nipKepalaTU}
                  onChange={(e) => setFormData({ ...formData, nipKepalaTU: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Bendahara Sekolah*</label>
                <input
                  type="text"
                  required
                  value={formData.bendahara}
                  onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">NIP Bendahara</label>
                <input
                  type="text"
                  value={formData.nipBendahara}
                  onChange={(e) => setFormData({ ...formData, nipBendahara: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
              >
                Simpan Perubahan Kop
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
