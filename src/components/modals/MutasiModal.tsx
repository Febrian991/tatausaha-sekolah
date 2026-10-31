import React, { useState } from 'react';
import { X, Upload, ArrowRightLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { MutasiSiswa, MutasiStatusDapodik, ScanFileInfo } from '../../types';
import { SAMPLE_SCAN_DOCUMENT_IMAGE } from '../../lib/constants';

interface MutasiModalProps {
  mutasi: MutasiSiswa | null;
  defaultJenis?: 'masuk' | 'keluar';
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MutasiSiswa) => void;
}

export const MutasiModal: React.FC<MutasiModalProps> = ({
  mutasi,
  defaultJenis = 'masuk',
  isOpen,
  onClose,
  onSave,
}) => {
  const [jenis, setJenis] = useState<'masuk' | 'keluar'>(mutasi ? mutasi.jenis : defaultJenis);
  const [namaSiswa, setNamaSiswa] = useState(mutasi ? mutasi.namaSiswa : '');
  const [nis, setNis] = useState(mutasi ? mutasi.nis : '');
  const [nisn, setNisn] = useState(mutasi ? mutasi.nisn : '');
  const [jenisKelamin, setJenisKelamin] = useState<MutasiSiswa['jenisKelamin']>(mutasi ? mutasi.jenisKelamin : 'Laki-laki');
  const [kelas, setKelas] = useState(mutasi ? mutasi.kelas : 'X-1');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState(mutasi ? mutasi.tempatTanggalLahir : '');
  const [sekolahAsal, setSekolahAsal] = useState(mutasi ? mutasi.sekolahAsal : '');
  const [sekolahTujuan, setSekolahTujuan] = useState(mutasi ? mutasi.sekolahTujuan : '');
  const [tanggalMutasi, setTanggalMutasi] = useState(mutasi ? mutasi.tanggalMutasi : new Date().toISOString().slice(0, 10));
  const [alasanMutasi, setAlasanMutasi] = useState(mutasi ? mutasi.alasanMutasi : 'Mengikuti kepindahan domisili orang tua');
  const [nomorSuratRekomendasi, setNomorSuratRekomendasi] = useState(mutasi ? mutasi.nomorSuratRekomendasi : `421.3/${Math.floor(100 + Math.random() * 900)}/DISDIK/2026`);
  const [tanggalSuratRekomendasi, setTanggalSuratRekomendasi] = useState(mutasi ? mutasi.tanggalSuratRekomendasi : new Date().toISOString().slice(0, 10));
  const [statusDapodik, setStatusDapodik] = useState<MutasiStatusDapodik>(
    mutasi ? mutasi.statusDapodik : (jenis === 'masuk' ? 'Proses Tarik' : 'Dikeluarkan')
  );
  const [catatanDapodik, setCatatanDapodik] = useState(mutasi ? mutasi.catatanDapodik : '');
  const [scanBerkas, setScanBerkas] = useState<ScanFileInfo | undefined>(mutasi?.scanBerkas);
  const [fileNamePreview, setFileNamePreview] = useState<string>(mutasi?.scanBerkas?.namaFile || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNamePreview(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScanBerkas({
        id: `scan-mut-${Date.now()}`,
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
    if (!namaSiswa || !nisn) return;

    const data: MutasiSiswa = {
      id: mutasi ? mutasi.id : `mut-${Date.now()}`,
      jenis,
      namaSiswa,
      nis,
      nisn,
      jenisKelamin,
      kelas,
      tempatTanggalLahir,
      sekolahAsal,
      sekolahTujuan,
      tanggalMutasi,
      alasanMutasi,
      nomorSuratRekomendasi,
      tanggalSuratRekomendasi,
      statusDapodik,
      catatanDapodik,
      scanBerkas: scanBerkas || (mutasi?.scanBerkas ? mutasi.scanBerkas : undefined),
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold">
              {mutasi ? 'Edit Data Mutasi Siswa' : 'Registrasi Mutasi Siswa (Alur Dapodik)'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Segmented Jenis Mutasi */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setJenis('masuk');
                if (!mutasi) setStatusDapodik('Proses Tarik');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                jenis === 'masuk'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📥 Siswa Masuk (Tarik Data ke Sekolah Ini)
            </button>
            <button
              type="button"
              onClick={() => {
                setJenis('keluar');
                if (!mutasi) setStatusDapodik('Dikeluarkan');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                jenis === 'keluar'
                  ? 'bg-white text-rose-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📤 Siswa Keluar (Mutasi ke Sekolah Lain)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                value={namaSiswa}
                onChange={e => setNamaSiswa(e.target.value)}
                placeholder="Sesuai Akta Kelahiran / Ijazah"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jenis Kelamin
              </label>
              <select
                value={jenisKelamin}
                onChange={e => setJenisKelamin(e.target.value as MutasiSiswa['jenisKelamin'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                NISN (10 Digit)
              </label>
              <input
                type="text"
                value={nisn}
                onChange={e => setNisn(e.target.value)}
                placeholder="Contoh: 0078129034"
                maxLength={10}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                NIS / Buku Induk
              </label>
              <input
                type="text"
                value={nis}
                onChange={e => setNis(e.target.value)}
                placeholder="Nomor Induk Siswa"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kelas / Rombongan Belajar
              </label>
              <input
                type="text"
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                placeholder="Contoh: XI MIPA 2"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tempat, Tanggal Lahir
            </label>
            <input
              type="text"
              value={tempatTanggalLahir}
              onChange={e => setTempatTanggalLahir(e.target.value)}
              placeholder="Contoh: Bandung, 14 Mei 2008"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {jenis === 'masuk' ? 'Sekolah Asal' : 'Sekolah Asal (Sekolah Ini)'}
              </label>
              <input
                type="text"
                value={sekolahAsal}
                onChange={e => setSekolahAsal(e.target.value)}
                placeholder={jenis === 'masuk' ? 'Nama sekolah asal siswa' : 'SMA Negeri 1 Teladan Nusantara'}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {jenis === 'masuk' ? 'Sekolah Tujuan (Sekolah Ini)' : 'Sekolah Tujuan'}
              </label>
              <input
                type="text"
                value={sekolahTujuan}
                onChange={e => setSekolahTujuan(e.target.value)}
                placeholder={jenis === 'masuk' ? 'SMA Negeri 1 Teladan Nusantara' : 'Nama sekolah tujuan baru'}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Efektif Mutasi
              </label>
              <input
                type="date"
                value={tanggalMutasi}
                onChange={e => setTanggalMutasi(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alasan Kepindahan / Mutasi
              </label>
              <input
                type="text"
                value={alasanMutasi}
                onChange={e => setAlasanMutasi(e.target.value)}
                placeholder="Ikut orang tua / domisili / peminatan"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Bagian Integrasi Dapodik */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Alur Integrasi Operator Dapodik</span>
              </div>
              <span className="text-[11px] font-medium text-amber-700">sp.datadik.kemdikbud.go.id</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Sinkronisasi Dapodik
                </label>
                <select
                  value={statusDapodik}
                  onChange={e => setStatusDapodik(e.target.value as MutasiStatusDapodik)}
                  className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="Belum Sinkron">Belum Sinkron</option>
                  <option value="Proses Tarik">Proses Tarik (sp.datadik)</option>
                  <option value="Validasi Cabdis">Menunggu Validasi Cabang Dinas</option>
                  <option value="Sudah Sinkron">Sudah Sinkron &amp; Terdaftar Rombel</option>
                  <option value="Dikeluarkan">Dikeluarkan / Dinonaktifkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Surat Rekomendasi Mutasi
                </label>
                <input
                  type="text"
                  value={nomorSuratRekomendasi}
                  onChange={e => setNomorSuratRekomendasi(e.target.value)}
                  placeholder="Nomor surat dari sekolah/Dinas"
                  className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Operator Dapodik
              </label>
              <input
                type="text"
                value={catatanDapodik}
                onChange={e => setCatatanDapodik(e.target.value)}
                placeholder="Contoh: Berkas rekomendasi lengkap. Menunggu persetujuan Dinas tujuan..."
                className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Upload Scan Fisik Surat Rekomendasi/Mutasi */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Unggah Scan Surat Rekomendasi / Mutasi Fisik
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan fisik berkas mutasi dari sekolah asal/tujuan dan dinas pendidikan terkait.
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas Scan</span>
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
              {mutasi ? 'Simpan Perubahan' : 'Simpan Data Mutasi Siswa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
