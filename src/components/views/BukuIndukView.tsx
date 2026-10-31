import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Printer, 
  Edit3, 
  Trash2, 
  UserCheck, 
  GraduationCap,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { SiswaBukuInduk, SchoolProfile, UserSession } from '../../types';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';

interface BukuIndukViewProps {
  user: UserSession;
  profile: SchoolProfile;
  bukuIndukList: SiswaBukuInduk[];
  onAddSiswa: (siswa: SiswaBukuInduk) => void;
  onEditSiswa: (siswa: SiswaBukuInduk) => void;
  onDeleteSiswa: (id: string) => void;
}

export const BukuIndukView: React.FC<BukuIndukViewProps> = ({
  user,
  profile,
  bukuIndukList,
  onAddSiswa,
  onEditSiswa,
  onDeleteSiswa,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<SiswaBukuInduk | null>(null);
  const [printPreviewSiswa, setPrintPreviewSiswa] = useState<SiswaBukuInduk | null>(null);

  // Form State
  const [nis, setNis] = useState('');
  const [nisn, setNisn] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [kelas, setKelas] = useState('X-1');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('2009-01-01');
  const [agama, setAgama] = useState('Islam');
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [pekerjaanOrtu, setPekerjaanOrtu] = useState('Karyawan Swasta');
  const [alamatSiswa, setAlamatSiswa] = useState('');
  const [telepon, setTelepon] = useState('');
  const [statusSiswa, setStatusSiswa] = useState<SiswaBukuInduk['statusSiswa']>('Aktif');
  const [sekolahAsal, setSekolahAsal] = useState('');

  const openAddModal = () => {
    setEditingSiswa(null);
    setNis(`${Math.floor(24251000 + Math.random() * 900)}`);
    setNisn(`00${Math.floor(70000000 + Math.random() * 20000000)}`);
    setNamaLengkap('');
    setJenisKelamin('Laki-laki');
    setKelas('X-1');
    setTempatLahir('Bandung');
    setTanggalLahir('2009-05-10');
    setAgama('Islam');
    setNamaAyah('');
    setNamaIbu('');
    setPekerjaanOrtu('Wiraswasta');
    setAlamatSiswa('');
    setTelepon('');
    setStatusSiswa('Aktif');
    setSekolahAsal('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: SiswaBukuInduk) => {
    setEditingSiswa(s);
    setNis(s.nis);
    setNisn(s.nisn);
    setNamaLengkap(s.namaLengkap);
    setJenisKelamin(s.jenisKelamin);
    setKelas(s.kelas);
    setTempatLahir(s.tempatLahir);
    setTanggalLahir(s.tanggalLahir);
    setAgama(s.agama);
    setNamaAyah(s.namaAyah);
    setNamaIbu(s.namaIbu);
    setPekerjaanOrtu(s.pekerjaanOrtu);
    setAlamatSiswa(s.alamatSiswa);
    setTelepon(s.telepon);
    setStatusSiswa(s.statusSiswa);
    setSekolahAsal(s.sekolahAsal || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !nis || !nisn) return;

    const data: SiswaBukuInduk = {
      id: editingSiswa ? editingSiswa.id : `sis-${Date.now()}`,
      nis,
      nisn,
      namaLengkap,
      jenisKelamin,
      kelas,
      tempatLahir,
      tanggalLahir,
      agama,
      namaAyah,
      namaIbu,
      pekerjaanOrtu,
      alamatSiswa,
      telepon,
      statusSiswa,
      sekolahAsal,
    };

    if (editingSiswa) {
      onEditSiswa(data);
    } else {
      onAddSiswa(data);
    }
    setIsModalOpen(false);
  };

  const filteredList = bukuIndukList.filter(s => {
    const matchQuery = 
      s.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      s.nisn.includes(searchQuery) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = filterKelas === 'all' || s.kelas === filterKelas;
    const matchStatus = filterStatus === 'all' || s.statusSiswa === filterStatus;
    return matchQuery && matchKelas && matchStatus;
  });

  const getStatusBadge = (st: SiswaBukuInduk['statusSiswa']) => {
    switch (st) {
      case 'Aktif':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Mutasi Masuk':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Mutasi Keluar':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Lulus':
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Buku Induk Register Siswa &amp; Rekapitulasi Pokok
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan identitas pokok peserta didik, nomor induk siswa, biodata orang tua, dan riwayat mutasi sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrasi Siswa Baru</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Buku Induk</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa / NIS / NISN..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          <select
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
          >
            <option value="all">Semua Kelas</option>
            <option value="X-1">Kelas X-1</option>
            <option value="X-4">Kelas X-4</option>
            <option value="XI MIPA 2">Kelas XI MIPA 2</option>
            <option value="XII IPS 1">Kelas XII IPS 1</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
          >
            <option value="all">Semua Status Siswa</option>
            <option value="Aktif">Status Aktif</option>
            <option value="Mutasi Masuk">Mutasi Masuk</option>
            <option value="Mutasi Keluar">Mutasi Keluar</option>
            <option value="Lulus">Lulus Alumni</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Terdaftar: <strong className="text-slate-900">{filteredList.length}</strong> siswa
        </div>
      </div>

      {/* Student Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Tempat, Tgl Lahir</th>
                <th className="py-3 px-4">Nama Orang Tua</th>
                <th className="py-3 px-4">Alamat Domisili</th>
                <th className="py-3 px-4">Status Siswa</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                    <div>{s.nis}</div>
                    <div className="text-[10px] text-slate-400 font-normal">NISN: {s.nisn}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {s.namaLengkap}
                    {s.sekolahAsal && (
                      <div className="text-[10px] text-slate-400 font-normal">Asal: {s.sekolahAsal}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {s.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {s.kelas}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {s.tempatLahir}, {s.tanggalLahir}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{s.namaAyah} / {s.namaIbu}</div>
                    <div className="text-[10px] text-slate-400">{s.pekerjaanOrtu}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {s.alamatSiswa}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(s.statusSiswa)}`}>
                      {s.statusSiswa}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setPrintPreviewSiswa(s)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        title="Cetak Lembar Induk"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        title="Edit Biodata"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data ${s.namaLengkap} dari buku induk?`)) {
                            onDeleteSiswa(s.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: INPUT / EDIT SISWA BUKU INDUK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in my-6">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">
                  {editingSiswa ? 'Edit Biodata Siswa Buku Induk' : 'Tambah Siswa Baru ke Buku Induk'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Induk Siswa (NIS)</label>
                  <input
                    type="text"
                    value={nis}
                    onChange={e => setNis(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN (Nomor Induk Siswa Nasional)</label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={e => setNisn(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Peserta Didik</label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={e => setNamaLengkap(e.target.value)}
                  required
                  placeholder="Nama sesuai akta kelahiran/ijazah SMP..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={e => setJenisKelamin(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
                  <input
                    type="text"
                    value={kelas}
                    onChange={e => setKelas(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Keberadaan</label>
                  <select
                    value={statusSiswa}
                    onChange={e => setStatusSiswa(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="Aktif">Aktif Belajar</option>
                    <option value="Mutasi Masuk">Mutasi Masuk</option>
                    <option value="Mutasi Keluar">Mutasi Keluar</option>
                    <option value="Lulus">Lulus Alumni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={e => setTempatLahir(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={e => setTanggalLahir(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ayah Kandung</label>
                  <input
                    type="text"
                    value={namaAyah}
                    onChange={e => setNamaAyah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={namaIbu}
                    onChange={e => setNamaIbu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Orang Tua</label>
                  <input
                    type="text"
                    value={pekerjaanOrtu}
                    onChange={e => setPekerjaanOrtu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Siswa</label>
                <textarea
                  value={alamatSiswa}
                  onChange={e => setAlamatSiswa(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={e => setTelepon(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sekolah Asal (SMP / SMA Asal)</label>
                  <input
                    type="text"
                    value={sekolahAsal}
                    onChange={e => setSekolahAsal(e.target.value)}
                    placeholder="Contoh: SMPN 2 Bandung"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Buku Induk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK LEMBAR BUKU INDUK SISWA */}
      {printPreviewSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in my-6">
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
              <span className="font-bold text-xs uppercase tracking-wider">
                Pratinjau Lembar Buku Induk Siswa Resmi
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setPrintPreviewSiswa(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Student Register Sheet */}
            <div className="p-8 bg-white border-8 border-slate-100 text-slate-900 font-sans print:border-0 print:p-0">
              <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TutWuriHandayaniLogo className="w-12 h-12" />
                  <div>
                    <h3 className="font-bold text-sm uppercase">{profile.namaSekolah}</h3>
                    <p className="text-[10px] text-slate-600">LEMBAR BUKU INDUK REGISTER PESERTA DIDIK</p>
                    <p className="text-[10px] text-slate-500">NPSN: {profile.npsn} · Akreditasi: {profile.akreditasi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-900">NIS: {printPreviewSiswa.nis}</span>
                  <p className="text-[10px] font-mono text-slate-500">NISN: {printPreviewSiswa.nisn}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">1. Nama Lengkap Siswa</span>
                  <span className="col-span-2 font-bold text-slate-900 uppercase">{printPreviewSiswa.namaLengkap}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">2. Jenis Kelamin</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.jenisKelamin}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">3. Tempat, Tanggal Lahir</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.tempatLahir}, {printPreviewSiswa.tanggalLahir}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">4. Rombel / Kelas Aktif</span>
                  <span className="col-span-2 font-semibold text-slate-800">{printPreviewSiswa.kelas}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">5. Status Siswa</span>
                  <span className="col-span-2 font-bold text-slate-900">{printPreviewSiswa.statusSiswa}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">6. Sekolah Asal</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.sekolahAsal || '-'}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">7. Nama Orang Tua / Wali</span>
                  <span className="col-span-2 text-slate-800">Ayah: {printPreviewSiswa.namaAyah} | Ibu: {printPreviewSiswa.namaIbu}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">8. Pekerjaan Orang Tua</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.pekerjaanOrtu}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">9. Alamat Tempat Tinggal</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.alamatSiswa}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">10. No. Telepon / HP</span>
                  <span className="col-span-2 text-slate-800">{printPreviewSiswa.telepon || '-'}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <div className="text-[10px] text-slate-400">
                  Arsip Buku Induk Tata Usaha Sekolah · Terdaftar dalam Dapodik Kemdikbud
                </div>
                <div className="text-center w-52">
                  <p className="text-slate-600 mb-1">{profile.kotaKabupaten}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold text-slate-800 mb-12">Kepala Subbagian Tata Usaha,</p>
                  <p className="font-bold text-slate-900 underline">{profile.namaKasubagTU}</p>
                  <p className="text-[10px] text-slate-500">NIP. {profile.nipKasubagTU}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
