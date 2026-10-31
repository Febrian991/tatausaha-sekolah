import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  Trash2,
  Download,
  Filter,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { SPPTransaction } from '../types/index.ts';

export const FinanceView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    students,
    openPrintModal,
    schoolProfile,
    globalSearchQuery,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Transaction Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [jenisPembayaran, setJenisPembayaran] = useState<SPPTransaction['jenisPembayaran']>('SPP Bulanan');
  const [bulan, setBulan] = useState('November 2026');
  const [nominal, setNominal] = useState(350000);
  const [metode, setMetode] = useState<SPPTransaction['metode']>('Tunai');
  const [keterangan, setKeterangan] = useState('');

  const activeSearch = globalSearchQuery || search;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.namaSiswa.toLowerCase().includes(activeSearch.toLowerCase()) ||
      t.nisn.includes(activeSearch) ||
      t.noKwitansi.toLowerCase().includes(activeSearch.toLowerCase()) ||
      t.kelas.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesType = filterType === 'ALL' || t.jenisPembayaran === filterType;
    return matchesSearch && matchesType;
  });

  const totalCollected = transactions.reduce((sum, t) => sum + t.nominal, 0);
  const sppCollected = transactions
    .filter((t) => t.jenisPembayaran === 'SPP Bulanan')
    .reduce((sum, t) => sum + t.nominal, 0);
  const otherCollected = totalCollected - sppCollected;

  const handleOpenAdd = () => {
    setSelectedStudentId(students[0]?.id || '');
    setJenisPembayaran('SPP Bulanan');
    setBulan('November 2026');
    setNominal(350000);
    setMetode('Tunai');
    setKeterangan('');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const newTx = {
      studentId: student.id,
      namaSiswa: student.nama,
      nisn: student.nisn,
      kelas: student.kelas,
      jenisPembayaran,
      bulan,
      nominal: Number(nominal),
      tanggalBayar: new Date().toISOString().slice(0, 10),
      metode,
      petugasTU: schoolProfile.bendahara,
      status: 'Lunas' as 'Lunas',
      keterangan: keterangan || `Pembayaran ${jenisPembayaran} periode ${bulan}`,
    };

    const createdTx = addTransaction(newTx);
    setIsAddModalOpen(false);

    // Prompt immediate receipt print
    if (createdTx) {
      openPrintModal({
        type: 'kuitansi-spp',
        title: `Kuitansi Resmi Pembayaran - ${student.nama}`,
        data: createdTx,
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['No Kwitansi,Tanggal,Nama Siswa,NISN,Kelas,Pos Pembayaran,Bulan/Periode,Nominal,Metode,Petugas'];
    const rows = filteredTransactions.map(
      (t) =>
        `"${t.noKwitansi}","${t.tanggalBayar}","${t.namaSiswa}","${t.nisn}","${t.kelas}","${t.jenisPembayaran}","${t.bulan}",${t.nominal},"${t.metode}","${t.petugasTU}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Keuangan_TU_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Kas & SPP Terkumpul</div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            Rp {totalCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dari {transactions.length} transaksi penerimaan
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Penerimaan SPP Bulanan</div>
          <div className="text-2xl font-bold font-mono text-blue-600">
            Rp {sppCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tarif Reguler Rp 350.000 / Siswa</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Seragam, Praktik & Lainnya</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            Rp {otherCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Kegiatan, Ujian & Seragam Siswa</div>
        </div>
      </div>

      {/* Action Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa, NISN, kuitansi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="ALL">Semua Pos Pembayaran</option>
            <option value="SPP Bulanan">SPP Bulanan</option>
            <option value="DSP / Uang Pangkal">DSP / Uang Pangkal</option>
            <option value="Uang Ujian & Asesmen">Uang Ujian & Asesmen</option>
            <option value="Seragam & Praktik">Seragam & Praktik</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Kas CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Entri Pembayaran & Kuitansi</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredTransactions.length}</span> bukti kuitansi kas
          </div>
          <div className="text-[11px] text-slate-400">
            Setiap pembayaran dapat dicetak ulang menjadi Kuitansi Resmi 2 Rangkap
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">No. Kuitansi & Tgl</th>
                <th className="py-2.5 px-4 font-semibold">Siswa & Kelas</th>
                <th className="py-2.5 px-4 font-semibold">Pos Pembayaran</th>
                <th className="py-2.5 px-4 font-semibold">Bulan / Keterangan</th>
                <th className="py-2.5 px-4 font-semibold text-right">Nominal</th>
                <th className="py-2.5 px-4 font-semibold">Metode & Petugas</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi Kuitansi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="font-bold text-slate-900">{tx.noKwitansi}</div>
                    <div className="text-slate-400 text-[10px]">{tx.tanggalBayar}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{tx.namaSiswa}</div>
                    <div className="text-slate-500 text-[11px]">
                      {tx.kelas} · <span className="font-mono text-[10px]">{tx.nisn}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tx.jenisPembayaran === 'SPP Bulanan'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tx.jenisPembayaran}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-medium text-slate-900">{tx.bulan}</div>
                    {tx.keterangan && <div className="text-[10px] text-slate-400">{tx.keterangan}</div>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    Rp {tx.nominal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    <div>{tx.metode}</div>
                    <div className="text-slate-400 text-[10px]">Petugas: {tx.petugasTU}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          openPrintModal({
                            type: 'kuitansi-spp',
                            title: `Kuitansi - ${tx.noKwitansi}`,
                            data: tx,
                          })
                        }
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                        title="Cetak Kuitansi Resmi 2 Rangkap"
                      >
                        <Printer className="w-3.5 h-3.5 inline mr-1" />
                        <span>Cetak Kuitansi</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus kuitansi ${tx.noKwitansi}?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Hapus Transaksi"
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

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Entri Pembayaran Kas & SPP Sekolah</h3>
                <p className="text-xs text-slate-500">Menerbitkan kuitansi tata usaha resmi dan memperbarui kas</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Pilih Peserta Didik*</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - NISN: {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jenis / Pos Pembayaran</label>
                  <select
                    value={jenisPembayaran}
                    onChange={(e) => setJenisPembayaran(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="SPP Bulanan">SPP Bulanan</option>
                    <option value="DSP / Uang Pangkal">DSP / Uang Pangkal</option>
                    <option value="Uang Ujian & Asesmen">Uang Ujian & Asesmen</option>
                    <option value="Seragam & Praktik">Seragam & Praktik</option>
                    <option value="Iuran Kegiatan Organisasi">Iuran Kegiatan Organisasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bulan / Periode Tagihan</label>
                  <input
                    type="text"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    placeholder="Contoh: November 2026"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nominal Pembayaran (Rp)*</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={nominal}
                    onChange={(e) => setNominal(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Metode Pembayaran</label>
                  <select
                    value={metode}
                    onChange={(e) => setMetode(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Tunai">Tunai (Kasir TU)</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS / E-Wallet</option>
                    <option value="Virtual Account">Virtual Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan pada kuitansi..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Terbitkan & Cetak Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
