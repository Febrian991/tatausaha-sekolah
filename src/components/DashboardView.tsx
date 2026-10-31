import React from 'react';
import {
  Users,
  Briefcase,
  Mail,
  Receipt,
  Boxes,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const DashboardView: React.FC = () => {
  const {
    stats,
    setCurrentView,
    mails,
    transactions,
    students,
    openPrintModal,
    schoolProfile,
    currentUser,
  } = useApp();

  const recentMails = mails.slice(0, 4);
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-xl p-6 border border-slate-700/60 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
            <span>Pusat Administrasi & Tata Usaha Terpadu</span>
            <span>·</span>
            {currentUser && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600/70 text-blue-100 border border-blue-400/30 text-[10px] font-semibold">
                {currentUser.roleLabel}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white mb-2">
            Selamat Datang, {currentUser ? currentUser.name : `di Portal ${schoolProfile.namaSekolah}`}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kelola persuratan dinas, buku induk siswa, administrasi kepegawaian PTK, pencatatan SPP & kas, serta pemeliharaan sarana prasarana sekolah secara terpusat, cepat, dan akuntabel.
          </p>


          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            {currentUser?.role === 'bendahara' ? (
              <>
                <button
                  onClick={() => setCurrentView('finance')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Catat Pembayaran SPP & Kas</span>
                </button>
                <button
                  onClick={() => setCurrentView('students')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Cek Status Siswa</span>
                </button>
              </>
            ) : currentUser?.role === 'staf_tu' ? (
              <>
                <button
                  onClick={() => setCurrentView('mail')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Buka Agenda Surat</span>
                </button>
                <button
                  onClick={() => setCurrentView('students')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Buku Induk Siswa</span>
                </button>
                <button
                  onClick={() => setCurrentView('inventory')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Sarana & Aset</span>
                </button>
                <button
                  onClick={() => setCurrentView('ai-letters')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-amber-300 bg-slate-800/80 hover:bg-slate-700 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draf Surat AI</span>
                </button>
              </>
            ) : currentUser?.role === 'kepsek' ? (
              <>
                <button
                  onClick={() => setCurrentView('mail')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Disposisi Surat Masuk</span>
                </button>
                <button
                  onClick={() => setCurrentView('students')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Data Siswa</span>
                </button>
                <button
                  onClick={() => setCurrentView('staff')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Kepegawaian PTK</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('mail')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Buka Agenda Surat</span>
                </button>
                <button
                  onClick={() => setCurrentView('finance')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Catat Pembayaran SPP</span>
                </button>
                <button
                  onClick={() => setCurrentView('ai-letters')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-amber-300 bg-slate-800/80 hover:bg-slate-700 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draf Surat AI</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Aktif */}
        <div
          onClick={() => setCurrentView('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.activeStudents}</span>
            <span className="text-xs text-emerald-600 font-medium">Siswa Aktif</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Buku Induk Lengkap</span>
            <span className="text-blue-600 font-semibold group-hover:underline">Buka Data →</span>
          </div>
        </div>

        {/* Persuratan Menunggu Disposisi */}
        <div
          onClick={() => setCurrentView('mail')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Disposisi Menunggu</span>
            <Mail className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">{stats.pendingDispositions}</span>
            <span className="text-xs text-slate-500">Surat Masuk</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Perlu Arahan Kepsek</span>
            <span className="text-amber-600 font-semibold group-hover:underline">Tindak Lanjuti →</span>
          </div>
        </div>

        {/* Kas & SPP Terkumpul */}
        <div
          onClick={() => setCurrentView('finance')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Penerimaan Kas & SPP</span>
            <Receipt className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              Rp {(stats.monthlyIncome / 1000000).toFixed(1)} Jt
            </span>
            <span className="text-xs text-slate-500">Periode Berjalan</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>{transactions.length} Kwitansi Tercatat</span>
            <span className="text-emerald-600 font-semibold group-hover:underline">Buku Kas →</span>
          </div>
        </div>

        {/* PTK & Guru Aktif */}
        <div
          onClick={() => setCurrentView('staff')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pendidik & Tenaga Kependidikan</span>
            <Briefcase className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.totalStaff}</span>
            <span className="text-xs text-slate-500">Guru & Staf TU</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>PNS, PPPK & Honorer</span>
            <span className="text-purple-600 font-semibold group-hover:underline">Kelola PTK →</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Mails & Recent Financial Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda Surat Terkini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Agenda Surat Terbaru</h3>
              <p className="text-xs text-slate-500">Buku registrasi surat masuk dan keluar dinas</p>
            </div>
            <button
              onClick={() => setCurrentView('mail')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>Semua Agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentMails.map((mail) => (
              <div key={mail.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        mail.jenis === 'Masuk'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      Surat {mail.jenis}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{mail.noSurat}</span>
                  </div>
                  <p className="font-semibold text-slate-900 truncate">{mail.perihal}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span>{mail.pengirim}</span>
                    <span>·</span>
                    <span>{mail.tanggalSurat}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  {mail.jenis === 'Masuk' && (
                    <button
                      onClick={() =>
                        openPrintModal({
                          type: 'lembar-disposisi',
                          title: `Lembar Disposisi - ${mail.noSurat}`,
                          data: mail,
                        })
                      }
                      className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap"
                    >
                      Cetak Disposisi
                    </button>
                  )}
                  <span
                    className={`text-[10px] font-medium ${
                      mail.statusDisposisi === 'Sudah Didisposisi'
                        ? 'text-emerald-600'
                        : mail.statusDisposisi === 'Belum'
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {mail.statusDisposisi === 'Belum' ? 'Belum Didisposisi' : mail.statusDisposisi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Kuitansi SPP & Kas Terkini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Penerimaan Pembayaran Terakhir</h3>
              <p className="text-xs text-slate-500">Kuitansi SPP & dana kegiatan terverifikasi</p>
            </div>
            <button
              onClick={() => setCurrentView('finance')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>Buku Kas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{tx.namaSiswa}</span>
                    <span className="text-slate-400">({tx.kelas})</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {tx.jenisPembayaran} · {tx.bulan}
                  </p>
                  <p className="text-slate-400 text-[10px] font-mono">{tx.noKwitansi} · {tx.metode}</p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-bold font-mono text-slate-900">
                    Rp {tx.nominal.toLocaleString('id-ID')}
                  </div>
                  <button
                    onClick={() =>
                      openPrintModal({
                        type: 'kuitansi-spp',
                        title: `Kuitansi - ${tx.noKwitansi}`,
                        data: tx,
                      })
                    }
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium mt-1 inline-block"
                  >
                    Cetak Kuitansi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Panel */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-5">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
          {currentUser?.role === 'bendahara'
            ? 'Tindakan Cepat Pengelolaan Keuangan & SPP'
            : currentUser?.role === 'staf_tu'
            ? 'Tindakan Cepat Staf Administrasi & Tata Usaha'
            : currentUser?.role === 'kepsek'
            ? 'Tindakan Cepat Pimpinan & Evaluasi'
            : 'Tindakan Cepat Administrasi Terpadu'}
        </h3>
        
        {currentUser?.role === 'bendahara' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentView('finance')}
              className="p-3.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <Receipt className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">Entri Pembayaran SPP</p>
              <p className="text-[11px] text-slate-500">Cetak Kuitansi Resmi & Bukti Kas</p>
            </button>

            <button
              onClick={() => setCurrentView('finance')}
              className="p-3.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">Buku Kas Umum (BKU)</p>
              <p className="text-[11px] text-slate-500">Rekap Penerimaan & Pengeluaran Kas</p>
            </button>

            <button
              onClick={() => setCurrentView('students')}
              className="p-3.5 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">Cek Tunggakan & Data Siswa</p>
              <p className="text-[11px] text-slate-500">Validasi Nama & Kelas Pembayar</p>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setCurrentView('students')}
              className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <FileCheck className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">Cetak Surat Siswa</p>
              <p className="text-[11px] text-slate-500">Keterangan Aktif / Mutasi Siswa</p>
            </button>

            {currentUser?.role === 'staf_tu' ? (
              <button
                onClick={() => setCurrentView('inventory')}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <Boxes className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-slate-900">Sarana & Prasarana</p>
                <p className="text-[11px] text-slate-500">Inventaris Ruang & Barang</p>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('finance')}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-400 hover:shadow-xs transition-all text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <Receipt className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-slate-900">Entri Kas & SPP</p>
                <p className="text-[11px] text-slate-500">Cetak Kuitansi Resmi 2 Rangkap</p>
              </button>
            )}

            <button
              onClick={() => setCurrentView('mail')}
              className="p-3 bg-white border border-slate-200 rounded-lg hover:border-amber-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <PlusCircle className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">
                {currentUser?.role === 'kepsek' ? 'Disposisi Surat' : 'Registrasi Surat'}
              </p>
              <p className="text-[11px] text-slate-500">
                {currentUser?.role === 'kepsek' ? 'Arahan Tindak Lanjut' : 'Agenda Surat Masuk / Keluar'}
              </p>
            </button>

            <button
              onClick={() => setCurrentView('ai-letters')}
              className="p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-400 hover:shadow-xs transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-slate-900">Draf Naskah Dinas AI</p>
              <p className="text-[11px] text-slate-500">Surat Undangan, Tugas & Edaran</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
