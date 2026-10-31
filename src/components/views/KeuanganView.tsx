import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  Calendar, 
  PieChart,
  DollarSign,
  TrendingUp,
  FileCheck2,
  X,
  CreditCard
} from 'lucide-react';
import { 
  TransaksiKas, 
  PembayaranSiswa, 
  AnggaranBOSItem, 
  SchoolProfile,
  UserSession 
} from '../../types';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';

interface KeuanganViewProps {
  user: UserSession;
  profile: SchoolProfile;
  transaksiKasList: TransaksiKas[];
  pembayaranSiswaList: PembayaranSiswa[];
  anggaranBOSList: AnggaranBOSItem[];
  onAddTransaksiKas: (item: TransaksiKas) => void;
  onAddPembayaranSiswa: (item: PembayaranSiswa) => void;
}

export const KeuanganView: React.FC<KeuanganViewProps> = ({
  user,
  profile,
  transaksiKasList,
  pembayaranSiswaList,
  anggaranBOSList,
  onAddTransaksiKas,
  onAddPembayaranSiswa,
}) => {
  const [activeTab, setActiveTab] = useState<'bku' | 'spp' | 'bos'>('bku');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [isModalKasOpen, setIsModalKasOpen] = useState(false);
  const [isModalSppOpen, setIsModalSppOpen] = useState(false);
  const [activeKwitansi, setActiveKwitansi] = useState<PembayaranSiswa | null>(null);

  // New Transaction Kas Form State
  const [jenisKas, setJenisKas] = useState<'masuk' | 'keluar'>('masuk');
  const [kategoriKas, setKategoriKas] = useState<TransaksiKas['kategori']>('BOS Reguler');
  const [uraianKas, setUraianKas] = useState('');
  const [jumlahKas, setJumlahKas] = useState<number>(0);
  const [kodeAkunKas, setKodeAkunKas] = useState('5.2.1.01');
  const [noBuktiKas, setNoBuktiKas] = useState(`BKM/BOS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);

  // New SPP Form State
  const [nisSpp, setNisSpp] = useState('');
  const [namaSpp, setNamaSpp] = useState('');
  const [kelasSpp, setKelasSpp] = useState('X-1');
  const [jenisBayarSpp, setJenisBayarSpp] = useState<PembayaranSiswa['jenisPembayaran']>('SPP Bulanan');
  const [bulanSpp, setBulanSpp] = useState('November 2026');
  const [jumlahSpp, setJumlahSpp] = useState<number>(250000);
  const [metodeSpp, setMetodeSpp] = useState<PembayaranSiswa['metode']>('Tunai');

  // Calculations
  const totalMasuk = transaksiKasList
    .filter(t => t.jenis === 'masuk')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalKeluar = transaksiKasList
    .filter(t => t.jenis === 'keluar')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const saldoKas = totalMasuk - totalKeluar;

  const totalSppTerkumpul = pembayaranSiswaList
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalPaguBOS = anggaranBOSList
    .reduce((acc, curr) => acc + curr.alokasiPagu, 0);

  const totalRealisasiBOS = anggaranBOSList
    .reduce((acc, curr) => acc + curr.realisasi, 0);

  const persentaseTotalBOS = totalPaguBOS > 0 ? (totalRealisasiBOS / totalPaguBOS) * 100 : 0;

  // Filtered BKU
  const filteredKas = transaksiKasList.filter(item => {
    const matchQuery = 
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noBukti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeAkun.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKat = filterKategori === 'all' || item.kategori === filterKategori;
    return matchQuery && matchKat;
  });

  // Filtered SPP
  const filteredSpp = pembayaranSiswaList.filter(item => {
    return (
      item.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nis.includes(searchQuery) ||
      item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Submit Kas
  const handleSaveKas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianKas || jumlahKas <= 0) return;

    const newSaldo = jenisKas === 'masuk' ? saldoKas + jumlahKas : saldoKas - jumlahKas;
    const newItem: TransaksiKas = {
      id: `kas-${Date.now()}`,
      tanggal: new Date().toISOString().slice(0, 10),
      kodeAkun: kodeAkunKas,
      keterangan: uraianKas,
      jenis: jenisKas,
      kategori: kategoriKas,
      jumlah: jumlahKas,
      saldo: newSaldo,
      noBukti: noBuktiKas,
      petugas: user.name,
    };

    onAddTransaksiKas(newItem);
    setIsModalKasOpen(false);
    setUraianKas('');
    setJumlahKas(0);
  };

  // Submit SPP
  const handleSaveSpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSpp || jumlahSpp <= 0) return;

    const newItem: PembayaranSiswa = {
      id: `spp-${Date.now()}`,
      tanggal: new Date().toISOString().slice(0, 10),
      nis: nisSpp || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      namaSiswa: namaSpp,
      kelas: kelasSpp,
      jenisPembayaran: jenisBayarSpp,
      bulan: bulanSpp,
      jumlah: jumlahSpp,
      metode: metodeSpp,
      status: 'Lunas',
      noKwitansi: `KWT/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      penerima: `${user.name} (Bendahara)`,
    };

    onAddPembayaranSiswa(newItem);
    setIsModalSppOpen(false);
    setNamaSpp('');
    setNisSpp('');
    setActiveKwitansi(newItem);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Wallet className="w-3.5 h-3.5" />
            <span>Modul Khusus Bendahara &amp; Administrasi Keuangan Sekolah</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Pengelolaan Keuangan &amp; Kas Sekolah
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Pencatatan Buku Kas Umum (BKU), realisasi Dana BOS/BOSP, iuran/SPP siswa resmi, dan cetak kuitansi kedinasan sesuai standar akuntansi sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setJenisKas('masuk');
              setNoBuktiKas(`BKM/BOS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
              setIsModalKasOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Kas Masuk</span>
          </button>
          <button
            onClick={() => {
              setJenisKas('keluar');
              setNoBuktiKas(`BKK/BOS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
              setIsModalKasOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Kas Keluar</span>
          </button>
          <button
            onClick={() => setIsModalSppOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Pembayaran SPP</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Kas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Kas Sekolah</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            Rp {saldoKas.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <span>Saldo aktif BKU siap transaksi</span>
          </div>
        </div>

        {/* Card 2: Total Kas Masuk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Penerimaan Kas</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            Rp {totalMasuk.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Dana BOS, BOPD &amp; SPP</span>
          </div>
        </div>

        {/* Card 3: Total Kas Keluar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pengeluaran Kas</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            Rp {totalKeluar.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Operasional, ATK &amp; SPPD</span>
          </div>
        </div>

        {/* Card 4: Serapan Dana BOS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Realisasi Dana BOS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            {persentaseTotalBOS.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(persentaseTotalBOS, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('bku'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bku'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Buku Kas Umum (BKU) ({transaksiKasList.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('spp'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'spp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>SPP &amp; Iuran Siswa ({pembayaranSiswaList.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('bos'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Realisasi BOS &amp; RKAS ({anggaranBOSList.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi / kuitansi / uraian..."
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
              title="Cetak Laporan Keuangan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BUKU KAS UMUM (BKU) */}
        {activeTab === 'bku' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">No. Bukti Kas</th>
                  <th className="py-3 px-4">Kode Akun</th>
                  <th className="py-3 px-4">Uraian Transaksi</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-right">Debit (Masuk)</th>
                  <th className="py-3 px-4 text-right">Kredit (Keluar)</th>
                  <th className="py-3 px-4 text-right">Saldo Berjalan</th>
                  <th className="py-3 px-4">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKas.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {t.tanggal}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {t.noBukti}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {t.kodeAkun}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      {t.keterangan}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {t.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {t.jenis === 'masuk' ? `Rp ${t.jumlah.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700 whitespace-nowrap">
                      {t.jenis === 'keluar' ? `Rp ${t.jumlah.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">
                      Rp {t.saldo.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {t.petugas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: PEMBAYARAN SPP & IURAN SISWA */}
        {activeTab === 'spp' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">No. Kwitansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">NIS / NISN</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Jenis Iuran</th>
                  <th className="py-3 px-4">Periode / Bulan</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSpp.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800 whitespace-nowrap">
                      {s.noKwitansi}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {s.tanggal}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {s.nis}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {s.namaSiswa}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {s.kelas}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {s.jenisPembayaran}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {s.bulan}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700 whitespace-nowrap">
                      Rp {s.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium border border-slate-200">
                        {s.metode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setActiveKwitansi(s)}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[11px] font-bold border border-sky-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: REALISASI ANGGARAN BOS */}
        {activeTab === 'bos' && (
          <div className="p-6 space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-sky-900 uppercase">Ringkasan Serapan Dana BOSP TA 2026</h4>
                <p className="text-xs text-sky-700 mt-0.5">
                  Total Pagu: <strong>Rp {totalPaguBOS.toLocaleString('id-ID')}</strong> | 
                  Terserap: <strong>Rp {totalRealisasiBOS.toLocaleString('id-ID')}</strong> ({persentaseTotalBOS.toFixed(1)}%)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white">
                Status: Sesuai Juknis BOS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">8 Standar Nasional Pendidikan</th>
                    <th className="py-3 px-4">Rincian Kegiatan Sekolah</th>
                    <th className="py-3 px-4 text-right">Pagu Anggaran</th>
                    <th className="py-3 px-4 text-right">Realisasi Berjalan</th>
                    <th className="py-3 px-4 text-right">Sisa Pagu</th>
                    <th className="py-3 px-4 text-right">Serapan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {anggaranBOSList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.standarPendidikan}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-sm">
                        {item.kegiatan}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        Rp {item.alokasiPagu.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        Rp {item.realisasi.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-600">
                        Rp {item.sisaPagu.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slate-900 mr-2">{item.persentase}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 inline-block align-middle overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(item.persentase, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: FORM TRANSAKSI KAS */}
      {isModalKasOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className={`px-6 py-4 flex items-center justify-between text-white ${
              jenisKas === 'masuk' ? 'bg-emerald-800' : 'bg-rose-800'
            }`}>
              <div className="flex items-center gap-2">
                {jenisKas === 'masuk' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                <h3 className="font-bold text-sm">
                  {jenisKas === 'masuk' ? 'Catat Kas Masuk (Penerimaan)' : 'Catat Kas Keluar (Pengeluaran)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalKasOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKas} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor Bukti Kas
                </label>
                <input
                  type="text"
                  value={noBuktiKas}
                  onChange={e => setNoBuktiKas(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Anggaran
                </label>
                <select
                  value={kategoriKas}
                  onChange={e => setKategoriKas(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  <option value="BOS Reguler">BOS Reguler (Kemendikbud)</option>
                  <option value="BOPD">BOPD / APBD Provinsi</option>
                  <option value="SPP/Iuran Siswa">SPP &amp; Iuran Siswa</option>
                  <option value="Komite">Dana Partisipasi Komite Sekolah</option>
                  <option value="Lain-lain">Pendapatan Lain-lain Sah</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Kode Rekening / Akun
                </label>
                <input
                  type="text"
                  value={kodeAkunKas}
                  onChange={e => setKodeAkunKas(e.target.value)}
                  placeholder="Contoh: 5.2.1.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Uraian / Keterangan Transaksi
                </label>
                <textarea
                  value={uraianKas}
                  onChange={e => setUraianKas(e.target.value)}
                  rows={3}
                  placeholder="Masukkan keterangan detail keperluan..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nominal Transaksi (Rp)
                </label>
                <input
                  type="number"
                  value={jumlahKas || ''}
                  onChange={e => setJumlahKas(Number(e.target.value))}
                  placeholder="0"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm font-bold text-right"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalKasOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-lg shadow-sm ${
                    jenisKas === 'masuk' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM PEMBAYARAN SPP */}
      {isModalSppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 flex items-center justify-between text-white bg-sky-900">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Input Pembayaran SPP / Iuran Siswa</h3>
              </div>
              <button 
                onClick={() => setIsModalSppOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpp} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  value={namaSpp}
                  onChange={e => setNamaSpp(e.target.value)}
                  placeholder="Masukkan nama lengkap siswa..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    NIS / NISN
                  </label>
                  <input
                    type="text"
                    value={nisSpp}
                    onChange={e => setNisSpp(e.target.value)}
                    placeholder="NIS siswa..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    value={kelasSpp}
                    onChange={e => setKelasSpp(e.target.value)}
                    placeholder="Contoh: XI MIPA 2"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Jenis Pembayaran
                </label>
                <select
                  value={jenisBayarSpp}
                  onChange={e => setJenisBayarSpp(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Iuran Komite">Iuran Partisipasi Komite</option>
                  <option value="Seragam & Modul">Seragam &amp; Modul Ajar</option>
                  <option value="Kegiatan Siswa">Kegiatan Kesiswaan / Ekstrakurikuler</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Periode / Bulan
                  </label>
                  <input
                    type="text"
                    value={bulanSpp}
                    onChange={e => setBulanSpp(e.target.value)}
                    placeholder="Bulan..."
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={metodeSpp}
                    onChange={e => setMetodeSpp(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Tunai">Tunai di Loket</option>
                    <option value="Transfer Bank">Transfer Bank Dinas</option>
                    <option value="QRIS Dinas">QRIS Bank BJB/Dinas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nominal Pembayaran (Rp)
                </label>
                <input
                  type="number"
                  value={jumlahSpp || ''}
                  onChange={e => setJumlahSpp(Number(e.target.value))}
                  placeholder="0"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm font-bold text-right"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalSppOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan &amp; Terbitkan Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CETAK KWITANSI RESMI PREVIEW */}
      {activeKwitansi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in my-6">
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
              <span className="font-bold text-xs uppercase tracking-wider">
                Pratinjau Kuitansi Resmi Pembayaran Siswa
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kuitansi</span>
                </button>
                <button
                  onClick={() => setActiveKwitansi(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Receipt Sheet */}
            <div className="p-8 bg-white border-8 border-slate-100 text-slate-900 font-sans print:border-0 print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TutWuriHandayaniLogo className="w-12 h-12" />
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-tight">{profile.namaSekolah}</h3>
                    <p className="text-[10px] text-slate-600">{profile.alamat} · Telp: {profile.telepon}</p>
                    <p className="text-[10px] text-slate-600">NPSN: {profile.npsn} · Email: {profile.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs tracking-wider uppercase rounded">
                    KUITANSI PEMBAYARAN
                  </span>
                  <p className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                    No: {activeKwitansi.noKwitansi}
                  </p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex">
                  <span className="w-36 text-slate-500 font-semibold">Telah Diterima Dari:</span>
                  <span className="flex-1 font-bold text-slate-900 uppercase">
                    {activeKwitansi.namaSiswa} (NIS: {activeKwitansi.nis} / Kelas: {activeKwitansi.kelas})
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 text-slate-500 font-semibold">Uang Sejumlah:</span>
                  <span className="flex-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Rp {activeKwitansi.jumlah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 text-slate-500 font-semibold">Untuk Pembayaran:</span>
                  <span className="flex-1 text-slate-800">
                    {activeKwitansi.jenisPembayaran} Periode {activeKwitansi.bulan} via {activeKwitansi.metode}
                  </span>
                </div>
              </div>

              {/* Signature Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <p className="text-[10px] text-slate-500">Status: <strong>LUNAS &amp; SAH</strong></p>
                  <p className="text-[10px] text-slate-400">Dicetak melalui Sistem Informasi Tata Usaha &amp; Keuangan Sekolah</p>
                </div>
                <div className="text-center w-48">
                  <p className="text-slate-600 mb-1">{profile.kotaKabupaten}, {activeKwitansi.tanggal}</p>
                  <p className="font-semibold text-slate-800 mb-12">Bendahara Sekolah,</p>
                  <p className="font-bold text-slate-900 underline">{user.name}</p>
                  <p className="text-[10px] text-slate-500">NIP. {user.nip || '19850312 201001 1 014'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
