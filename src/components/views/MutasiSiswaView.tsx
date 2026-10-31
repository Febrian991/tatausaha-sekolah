import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  Plus, 
  Eye, 
  Printer, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  RefreshCw, 
  UserCheck 
} from 'lucide-react';
import { MutasiSiswa, ScanFileInfo } from '../../types';

interface MutasiSiswaViewProps {
  mutasiList: MutasiSiswa[];
  onAddMutasi: (jenis: 'masuk' | 'keluar') => void;
  onEditMutasi: (mutasi: MutasiSiswa) => void;
  onDeleteMutasi: (id: string) => void;
  onOpenLightbox: (file: ScanFileInfo) => void;
  onPrintMutasi: (mutasi: MutasiSiswa) => void;
  onUpdateStatusDapodik: (id: string, newStatus: MutasiSiswa['statusDapodik']) => void;
}

export const MutasiSiswaView: React.FC<MutasiSiswaViewProps> = ({
  mutasiList,
  onAddMutasi,
  onEditMutasi,
  onDeleteMutasi,
  onOpenLightbox,
  onPrintMutasi,
  onUpdateStatusDapodik,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'masuk' | 'keluar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDapodik, setFilterDapodik] = useState<string>('all');

  const filteredList = mutasiList.filter(item => {
    const matchTab = activeTab === 'all' || item.jenis === activeTab;
    const matchQuery = 
      item.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nisn.includes(searchQuery) ||
      item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sekolahAsal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sekolahTujuan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDapodik = filterDapodik === 'all' || item.statusDapodik === filterDapodik;

    return matchTab && matchQuery && matchDapodik;
  });

  const getDapodikBadge = (status: MutasiSiswa['statusDapodik']) => {
    switch (status) {
      case 'Sudah Sinkron':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Proses Tarik':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Dikeluarkan':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Validasi Cabdis':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Modul Mutasi Siswa &amp; Alur Operator Dapodik
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penarikan data siswa masuk &amp; penonaktifan siswa keluar di Dapodik, berkas rekomendasi scan, dan cetak surat resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddMutasi('masuk')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tarik Siswa Masuk</span>
          </button>
          <button
            onClick={() => onAddMutasi('keluar')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Keluarkan Siswa</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Mutasi ({mutasiList.length})
          </button>
          <button
            onClick={() => setActiveTab('masuk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'masuk' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📥 Siswa Masuk ({mutasiList.filter(m => m.jenis === 'masuk').length})
          </button>
          <button
            onClick={() => setActiveTab('keluar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'keluar' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📤 Siswa Keluar ({mutasiList.filter(m => m.jenis === 'keluar').length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari siswa, NISN, rombel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <select
            value={filterDapodik}
            onChange={e => setFilterDapodik(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="all">Semua Status Dapodik</option>
            <option value="Proses Tarik">Proses Tarik</option>
            <option value="Validasi Cabdis">Validasi Cabdis</option>
            <option value="Sudah Sinkron">Sudah Sinkron</option>
            <option value="Dikeluarkan">Dikeluarkan</option>
            <option value="Belum Sinkron">Belum Sinkron</option>
          </select>
        </div>
      </div>

      {/* Info Callout for Dapodik Workflow */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <span className="font-bold">Alur Resmi Mutasi Dapodik (Permendikbud):</span> Siswa masuk wajib ditarik melalui menu <em>Mutasi Peserta Didik</em> di aplikasi Manajemen Dapodik (sp.datadik.kemdikbud.go.id) dengan menyertakan Surat Rekomendasi Mutasi yang dicetak dari sistem ini.
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28 text-center">Jenis</th>
                <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                <th className="py-3 px-4 w-28">Kelas</th>
                <th className="py-3 px-4">Asal / Tujuan</th>
                <th className="py-3 px-4 w-44">Status Dapodik</th>
                <th className="py-3 px-4 w-28 text-center">Scan Berkas</th>
                <th className="py-3 px-4 w-36 text-center">Cetak Surat</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.jenis === 'masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.jenis === 'masuk' ? '📥 Masuk' : '📤 Keluar'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{item.namaSiswa}</span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>NISN: {item.nisn}</span>
                        <span>·</span>
                        <span>{item.jenisKelamin}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {item.kelas}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-medium text-slate-800">
                        {item.jenis === 'masuk' ? (
                          <>Dari: <span className="font-bold">{item.sekolahAsal}</span></>
                        ) : (
                          <>Ke: <span className="font-bold">{item.sekolahTujuan}</span></>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">
                        Alasan: {item.alasanMutasi}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getDapodikBadge(item.statusDapodik)}`}>
                          <UserCheck className="w-3 h-3" />
                          <span>{item.statusDapodik}</span>
                        </span>
                        {item.catatanDapodik && (
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {item.catatanDapodik}
                          </p>
                        )}
                        <select
                          value={item.statusDapodik}
                          onChange={e => onUpdateStatusDapodik(item.id, e.target.value as MutasiSiswa['statusDapodik'])}
                          className="mt-1 text-[10px] py-0.5 px-1 border border-slate-200 rounded bg-slate-50 text-slate-600"
                        >
                          <option value="Proses Tarik">Set: Proses Tarik</option>
                          <option value="Validasi Cabdis">Set: Validasi Cabdis</option>
                          <option value="Sudah Sinkron">Set: Sudah Sinkron</option>
                          <option value="Dikeluarkan">Set: Dikeluarkan</option>
                          <option value="Belum Sinkron">Set: Belum Sinkron</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.scanBerkas ? (
                        <button
                          onClick={() => onOpenLightbox(item.scanBerkas!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[11px] font-medium transition-colors"
                          title="Lihat Berkas Scan Mutasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Scan</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Belum Ada</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPrintMutasi(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-[11px] font-semibold shadow-xs transition-colors"
                        title="Pratinjau & Cetak Surat Mutasi Resmi"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Surat</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditMutasi(item)}
                          title="Edit Mutasi"
                          className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMutasi(item.id)}
                          title="Hapus Data Mutasi"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">Tidak ada data mutasi yang sesuai filter</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Klik tombol di atas untuk menambah mutasi baru</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> peserta didik mutasi</span>
          <span>Integrasi Alur Dapodik &amp; Surat Mutasi Resmi</span>
        </div>
      </div>
    </div>
  );
};
