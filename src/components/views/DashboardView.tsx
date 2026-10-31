import React from 'react';
import { 
  Inbox, 
  Send, 
  ArrowRightLeft, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Eye,
  Printer
} from 'lucide-react';
import { 
  SuratMasuk, 
  SuratKeluar, 
  MutasiSiswa, 
  SchoolProfile,
  ScanFileInfo
} from '../../types';

interface DashboardViewProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  mutasiList: MutasiSiswa[];
  profile: SchoolProfile;
  onNavigate: (view: string) => void;
  onOpenSuratMasukModal: () => void;
  onOpenSuratKeluarModal: () => void;
  onOpenMutasiModal: () => void;
  onOpenLightbox: (file: ScanFileInfo) => void;
  onPrintDocument: (type: 'sppd' | 'undangan' | 'panggilan') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  suratMasukList,
  suratKeluarList,
  mutasiList,
  profile,
  onNavigate,
  onOpenSuratMasukModal,
  onOpenSuratKeluarModal,
  onOpenMutasiModal,
  onOpenLightbox,
  onPrintDocument,
}) => {
  const pendingDisposisi = suratMasukList.filter(s => s.statusDisposisi === 'Belum').length;
  const pendingDapodik = mutasiList.filter(m => m.statusDapodik === 'Proses Tarik' || m.statusDapodik === 'Validasi Cabdis').length;
  const siswaMasukCount = mutasiList.filter(m => m.jenis === 'masuk').length;
  const siswaKeluarCount = mutasiList.filter(m => m.jenis === 'keluar').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-3">
            <span>Paket Pembaruan SI-TATAUSAHA Resmi Aktif</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Selamat Datang di Portal Tata Usaha
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Kelola persuratan dinas berlogo ganda, titi mangsa kedinasan terpisah, mutasi siswa terhubung alur operator Dapodik, dan cetak SPPD serta undangan dinas secara instan.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={onOpenSuratMasukModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan Surat Masuk</span>
            </button>
            <button
              onClick={onOpenSuratKeluarModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Registrasi Surat Keluar</span>
            </button>
            <button
              onClick={onOpenMutasiModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Entri Mutasi Siswa Dapodik</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Surat Masuk</span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {suratMasukList.length}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Belum Disposisi:</span>
            <span className={`font-semibold ${pendingDisposisi > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {pendingDisposisi} Surat
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Surat Keluar</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {suratKeluarList.length}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Arsip Digital Terunggah:</span>
            <span className="font-semibold text-indigo-600">
              {suratKeluarList.filter(s => !!s.scanFile).length} Berkas
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mutasi Siswa (Dapodik)</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {mutasiList.length}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Masuk / Keluar:</span>
            <span className="font-semibold text-slate-800">
              {siswaMasukCount} In · {siswaKeluarCount} Out
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Antrean Sinkronisasi</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {pendingDapodik}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Status Dapodik:</span>
            <span className="font-semibold text-emerald-600">
              {pendingDapodik === 0 ? 'Semua Sinkron' : 'Perlu Tindakan'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Template Generator Strip */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Generator Dokumen Resmi Baru (Standar Kedinasan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cetak instan lembar resmi dengan Kop ganda, titi mangsa presisi, dan tanda tangan pejabat.
            </p>
          </div>
          <button
            onClick={() => onNavigate('template')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Semua Template</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase mb-1">
                <FileText className="w-4 h-4" />
                <span>SPPD (Perjalanan Dinas)</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Surat Tugas &amp; Rincian Biaya Riil</h4>
              <p className="text-xs text-slate-500 mt-1">
                Lengkap 2 lembar (Surat Tugas + Lembar Rincian Biaya Uang Harian, Transport, Akomodasi).
              </p>
            </div>
            <button
              onClick={() => onPrintDocument('sppd')}
              className="mt-3 w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Cetak Draf SPPD</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase mb-1">
                <FileText className="w-4 h-4" />
                <span>Undangan Rapat GTK</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Rapat Dinas Guru &amp; Tenaga Kependidikan</h4>
              <p className="text-xs text-slate-500 mt-1">
                Lengkap dengan susunan agenda rapat, tempat, seragam dinas, dan catatan pimpinan.
              </p>
            </div>
            <button
              onClick={() => onPrintDocument('undangan')}
              className="mt-3 w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cetak Undangan Rapat</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase mb-1">
                <FileText className="w-4 h-4" />
                <span>Panggilan Orang Tua / Wali</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Konseling Siswa &amp; Bimbingan Karir</h4>
              <p className="text-xs text-slate-500 mt-1">
                Format resmi menghadap Guru BK / Wali Kelas dengan identitas siswa dan pokok pembahasan.
              </p>
            </div>
            <button
              onClick={() => onPrintDocument('panggilan')}
              className="mt-3 w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              <span>Cetak Surat Panggilan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 2 Tables (Surat Masuk Terkini & Mutasi Terkini) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surat Masuk Terkini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Surat Masuk Terkini
              </h3>
            </div>
            <button
              onClick={() => onNavigate('surat-masuk')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {suratMasukList.slice(0, 4).map(surat => (
              <div key={surat.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700">{surat.noAgenda}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      surat.statusDisposisi === 'Sudah' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {surat.statusDisposisi === 'Sudah' ? 'Terdisposisi' : 'Menunggu Disposisi'}
                    </span>
                    {surat.scanFile && (
                      <button
                        onClick={() => onOpenLightbox(surat.scanFile!)}
                        title="Buka Scan Fisik"
                        className="text-sky-600 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{surat.perihal}</h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Dari: {surat.asalSurat}</span>
                  <span>·</span>
                  <span>Diterima: {surat.tanggalDiterima}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mutasi Dapodik Terkini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Alur Mutasi Siswa Dapodik Terkini
              </h3>
            </div>
            <button
              onClick={() => onNavigate('mutasi')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {mutasiList.slice(0, 4).map(mut => (
              <div key={mut.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{mut.namaSiswa}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    mut.jenis === 'masuk' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {mut.jenis === 'masuk' ? '📥 Siswa Masuk' : '📤 Siswa Keluar'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono">
                  <span>NISN: {mut.nisn}</span>
                  <span>·</span>
                  <span>Kelas: {mut.kelas}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">
                    {mut.jenis === 'masuk' ? `Dari: ${mut.sekolahAsal}` : `Tujuan: ${mut.sekolahTujuan}`}
                  </span>
                  <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {mut.statusDapodik}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
