import React, { useState } from 'react';
import { ArsipDigital, SchoolProfile } from '../../types/situ';
import { 
  Archive, 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  FolderArchive,
  X,
  FileCheck,
  Package
} from 'lucide-react';
import JSZip from 'jszip';
import { formatTanggalIndonesia } from '../../utils/mockSituData';

interface ArsipDigitalViewProps {
  profile: SchoolProfile;
  arsipList: ArsipDigital[];
  onAddArsip: (arsip: ArsipDigital) => void;
}

export const ArsipDigitalView: React.FC<ArsipDigitalViewProps> = ({
  profile,
  arsipList,
  onAddArsip
}) => {
  const [activeTab, setActiveTab] = useState<'MASUK' | 'KELUAR'>('MASUK');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('SEMUA');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ArsipDigital | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // New Arsip Form State
  const [nomorAgenda, setNomorAgenda] = useState(`AGD/2026/X/0${Math.floor(150 + Math.random() * 50)}`);
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalTerimaKirim, setTanggalTerimaKirim] = useState(new Date().toISOString().split('T')[0]);
  const [pengirimPenerima, setPengirimPenerima] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kategori, setKategori] = useState<ArsipDigital['kategori']>('Dinas Pendidikan');
  const [disposisiPimpinan, setDisposisiPimpinan] = useState('Kepala Sekolah: Harap dipelajari dan ditindaklanjuti sesuai petunjuk teknis.');
  const [namaFileScan, setNamaFileScan] = useState('Scan_Fisik_Dokumen_Resmi.pdf');

  const filteredArsip = arsipList.filter((item) => {
    const matchJenis = item.jenis === activeTab;
    const matchKategori = selectedKategori === 'SEMUA' || item.kategori === selectedKategori;
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pengirimPenerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorAgenda.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenis && matchKategori && matchSearch;
  });

  const handleSimpanArsip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !pengirimPenerima || !perihal) return;

    const newArsip: ArsipDigital = {
      id: `ARS-${Date.now()}`,
      jenis: activeTab,
      nomorAgenda,
      nomorSurat,
      tanggalSurat,
      tanggalTerimaKirim,
      pengirimPenerima,
      perihal,
      kategori,
      disposisiPimpinan,
      statusTindakLanjut: 'Dalam Proses',
      namaFileScan: namaFileScan || 'Dokumen_Scan_Fisik.pdf',
      ukuranFile: '1.2 MB',
      catatanPetugas: 'Diinput oleh Petugas Urusan Tata Usaha & Kearsipan'
    };

    onAddArsip(newArsip);
    setIsAddModalOpen(false);
    // Reset
    setNomorSurat('');
    setPengirimPenerima('');
    setPerihal('');
  };

  // Export Paket Arsip menggunakan JSZip
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Folder dalam ZIP
      const folderSurat = zip.folder(`Arsip_${activeTab}_${profile.namaSekolah.replace(/\s+/g, '_')}`);

      // Tambahkan ringkasan CSV
      const csvHeader = 'No Agenda,No Surat,Tanggal Surat,Pengirim/Penerima,Perihal,Kategori,Disposisi,Status\n';
      const csvRows = filteredArsip.map(
        (a) => `"${a.nomorAgenda}","${a.nomorSurat}","${a.tanggalSurat}","${a.pengirimPenerima}","${a.perihal}","${a.kategori}","${a.disposisiPimpinan}","${a.statusTindakLanjut}"`
      ).join('\n');

      folderSurat?.file('Rekap_Buku_Agenda.csv', csvHeader + csvRows);

      // Tambahkan berkas teks simulasi dokumen scan untuk setiap item
      filteredArsip.forEach((item, index) => {
        const dummyContent = `=====================================================
KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
ARSIP DOKUMEN FISIK DIGITAL - SI-TU SEKOLAH
=====================================================
Nomor Agenda    : ${item.nomorAgenda}
Nomor Surat     : ${item.nomorSurat}
Tanggal Surat   : ${item.tanggalSurat}
Pihak Terkait   : ${item.pengirimPenerima}
Perihal         : ${item.perihal}
Kategori        : ${item.kategori}
Disposisi       : ${item.disposisiPimpinan}
Status          : ${item.statusTindakLanjut}
Nama File Scan  : ${item.namaFileScan || 'Dokumen_Fisik.pdf'}
Diverifikasi di : ${profile.namaSekolah} (${profile.kota})
=====================================================`;
        folderSurat?.file(`Dokumen_${index + 1}_${item.nomorAgenda.replace(/\//g, '_')}.txt`, dummyContent);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Paket_Arsip_${activeTab}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Gagal membuat ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Archive className="w-6 h-6 text-blue-600" />
            <span>Scan Fisik Arsip Digital & Buku Agenda</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan surat masuk & keluar, digitalisasi lembar disposisi pimpinan, dan pratinjau scan fisik dokumen kedinasan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>{isZipping ? 'Mengompres ZIP...' : 'Unduh Paket Arsip (.ZIP)'}</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi {activeTab === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Surat Masuk vs Surat Keluar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('MASUK')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'MASUK'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Buku Agenda Surat Masuk</span>
            <span className="text-[11px] font-mono-data bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {arsipList.filter((a) => a.jenis === 'MASUK').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('KELUAR')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'KELUAR'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Buku Agenda Surat Keluar</span>
            <span className="text-[11px] font-mono-data bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {arsipList.filter((a) => a.jenis === 'KELUAR').length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Kategori & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Kategori Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {['SEMUA', 'Dinas Pendidikan', 'Kemenag', 'Kepegawaian', 'Kesiswaan', 'Keuangan & BOS'].map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedKategori === kat
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari no. agenda, perihal, instansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Table Agenda Arsip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">No. Agenda & Tanggal</th>
                <th className="px-4 py-3">Nomor Surat Asli</th>
                <th className="px-4 py-3">{activeTab === 'MASUK' ? 'Pengirim' : 'Penerima'}</th>
                <th className="px-4 py-3">Perihal & Disposisi Pimpinan</th>
                <th className="px-4 py-3">Scan Fisik</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredArsip.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 font-mono-data text-xs">
                      {item.nomorAgenda}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Terima: {formatTanggalIndonesia(item.tanggalTerimaKirim)}
                    </div>
                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.kategori}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono-data font-medium text-slate-900">
                    <div>{item.nomorSurat}</div>
                    <div className="text-[10px] text-slate-400 font-sans">
                      Tgl: {formatTanggalIndonesia(item.tanggalSurat)}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-900 max-w-[200px]">
                    {item.pengirimPenerima}
                  </td>

                  <td className="px-4 py-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 text-xs mb-1">{item.perihal}</div>
                    <div className="p-2 bg-amber-50/80 border border-amber-200/80 rounded text-[11px] text-amber-900 leading-snug">
                      <span className="font-bold block text-[10px] text-amber-800">LEMBAR DISPOSISI:</span>
                      {item.disposisiPimpinan}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {item.namaFileScan ? (
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{item.namaFileScan}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Belum di-scan</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setPreviewFile(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Scan Fisik</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pratinjau Scan Fisik & Disposisi */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">ARSIP SCAN FISIK & LEMBAR DISPOSISI</h3>
                  <p className="text-[11px] text-slate-400">{previewFile.nomorAgenda} · {previewFile.nomorSurat}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 bg-slate-50">
              {/* Lembar Disposisi Kepala Sekolah */}
              <div className="bg-white border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Lembar Disposisi Resmi Kepala Sekolah</span>
                  </span>
                  <span className="text-[11px] font-mono-data text-slate-500">
                    {profile.namaSekolah}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Surat Dari / Pengirim:</span>
                    <span className="font-bold text-slate-900">{previewFile.pengirimPenerima}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nomor & Tanggal Surat:</span>
                    <span className="font-mono-data font-medium text-slate-900">
                      {previewFile.nomorSurat} ({formatTanggalIndonesia(previewFile.tanggalSurat)})
                    </span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 block mb-0.5">Perihal Surat:</span>
                  <div className="font-semibold text-slate-900">{previewFile.perihal}</div>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">INSTRUKSI / DISPOSISI PIMPINAN:</span>
                  <p className="text-slate-800 leading-relaxed italic font-serif">
                    "{previewFile.disposisiPimpinan}"
                  </p>
                  <div className="mt-2 text-right text-[11px] font-bold text-slate-800">
                    Tertanda, {profile.kepalaSekolah.nama}
                  </div>
                </div>
              </div>

              {/* Tampilan Visual Dokumen Scan Fisik */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                {/* Visual Dokumen Watermark */}
                <div className="absolute top-3 right-3 text-[10px] font-mono-data bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-300">
                  SCAN ASLI TERSERTIFIKASI
                </div>

                <div className="w-20 h-28 bg-slate-100 border-2 border-slate-300 rounded shadow-inner flex flex-col items-center justify-center p-2 relative">
                  <FileText className="w-8 h-8 text-slate-400 mb-1" />
                  <div className="w-full h-1 bg-slate-300 mb-0.5 rounded" />
                  <div className="w-3/4 h-1 bg-slate-300 mb-0.5 rounded" />
                  <div className="w-1/2 h-1 bg-slate-300 rounded" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="rotate-[-25deg] text-[8px] font-bold text-blue-900/40 uppercase">ARSIP TU RESMI</span>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900 text-sm">{previewFile.namaFileScan}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Ukuran Berkas: {previewFile.ukuranFile || '1.4 MB'} · Format: PDF/A-1b</div>
                </div>

                <button
                  onClick={() => alert(`Mengunduh berkas ${previewFile.namaFileScan}... Dokumen siap dibuka.`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Berkas Dokumen Fisik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrasi Surat Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Archive className="w-5 h-5 text-blue-600" />
                <span>Registrasi Buku Agenda {activeTab === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanArsip} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Agenda Surat</label>
                  <input
                    type="text"
                    required
                    value={nomorAgenda}
                    onChange={(e) => setNomorAgenda(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Dokumen</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as ArsipDigital['kategori'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="Dinas Pendidikan">Dinas Pendidikan</option>
                    <option value="Kemenag">Kementerian Agama</option>
                    <option value="Kepegawaian">Kepegawaian (GTK)</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Keuangan & BOS">Keuangan & BOS</option>
                    <option value="Organisasi/Lainnya">Organisasi / Instansi Luar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor Surat Asli</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 420/1234-Disdik/Set.2026"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Surat Asli</label>
                  <input
                    type="date"
                    required
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Diterima / Dicatat</label>
                  <input
                    type="date"
                    required
                    value={tanggalTerimaKirim}
                    onChange={(e) => setTanggalTerimaKirim(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {activeTab === 'MASUK' ? 'Instansi Pengirim' : 'Pihak Penerima'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dinas Pendidikan Provinsi Jawa Barat / Balai Guru Penggerak"
                  value={pengirimPenerima}
                  onChange={(e) => setPengirimPenerima(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Perihal Dokumen / Surat</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan isi pokok perihal surat..."
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instruksi Lembar Disposisi Pimpinan</label>
                <textarea
                  rows={2}
                  value={disposisiPimpinan}
                  onChange={(e) => setDisposisiPimpinan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Berkas Scan Fisik</label>
                <input
                  type="text"
                  value={namaFileScan}
                  onChange={(e) => setNamaFileScan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Simpan ke Buku Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
