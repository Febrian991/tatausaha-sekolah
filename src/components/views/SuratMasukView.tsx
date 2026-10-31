import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Plus, 
  Eye, 
  FileCheck2, 
  Send, 
  Printer, 
  Trash2, 
  Edit3, 
  FileText 
} from 'lucide-react';
import { SuratMasuk, ScanFileInfo } from '../../types';

interface SuratMasukViewProps {
  suratList: SuratMasuk[];
  onAddSurat: () => void;
  onEditSurat: (surat: SuratMasuk) => void;
  onDeleteSurat: (id: string) => void;
  onOpenDisposisi: (surat: SuratMasuk) => void;
  onOpenLightbox: (file: ScanFileInfo) => void;
  onPrintDisposisi: (surat: SuratMasuk) => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  suratList,
  onAddSurat,
  onEditSurat,
  onDeleteSurat,
  onOpenDisposisi,
  onOpenLightbox,
  onPrintDisposisi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState<string>('all');
  const [filterDisposisi, setFilterDisposisi] = useState<string>('all');

  const filteredSurat = suratList.filter(s => {
    const matchQuery = 
      s.noAgenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.noSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asalSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchKlas = filterKlasifikasi === 'all' || s.klasifikasi === filterKlasifikasi;
    const matchDisp = filterDisposisi === 'all' || s.statusDisposisi === filterDisposisi;

    return matchQuery && matchKlas && matchDisp;
  });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Buku Agenda Surat Masuk &amp; Lembar Disposisi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan surat resmi masuk, upload berkas scan fisik, dan instruksi disposisi Kepala Sekolah.
          </p>
        </div>

        <button
          onClick={onAddSurat}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Surat Masuk</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor agenda, nomor surat, asal dinas, perihal..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterKlasifikasi}
            onChange={e => setFilterKlasifikasi(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="all">Semua Kecepatan</option>
            <option value="Biasa">Biasa</option>
            <option value="Penting">Penting</option>
            <option value="Segera">Segera</option>
            <option value="Rahasia">Rahasia</option>
          </select>

          <select
            value={filterDisposisi}
            onChange={e => setFilterDisposisi(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="all">Semua Status Disposisi</option>
            <option value="Belum">Belum Disposisi</option>
            <option value="Sudah">Sudah Disposisi</option>
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
                <th className="py-3 px-4 w-48">Asal Surat</th>
                <th className="py-3 px-4">Perihal &amp; Ringkasan</th>
                <th className="py-3 px-4 w-28 text-center">Scan Fisik</th>
                <th className="py-3 px-4 w-32 text-center">Disposisi</th>
                <th className="py-3 px-4 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSurat.length > 0 ? (
                filteredSurat.map(surat => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {surat.noAgenda}
                      <span className="block text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                        Terima: {surat.tanggalDiterima}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block truncate">{surat.noSurat}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Tgl: {surat.tanggalSurat}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {surat.asalSurat}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug line-clamp-1">{surat.perihal}</div>
                      {surat.ringkasan && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{surat.ringkasan}</p>
                      )}
                      <span className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
                        surat.klasifikasi === 'Penting' ? 'bg-amber-100 text-amber-800' :
                        surat.klasifikasi === 'Segera' ? 'bg-rose-100 text-rose-800' :
                        surat.klasifikasi === 'Rahasia' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {surat.klasifikasi}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {surat.scanFile ? (
                        <button
                          onClick={() => onOpenLightbox(surat.scanFile!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-md text-[11px] font-medium transition-colors"
                          title="Buka Scan Fisik Lightbox"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Arsip</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Belum Ada</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenDisposisi(surat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          surat.statusDisposisi === 'Sudah'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Atur Lembar Disposisi"
                      >
                        {surat.statusDisposisi === 'Sudah' ? (
                          <>
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Terdisposisi</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-amber-600" />
                            <span>Beri Disposisi</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onPrintDisposisi(surat)}
                          title="Cetak Lembar Disposisi"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditSurat(surat)}
                          title="Edit Agenda"
                          className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-md transition-colors"
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
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">Tidak ada surat masuk yang sesuai filter</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Daftarkan surat masuk baru dengan tombol di atas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan <strong className="text-slate-800">{filteredSurat.length}</strong> dari total {suratList.length} surat masuk</span>
          <span>Buku Agenda Persuratan Resmi Kedinasan</span>
        </div>
      </div>
    </div>
  );
};
