import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  X,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Staff } from '../types/index.ts';

export const StaffView: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, openPrintModal, globalSearchQuery } = useApp();

  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nip: '',
    nuptk: '',
    nama: '',
    gelarDepan: '',
    gelarBelakang: '',
    jenisKelamin: 'L' as 'L' | 'P',
    unitKerja: 'Tenaga Pendidik (Guru)' as 'Tenaga Pendidik (Guru)' | 'Tenaga Kependidikan (TU)',
    jabatan: '',
    golongan: 'III/a',
    statusKepegawaian: 'PNS' as 'PNS' | 'PPPK' | 'GTT (Honorer Guru)' | 'PTT (Honorer TU)',
    mataPelajaran: '',
    pendidikanTerakhir: 'S1',
    telepon: '',
    email: '',
    statusAktif: true,
  });

  const activeSearch = globalSearchQuery || search;

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.nama.toLowerCase().includes(activeSearch.toLowerCase()) ||
      member.nip.includes(activeSearch) ||
      member.nuptk.includes(activeSearch) ||
      member.jabatan.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesUnit = selectedUnit === 'ALL' || member.unitKerja === selectedUnit;
    const matchesStatus = selectedStatus === 'ALL' || member.statusKepegawaian === selectedStatus;
    return matchesSearch && matchesUnit && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      nip: `198${Math.floor(10000 + Math.random() * 89999)} 201${Math.floor(100 + Math.random() * 899)} 1 001`,
      nuptk: `${Math.floor(1000000000000000 + Math.random() * 8999999999999999)}`,
      nama: '',
      gelarDepan: '',
      gelarBelakang: '',
      jenisKelamin: 'L',
      unitKerja: 'Tenaga Pendidik (Guru)',
      jabatan: 'Guru Mata Pelajaran',
      golongan: 'III/a',
      statusKepegawaian: 'PNS',
      mataPelajaran: '',
      pendidikanTerakhir: 'S1 Pendidikan',
      telepon: '0812-xxxx-xxxx',
      email: '',
      statusAktif: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData({
      nip: member.nip,
      nuptk: member.nuptk,
      nama: member.nama,
      gelarDepan: member.gelarDepan || '',
      gelarBelakang: member.gelarBelakang || '',
      jenisKelamin: member.jenisKelamin,
      unitKerja: member.unitKerja as any,
      jabatan: member.jabatan,
      golongan: member.golongan,
      statusKepegawaian: member.statusKepegawaian,
      mataPelajaran: member.mataPelajaran || '',
      pendidikanTerakhir: member.pendidikanTerakhir,
      telepon: member.telepon,
      email: member.email,
      statusAktif: member.statusAktif,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru, staf TU, NIP..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Semua Unit Kerja</option>
            <option value="Tenaga Pendidik (Guru)">Tenaga Pendidik (Guru)</option>
            <option value="Tenaga Kependidikan (TU)">Tenaga Kependidikan (TU)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">Semua Status Kepegawaian</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="GTT (Honorer Guru)">GTT (Honorer Guru)</option>
            <option value="PTT (Honorer TU)">PTT (Honorer TU)</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Pegawai / Guru</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredStaff.length}</span> pegawai / tenaga pendidik
          </div>
          <div className="text-[11px] text-slate-400">
            Dapat langsung menerbitkan Surat Perintah Tugas Dinas resmi
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Nama & NIP / NUPTK</th>
                <th className="py-2.5 px-4 font-semibold">Jabatan & Tugas</th>
                <th className="py-2.5 px-4 font-semibold">Unit Kerja</th>
                <th className="py-2.5 px-4 font-semibold">Status & Golongan</th>
                <th className="py-2.5 px-4 font-semibold">Kontak</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi Kedinasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{member.nama}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      NIP: {member.nip || '-'}
                    </div>
                    {member.nuptk && (
                      <div className="font-mono text-[10px] text-slate-400">
                        NUPTK: {member.nuptk}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium text-slate-900">{member.jabatan}</div>
                    {member.mataPelajaran && (
                      <div className="text-[11px] text-blue-600">Mapel: {member.mataPelajaran}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="text-[11px] font-medium">{member.unitKerja}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          member.statusKepegawaian === 'PNS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : member.statusKepegawaian === 'PPPK'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {member.statusKepegawaian}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">({member.golongan})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    <div>{member.telepon}</div>
                    <div className="text-slate-400 text-[10px] lowercase">{member.email}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          openPrintModal({
                            type: 'surat-tugas',
                            title: `Surat Tugas Dinas - ${member.nama}`,
                            data: {
                              ...member,
                              tugasDetail: `Melaksanakan koordinasi pembinaan pembelajaran dan administrasi operasional sekolah pada program kerja semester ganjil.`,
                            },
                          })
                        }
                        className="px-2 py-1 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded transition-colors"
                        title="Cetak Surat Perintah Tugas Dinas"
                      >
                        <Printer className="w-3.5 h-3.5 inline mr-1" />
                        <span>Surat Tugas</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Edit Data Pegawai"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus data kepegawaian ${member.nama}?`)) {
                            deleteStaff(member.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Hapus Pegawai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {editingStaff ? 'Edit Data Pendidik / Tenaga Kependidikan' : 'Tambah Pegawai Baru (PTK)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Lengkap & Gelar*</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Drs. H. Eko Prasetyo, M.Pd."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19850120 200902 1 003 atau '-'"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={formData.nuptk}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit Kerja</label>
                  <select
                    value={formData.unitKerja}
                    onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Tenaga Pendidik (Guru)">Tenaga Pendidik (Guru)</option>
                    <option value="Tenaga Kependidikan (TU)">Tenaga Kependidikan (TU)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (Pegawai Pemerintah dg Perjanjian Kerja)</option>
                    <option value="GTT (Honorer Guru)">GTT (Guru Tidak Tetap)</option>
                    <option value="PTT (Honorer TU)">PTT (Pegawai Tidak Tetap / TU)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jabatan Kedinasan</label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Wakasek / Guru Mapel / Staf Keuangan"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={formData.golongan}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value })}
                    placeholder="III/c atau IX (PPPK)"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Mata Pelajaran yang Diampu (Jika Guru)</label>
                <input
                  type="text"
                  value={formData.mataPelajaran}
                  onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                  placeholder="Misal: Pemrograman Web & Perangkat Bergerak"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nomor Telepon / WA</label>
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
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Simpan Data Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
