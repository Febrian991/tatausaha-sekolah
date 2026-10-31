import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  Edit3, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { SuratKeluar, ScanFileInfo } from '../../types';

interface SuratKeluarViewProps {
  suratList: SuratKeluar[];
  onAddSurat: () => void;
  onEditSurat: (surat: SuratKeluar) => void;
  onDeleteSurat: (id: string) => void;
  onOpenLightbox: (file: ScanFileInfo) => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  suratList,
  onAddSurat,
  onEditSurat,
  onDeleteSurat,
  onOpenLightbox,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSurat = suratList.filter(s => {
    const matchQuery = 
      s.noAgenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.noSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tujuanSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kodeKlasifikasi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || s.statusArsip === filterStatus;

    return matchQuery && matchStatus;
  });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Buku Agenda Surat Keluar Resmi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penomoran surat dinas keluar, kode klasifikasi arsip, dan penyimpanan scan fisik berstempel basah.
          </p>
        </div>

        <button
          onClick={onAddSurat}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Surat Keluar</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor agenda, nomor surat, tujuan, perihal, kode klasifikasi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">Semua Status Arsip</option>
            <option value="Draft">Draft</option>
            <option value="Terkirim">Terkirim</option>
            <option value="Diarsipkan">Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-32">No. Agenda</th>
                <th className="py-3 px-4 w-44">No. Surat &amp; Tgl</th>
                <th className="py-3 px-4 w-44">Kode Klasifikasi</th>
                <th className="py-3 px-4 w-48">Tujuan Surat</th>
                <th className="py-3 px-4">Perihal &amp; Penandatangan</th>
                <th className="py-3 px-4 w-28 text-center">Scan Berstempel</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurat.length > 0 ? (
                filteredSurat.map(surat => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {surat.noAgenda}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block truncate">{surat.noSurat}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Tgl: {surat.tanggalSurat}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                        {surat.kodeKlasifikasi}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {surat.tujuanSurat}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug line-clamp-1">{surat.perihal}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Penandatangan: <span className="font-medium text-slate-700">{surat.penandatangan}</span>
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {surat.scanFile ? (
                        <button
                          onClick={() => onOpenLightbox(surat.scanFile!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-medium transition-colors"
                          title="Lihat Scan Surat Berstempel"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Arsip</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Belum Ada</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        surat.statusArsip === 'Diarsipkan' ? 'bg-emerald-50 text-emerald-800' :
                        surat.statusArsip === 'Terkirim' ? 'bg-sky-50 text-sky-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{surat.statusArsip}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditSurat(surat)}
                          title="Edit Surat Keluar"
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSurat(surat.id)}
                          title="Hapus Surat"
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
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">Tidak ada surat keluar yang sesuai kriteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Daftarkan surat keluar baru dengan tombol di atas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan <strong className="text-slate-800">{filteredSurat.length}</strong> dari total {suratList.length} surat keluar</span>
          <span>Buku Registrasi Surat Keluar Satuan Pendidikan</span>
        </div>
      </div>
    </div>
  );
};
