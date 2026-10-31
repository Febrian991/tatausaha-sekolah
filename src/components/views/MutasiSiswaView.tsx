import React, { useState } from 'react';
import { MutasiSiswa, SchoolProfile } from '../../types/situ';
import { 
  Users, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet,
  PlusCircle,
  X
} from 'lucide-react';
import { formatTanggalIndonesia } from '../../utils/mockSituData';

interface MutasiSiswaViewProps {
  profile: SchoolProfile;
  mutasiList: MutasiSiswa[];
  onAddMutasi: (mutasi: MutasiSiswa) => void;
  onCetakSuratPindah: (mutasi: MutasiSiswa) => void;
}

export const MutasiSiswaView: React.FC<MutasiSiswaViewProps> = ({
  profile,
  mutasiList,
  onAddMutasi,
  onCetakSuratPindah
}) => {
  const [filterJenis, setFilterJenis] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for New Mutasi
  const [jenis, setJenis] = useState<'KELUAR' | 'MASUK'>('KELUAR');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nisn, setNisn] = useState('');
  const [nis, setNis] = useState('');
  const [tingkatKelas, setTingkatKelas] = useState('X');
  const [rombel, setRombel] = useState('X-E1');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [tempatLahir, setTempatLahir] = useState('Bandung');
  const [tanggalLahir, setTanggalLahir] = useState('2009-05-10');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('Karyawan Swasta');
  const [sekolahAsalTujuan, setSekolahAsalTujuan] = useState('');
  const [alasanMutasi, setAlasanMutasi] = useState('Mengikuti perpindahan domisili orang tua');

  const filteredList = mutasiList.filter((m) => {
    const matchFilter = filterJenis === 'ALL' || m.jenis === filterJenis;
    const matchSearch =
      m.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nisn.includes(searchQuery) ||
      m.sekolahAsalTujuan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalMasuk = mutasiList.filter((m) => m.jenis === 'MASUK').length;
  const totalKeluar = mutasiList.filter((m) => m.jenis === 'KELUAR').length;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa || !nisn || !sekolahAsalTujuan) return;

    const newRecord: MutasiSiswa = {
      id: `MUT-${Date.now()}`,
      jenis,
      nomorSurat: `421.2/${Math.floor(100 + Math.random() * 900)}/SMAN1-TU/X/2026`,
      tanggalSurat: new Date().toISOString().split('T')[0],
      namaSiswa,
      nisn,
      nis: nis || '242510' + Math.floor(100 + Math.random() * 899),
      tingkatKelas,
      rombel,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      namaOrangTua,
      pekerjaanOrangTua,
      sekolahAsalTujuan,
      alasanMutasi,
      statusDapodik: 'Sinkron Berhasil'
    };

    onAddMutasi(newRecord);
    setIsModalOpen(false);
    // Reset form
    setNamaSiswa('');
    setNisn('');
    setSekolahAsalTujuan('');
  };

  const exportCSV = () => {
    const headers = ['Nomor Surat,Jenis,Nama Siswa,NISN,NIS,Kelas,Rombel,Sekolah Asal/Tujuan,Alasan,Status Dapodik'];
    const rows = mutasiList.map((m) => 
      `"${m.nomorSurat}","${m.jenis}","${m.namaSiswa}","${m.nisn}","${m.nis}","${m.tingkatKelas}","${m.rombel}","${m.sekolahAsalTujuan}","${m.alasanMutasi}","${m.statusDapodik}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Mutasi_Siswa_Dapodik_${profile.namaSekolah.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Buku Register Mutasi Siswa Dapodik</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan mutasi siswa masuk & keluar, cetak otomatis Surat Keterangan Pindah Sekolah, dan validasi data Dapodik Kemendikbud.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV / Rekap</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Data Mutasi</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Total Register Mutasi</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono-data">{mutasiList.length} Siswa</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Mutasi Masuk (Tarik Data)</div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono-data">{totalMasuk} Siswa</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">Mutasi Keluar (Pindah)</div>
            <div className="text-2xl font-extrabold text-amber-700 font-mono-data">{totalKeluar} Siswa</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setFilterJenis('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterJenis === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Mutasi ({mutasiList.length})
          </button>
          <button
            onClick={() => setFilterJenis('MASUK')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterJenis === 'MASUK' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mutasi Masuk ({totalMasuk})
          </button>
          <button
            onClick={() => setFilterJenis('KELUAR')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterJenis === 'KELUAR' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mutasi Keluar ({totalKeluar})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Jenis & No. Surat</th>
                <th className="px-4 py-3">Nama Siswa & NISN</th>
                <th className="px-4 py-3">Kelas / Rombel</th>
                <th className="px-4 py-3">Sekolah Asal / Tujuan</th>
                <th className="px-4 py-3">Status Dapodik</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.jenis === 'MASUK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.jenis === 'MASUK' ? 'MUTASI MASUK' : 'MUTASI KELUAR'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono-data text-slate-900 mt-1 font-medium">
                      {item.nomorSurat}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatTanggalIndonesia(item.tanggalSurat)}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{item.namaSiswa}</div>
                    <div className="text-[11px] text-slate-500 font-mono-data">
                      NISN: {item.nisn} · NIS: {item.nis}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Wali: {item.namaOrangTua} ({item.pekerjaanOrangTua})
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{item.tingkatKelas}</div>
                    <div className="text-[11px] text-slate-500">{item.rombel}</div>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{item.sekolahAsalTujuan}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{item.alasanMutasi}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.statusDapodik}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onCetakSuratPindah(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-xs transition-colors cursor-pointer"
                      title="Cetak Surat Keterangan Pindah Sekolah"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat Pindah</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Data Mutasi Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Form Registrasi Mutasi Siswa Dapodik</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Mutasi</label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as 'KELUAR' | 'MASUK')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="KELUAR">Mutasi Keluar (Pindah ke Sekolah Lain)</option>
                    <option value="MASUK">Mutasi Masuk (Tarik Data dari Sekolah Asal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Kevin Pratama"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NISN (10 Digit Angka)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0081234567"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIS Sekolah</label>
                  <input
                    type="text"
                    placeholder="Contoh: 242510088"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tingkat Kelas</label>
                  <select
                    value={tingkatKelas}
                    onChange={(e) => setTingkatKelas(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Rombel</label>
                  <input
                    type="text"
                    value={rombel}
                    onChange={(e) => setRombel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Nama Ayah / Ibu / Wali"
                    value={namaOrangTua}
                    onChange={(e) => setNamaOrangTua(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pekerjaan Orang Tua</label>
                  <input
                    type="text"
                    value={pekerjaanOrangTua}
                    onChange={(e) => setPekerjaanOrangTua(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {jenis === 'KELUAR' ? 'Sekolah Tujuan Pindah' : 'Sekolah Asal Siswa'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMA Negeri 3 Surabaya / SMA Al-Azhar Jakarta"
                  value={sekolahAsalTujuan}
                  onChange={(e) => setSekolahAsalTujuan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alasan Kepindahan</label>
                <textarea
                  rows={2}
                  value={alasanMutasi}
                  onChange={(e) => setAlasanMutasi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Simpan & Terbitkan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
