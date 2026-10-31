import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Download,
  Filter,
  CheckCircle,
  FileText,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Student } from '../types/index.ts';

export const StudentsView: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, openPrintModal, globalSearchQuery } = useApp();

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nisn: '',
    nis: '',
    nama: '',
    jenisKelamin: 'L' as 'L' | 'P',
    tempatLahir: '',
    tanggalLahir: '',
    kelas: 'X RPL 1',
    jurusan: 'Rekayasa Perangkat Lunak',
    namaWali: '',
    pekerjaanWali: '',
    kontakWali: '',
    alamat: '',
    tahunMasuk: '2025',
    status: 'Aktif' as 'Aktif' | 'Lulus' | 'Mutasi Keluar' | 'Cuti',
    catatanKhusus: '',
  });

  const activeSearch = globalSearchQuery || search;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.nisn.includes(activeSearch) ||
      s.nis.includes(activeSearch) ||
      s.namaWali.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.kelas === selectedClass;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const availableClasses = Array.from(new Set(students.map((s) => s.kelas))).sort();

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nis: `2425${Math.floor(1000 + Math.random() * 9000)}`,
      nama: '',
      jenisKelamin: 'L',
      tempatLahir: 'Bandung',
      tanggalLahir: '2008-01-01',
      kelas: 'X RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak',
      namaWali: '',
      pekerjaanWali: '',
      kontakWali: '',
      alamat: '',
      tahunMasuk: '2025',
      status: 'Aktif',
      catatanKhusus: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      nama: student.nama,
      jenisKelamin: student.jenisKelamin,
      tempatLahir: student.tempatLahir,
      tanggalLahir: student.tanggalLahir,
      kelas: student.kelas,
      jurusan: student.jurusan,
      namaWali: student.namaWali,
      pekerjaanWali: student.pekerjaanWali,
      kontakWali: student.kontakWali,
      alamat: student.alamat,
      tahunMasuk: student.tahunMasuk,
      status: student.status,
      catatanKhusus: student.catatanKhusus || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID,NISN,NIS,Nama Lengkap,Jenis Kelamin,Kelas,Jurusan,Nama Wali,Kontak Wali,Status'];
    const rows = filteredStudents.map(
      (s) =>
        `"${s.id}","${s.nisn}","${s.nis}","${s.nama}","${s.jenisKelamin}","${s.kelas}","${s.jurusan}","${s.namaWali}","${s.kontakWali}","${s.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Induk_Siswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Action Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NISN, wali..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Semua Kelas</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Lulus">Lulus</option>
            <option value="Mutasi Keluar">Mutasi Keluar</option>
            <option value="Cuti">Cuti</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredStudents.length}</span> dari{' '}
            <span className="font-semibold text-slate-800">{students.length}</span> total peserta didik terdaftar
          </div>
          <div className="text-[11px] text-slate-400">
            Klik tombol cetak untuk menerbitkan Surat Keterangan Aktif resmi
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">NISN / NIS</th>
                <th className="py-2.5 px-4 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-4 font-semibold">Kelas & Jurusan</th>
                <th className="py-2.5 px-4 font-semibold">Orang Tua / Wali</th>
                <th className="py-2.5 px-4 font-semibold">Kontak Wali</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi Tata Usaha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data siswa dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{student.nisn}</div>
                      <div className="text-slate-400">{student.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{student.nama}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({student.jenisKelamin})</span>
                      </div>
                      {student.catatanKhusus && (
                        <p className="text-[10px] text-blue-600 font-normal mt-0.5">{student.catatanKhusus}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium">{student.kelas}</div>
                      <div className="text-[11px] text-slate-500">{student.jurusan}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{student.namaWali}</div>
                      <div className="text-[11px] text-slate-400">{student.pekerjaanWali || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {student.kontakWali}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          student.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.status === 'Lulus'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : student.status === 'Mutasi Keluar'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            openPrintModal({
                              type: 'surat-keterangan-aktif',
                              title: `Surat Keterangan Aktif - ${student.nama}`,
                              data: student,
                            })
                          }
                          className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                          title="Cetak Surat Keterangan Siswa Aktif"
                        >
                          <Printer className="w-3.5 h-3.5 inline mr-1" />
                          <span>Surat Aktif</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Edit Biodata Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus data siswa ${student.nama}?`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {editingStudent ? 'Edit Biodata Buku Induk Siswa' : 'Tambah Peserta Didik Baru (Buku Induk)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NISN (10 Digit)*</label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NIS Lokal Sekolah*</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Lengkap Siswa*</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Ahmad Rifqi Pratama"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kelas</label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    placeholder="XI RPL 1"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jurusan / Kompetensi Keahlian</label>
                  <input
                    type="text"
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    placeholder="Rekayasa Perangkat Lunak"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nomor Telepon / WhatsApp Wali</label>
                  <input
                    type="text"
                    value={formData.kontakWali}
                    onChange={(e) => setFormData({ ...formData, kontakWali: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Sukajadi No. 128, RT 02 / RW 05"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status Keaktifan</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Aktif' | 'Lulus' | 'Mutasi Keluar' | 'Cuti',
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Mutasi Keluar">Mutasi Keluar</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Catatan Tambahan / Beasiswa</label>
                  <input
                    type="text"
                    value={formData.catatanKhusus}
                    onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                    placeholder="Penerima PIP / KIP"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
