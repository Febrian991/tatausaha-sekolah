import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Laptop,
  Wifi,
  Settings,
  Users,
  Briefcase,
  Receipt,
  Mail,
  Boxes,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const UserGuideModal: React.FC = () => {
  const { isGuideOpen, setIsGuideOpen, schoolProfile } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isGuideOpen) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopyText = () => {
    const doc = document.getElementById('guide-printable-document');
    if (doc) {
      navigator.clipboard.writeText(doc.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 modal-backdrop-print-hide">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in">
        {/* Action Header Bar (Hidden during printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Buku Panduan Lengkap SI-TATAUSAHA (Bisa Diunduh PDF)</h3>
              <p className="text-xs text-slate-300">Panduan Teknis Instalasi & Pengoperasian dari Awal Sampai Akhir</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Container (Simulated Formal A4 Document) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            id="guide-printable-document"
            className="bg-white w-full max-w-[210mm] p-8 sm:p-12 shadow-md rounded-lg text-slate-900 text-xs sm:text-sm leading-relaxed select-text"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {/* Title / Cover Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-8 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-600 font-sans font-bold">
                BUKU PETUNJUK TEKNIS DAN PENGOPERASIAN APLIKASI
              </p>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase mt-1 tracking-tight text-slate-950 font-sans">
                SI-TATAUSAHA SEKOLAH
              </h1>
              <p className="text-xs font-medium text-slate-700 font-sans mt-1">
                Sistem Informasi Manajemen Administrasi Tata Usaha, Persuratan, Kesiswaan, Kepegawaian, Kas SPP, dan Sarpras
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-slate-100 rounded text-[11px] font-sans font-semibold text-slate-800">
                Edisi Standar Operasional Prosedur (SOP) Sekolah Indonesia · Tahun Ajaran 2026/2027
              </div>
            </div>

            {/* Daftar Isi Singkat */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded font-sans text-xs">
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">DAFTAR ISI PANDUAN</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-slate-700">
                <div><strong>BAB I.</strong> Gambaran Umum & Prasyarat Sistem</div>
                <div><strong>BAB II.</strong> Pemasangan di Komputer Sekolah (Localhost Gratis)</div>
                <div><strong>BAB III.</strong> Akses Bersama Melalui Wi-Fi / Jaringan LAN</div>
                <div><strong>BAB IV.</strong> Pasang di Cloud 24 Jam Gratis (Render - Ramah Pemula)</div>
                <div><strong>BAB V.</strong> Pengaturan Identitas Sekolah & Kop Surat</div>
                <div><strong>BAB VI.</strong> Panduan Penggunaan Modul-Modul Utama</div>
                <div><strong>BAB VII.</strong> Pencadangan (Backup) & Pemulihan (Restore)</div>
                <div><strong>BAB VIII.</strong> Solusi Masalah / Troubleshooting</div>
              </div>
            </div>

            {/* BAB I */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB I. GAMBARAN UMUM & PRASYARAT SISTEM
              </h2>
              <p className="text-justify indent-6">
                <strong>SI-TATAUSAHA</strong> adalah aplikasi web manajemen administrasi sekolah modern yang dirancang khusus untuk mempermudah dan mendigitalkan seluruh tugas rutin staf Tata Usaha (TU), Bendahara, dan Kepala Sekolah. Aplikasi ini mencakup pencatatan buku induk siswa, agenda surat masuk & keluar, lembar disposisi, kuitansi kas/SPP 2 rangkap, inventaris sarana prasarana, serta generator draf naskah dinas resmi bertenaga kecerdasan buatan (AI).
              </p>
              <div className="bg-slate-50 border-l-4 border-slate-700 p-3 my-2 text-xs font-sans">
                <strong>Spesifikasi Perangkat yang Dibutuhkan (Sangat Ringan):</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                  <li><strong>Sistem Operasi:</strong> Windows 10/11, macOS, atau Linux (laptop atau PC kantor standar).</li>
                  <li><strong>Perangkat Lunak:</strong> Node.js (versi 18 LTS atau lebih baru) — unduh gratis di <em>nodejs.org</em>.</li>
                  <li><strong>Peramban Web:</strong> Google Chrome, Microsoft Edge, atau Mozilla Firefox versi terkini.</li>
                  <li><strong>Koneksi Internet:</strong> Opsional. Aplikasi dapat berjalan 100% offline tanpa kuota internet saat menggunakan metode Localhost / LAN.</li>
                </ul>
              </div>
            </section>

            {/* BAB II */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB II. LANGKAH PEMASANGAN DI KOMPUTER SEKOLAH (100% GRATIS)
              </h2>
              <p className="text-justify indent-6">
                Untuk menjalankan aplikasi secara gratis tanpa sewa server bulanan di komputer ruang Tata Usaha, ikuti langkah berurutan di bawah ini:
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 1: Pasang Node.js di Komputer</p>
                  <p className="text-slate-600 mt-0.5">
                    Kunjungi situs resmi <strong>https://nodejs.org</strong>, unduh installer versi LTS (Recommended for Most Users), lalu pasang (Next sampai selesai) di komputer Anda.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 2: Ekstrak Folder Proyek Aplikasi</p>
                  <p className="text-slate-600 mt-0.5">
                    Letakkan folder proyek aplikasi ini di komputer Anda (misal di folder <code>C:\SI-TATAUSAHA</code>).
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 3: Buka Command Prompt / Terminal & Pasang Dependensi</p>
                  <p className="text-slate-600 mt-0.5">Buka Command Prompt (CMD) di folder aplikasi, lalu ketik perintah:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded mt-1 font-mono text-[11px]">npm install</pre>
                  <p className="text-slate-500 text-[10px] mt-1">*Langkah ini hanya dilakukan satu kali di awal.</p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 4: Jalankan Aplikasi</p>
                  <p className="text-slate-600 mt-0.5">Setelah instalasi selesai, ketik perintah berikut untuk menyalakan aplikasi:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded mt-1 font-mono text-[11px]">npm run dev</pre>
                  <p className="text-slate-600 mt-1">
                    Saat muncul pesan <em>"Server Tata Usaha Sekolah is running on port 3000"</em>, buka peramban Chrome/Edge lalu ketik:
                  </p>
                  <p className="font-bold font-mono text-blue-700 bg-blue-50 p-1.5 rounded mt-1 text-center text-sm">
                    http://localhost:3000
                  </p>
                </div>
              </div>
            </section>

            {/* BAB III */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB III. AKSES BERSAMA MELALUI WI-FI / JARINGAN LAN SEKOLAH
              </h2>
              <p className="text-justify indent-6">
                Agar laptop Kepala Sekolah, Bendahara, atau staf lain di sekolah dapat membuka aplikasi ini secara bersamaan tanpa perlu datang ke komputer utama:
              </p>

              <ol className="list-decimal list-inside space-y-1.5 font-sans text-xs text-slate-700">
                <li>Pastikan semua laptop/komputer terhubung ke <strong>Wi-Fi atau kabel LAN sekolah yang sama</strong>.</li>
                <li>
                  Di komputer utama yang menjalankan aplikasi, cari alamat IP-nya:
                  <ul className="list-disc list-inside ml-4 mt-0.5 text-slate-600">
                    <li>Buka Command Prompt (CMD), ketik: <code>ipconfig</code>, lalu lihat baris <strong>IPv4 Address</strong> (misal: <code>192.168.1.50</code>).</li>
                  </ul>
                </li>
                <li>
                  Di laptop Kepala Sekolah atau staf lain, buka browser lalu ketik alamat IP tersebut disertai port <code>:3000</code>:
                  <div className="bg-slate-100 p-1.5 rounded font-mono font-bold text-center text-slate-900 my-1">
                    http://192.168.1.50:3000
                  </div>
                </li>
                <li>Aplikasi akan langsung terbuka di laptop mereka secara mulus tanpa memakan kuota internet!</li>
              </ol>
            </section>

            {/* BAB IV */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB IV. CARA MEMASANG DI CLOUD 24 JAM GRATIS (RENDER.COM - RAMAH PEMULA)
              </h2>
              <p className="text-justify indent-6">
                Jika Anda ingin aplikasi ini <strong>bisa diakses 24 jam nonstop dari HP atau laptop di rumah</strong> tanpa mengharuskan komputer sekolah menyala terus, Anda dapat memanfaatkan layanan <strong>Render.com (Paket Free Tier 100% Gratis)</strong>.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-600 p-3 my-2 text-xs font-sans text-amber-900">
                <strong>Catatan untuk Pemula:</strong> Langkah ini sangat mudah dan tidak membutuhkan koding rumit. Cukup buat akun gratis lalu sambungkan. Namun jika Anda masih ragu, gunakan <strong>BAB II (Komputer Sekolah)</strong> terlebih dahulu selama 1-2 minggu agar terbiasa.
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 1: Daftar Akun Gratis di GitHub & Render</p>
                  <p className="text-slate-600 mt-0.5">
                    1. Buka <strong>https://github.com</strong> dan buat akun gratis.<br />
                    2. Buka <strong>https://render.com</strong>, klik <em>Sign Up</em> lalu pilih <em>Sign in with GitHub</em> (otomatis terhubung).
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 2: Unggah Folder Aplikasi ke GitHub</p>
                  <p className="text-slate-600 mt-0.5">
                    Di GitHub, klik tombol <strong>New Repository</strong>, beri nama misalnya <code>tatausaha-sekolah</code> (pilih <em>Private</em> jika ingin kode hanya dilihat oleh Anda), lalu unggah file proyek aplikasi Anda.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 3: Buat Web Service di Render.com</p>
                  <p className="text-slate-600 mt-0.5">
                    1. Di dashboard Render, klik tombol <strong>New +</strong> lalu pilih <strong>Web Service</strong>.<br />
                    2. Pilih repositori <code>tatausaha-sekolah</code> yang baru dibuat di GitHub.<br />
                    3. Pada kolom <strong>Build Command</strong>, masukkan: <code>npm install && npm run build</code><br />
                    4. Pada kolom <strong>Start Command</strong>, masukkan: <code>npm start</code><br />
                    5. Pilih paket <strong>Free (Gratis $0/month)</strong>.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">Langkah 4: Selesai! Dapatkan Tautan Online Resmi</p>
                  <p className="text-slate-600 mt-0.5">
                    Klik <strong>Deploy Web Service</strong>. Dalam 2-3 menit, Render akan memberikan tautan online gratis (misal: <code>https://tatausaha-sekolah.onrender.com</code>). Tautan ini bisa langsung dibagikan kepada Kepala Sekolah dan staf TU untuk diakses kapan saja dari rumah atau HP tanpa komputer sekolah harus menyala.
                  </p>
                </div>
              </div>
            </section>

            {/* BAB V */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB V. PENGATURAN IDENTITAS SEKOLAH & KOP SURAT RESMI
              </h2>
              <p className="text-justify indent-6">
                Langkah pertama sebelum mencetak surat atau kuitansi adalah mengatur identitas resmi sekolah Anda:
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded font-sans text-xs space-y-2">
                <p>1. Klik tombol <strong>"Kop Sekolah"</strong> pada menu navigasi samping atau bagian atas.</p>
                <p>2. Lengkapi formulir identitas:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5 text-slate-600">
                  <li><strong>Nama Sekolah</strong>: Contoh: SMK NEGERI 1 TELADAN BANGSA.</li>
                  <li><strong>Instansi Pembina</strong>: Dinas Pendidikan Provinsi / Kab / Kota.</li>
                  <li><strong>NPSN, NSS, & Akreditasi</strong>: Nomor registrasi sekolah.</li>
                  <li><strong>Alamat, Telepon, Email, Website</strong>: Kontak resmi tata usaha.</li>
                  <li><strong>Nama Kepala Sekolah & NIP</strong>: Pejabat penandatangan dokumen dinas.</li>
                  <li><strong>Nama Bendahara Sekolah & NIP</strong>: Pejabat penandatangan kuitansi SPP.</li>
                </ul>
                <p>3. Klik <strong>"Simpan Perubahan Kop"</strong>. Seluruh kop dokumen akan terbarui secara otomatis.</p>
              </div>
            </section>

            {/* BAB VI */}
            <section className="mb-8 space-y-4">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB VI. PANDUAN PENGGUNAAN MODUL-MODUL UTAMA
              </h2>

              <div className="space-y-4 font-sans text-xs">
                {/* 5.1 Buku Induk Siswa */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>5.1 Modul Buku Induk Siswa & Surat Keterangan Aktif</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li><strong>Menambah Siswa:</strong> Klik tombol biru <em>"Tambah Siswa"</em>, isi NISN, NIS, Nama Lengkap, TTL, Kelas, Jurusan, Nama Wali, No HP, dan Status.</li>
                    <li><strong>Cetak Surat Keterangan Siswa Aktif:</strong> Pada baris siswa yang bersangkutan, klik tombol <em>"Surat Aktif"</em>. Aplikasi akan menampilkan dokumen berformat Kop Surat Resmi yang siap dicetak langsung (Ctrl+P) untuk keperluan beasiswa atau urusan kedinasan.</li>
                    <li><strong>Ekspor CSV:</strong> Klik tombol <em>"Ekspor CSV"</em> untuk mengunduh rekap siswa ke Microsoft Excel.</li>
                  </ul>
                </div>

                {/* 5.2 Kepegawaian */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    <span>5.2 Modul Kepegawaian (PTK) & Surat Perintah Tugas</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li>Mencatat profil guru dan staf TU dengan data NIP, NUPTK, Pangkat/Golongan, Status (PNS/PPPK/Honorer), dan Mata Pelajaran.</li>
                    <li>Klik tombol <em>"Surat Tugas"</em> pada pegawai yang diinginkan untuk menerbitkan <strong>Surat Perintah Tugas Kedinasan</strong> resmi lengkap dengan dasar penugasan dan pengesahan Kepala Sekolah.</li>
                  </ul>
                </div>

                {/* 5.3 Kas & SPP */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5.3 Modul Kas & SPP (Kuitansi Resmi 2 Rangkap)</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li>Klik tombol <em>"Entri Pembayaran & Kuitansi"</em>.</li>
                    <li>Pilih siswa dari menu drop-down (data NISN dan Kelas akan terisi otomatis).</li>
                    <li>Pilih pos pembayaran (SPP Bulanan, Uang Seragam, DSP, Ujian), isi nominal dan metode bayar (Tunai, Transfer, QRIS).</li>
                    <li>Klik <em>"Terbitkan & Cetak Kuitansi"</em>. Aplikasi otomatis membuat kuitansi resmi 2 rangkap (Lembar Siswa dan Lembar Arsip Bendahara) lengkap dengan terbilang rupiah baku.</li>
                  </ul>
                </div>

                {/* 5.4 Persuratan */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>5.4 Modul Agenda Surat & Lembar Disposisi Kepala Sekolah</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li><strong>Surat Masuk:</strong> Registrasikan surat masuk dengan nomor surat dan tanggal terima. Nomor agenda diterbitkan otomatis.</li>
                    <li><strong>Lembar Disposisi:</strong> Klik <em>"+ Isi Disposisi"</em> untuk memasukkan arahan Kepala Sekolah (tujuan disposisi, instruksi kerja, batas waktu). Kemudian klik <em>"Cetak Disposisi"</em> untuk mencetak lembar disposisi fisik yang ditempelkan pada berkas surat dinas.</li>
                    <li><strong>Surat Keluar:</strong> Catat penomoran surat keluar agar nomor surat dinas tidak ganda (bentrok).</li>
                  </ul>
                </div>

                {/* 5.5 Sarpras */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-slate-700" />
                    <span>5.5 Modul Inventaris Sarana & Prasarana (Sarpras)</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li>Catat kode barang, nama aset (komputer, meja, proyektor, AC, genset), lokasi ruangan, jumlah, dan sumber dana (BOS, Komite, DAK).</li>
                    <li>Pantau status kondisi barang (Baik, Rusak Ringan, Rusak Berat) untuk acuan pengajuan perbaikan atau pengadaan baru.</li>
                  </ul>
                </div>

                {/* 5.6 Asisten Surat AI */}
                <div className="border border-slate-200 p-3 rounded">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>5.6 Asisten Penyusun Naskah Dinas AI</span>
                  </h3>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                    <li>Pilih jenis surat (Surat Panggilan Wali Murid, Undangan Rapat Komite, Surat Tugas, dsb.).</li>
                    <li>Pilih siswa atau guru terkait, masukkan tanggal dan catatan ringkas.</li>
                    <li>Klik <em>"Buat Draf Naskah Surat Sekarang"</em>. Model AI Gemini akan merumuskan kalimat resmi baku secara instan.</li>
                    <li>Draf dapat diedit sesuka hati dan dicetak langsung dengan Kop Surat Resmi.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* BAB VII */}
            <section className="mb-8 space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB VII. PENCADANGAN (BACKUP) & PEMULIHAN (RESTORE) DATA
              </h2>
              <p className="text-justify indent-6">
                Data aplikasi disimpan secara aman di peramban komputer lokal Anda. Untuk mencegah kehilangan data akibat komputer rusak atau install ulang:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs space-y-2">
                <div>
                  <strong>Cara Melakukan Backup (Disarankan 1 Minggu Sekali):</strong>
                  <p className="text-slate-600">Klik menu <strong>"Cadangan"</strong> di pojok kiri bawah, lalu klik tombol <em>"Unduh File Cadangan JSON"</em>. Simpan file <code>backup_tatausaha_...json</code> tersebut ke Flashdisk atau Google Drive.</p>
                </div>
                <div>
                  <strong>Cara Memulihkan Data (Restore):</strong>
                  <p className="text-slate-600">Jika Anda berpindah laptop atau data terhapus, buka menu <strong>"Cadangan"</strong>, klik <em>"Pilih File JSON & Pulihkan"</em>, lalu pilih file backup yang tersimpan. Seluruh data sekolah akan kembali utuh seketika.</p>
                </div>
              </div>
            </section>

            {/* BAB VIII */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase border-b border-slate-300 pb-1 text-slate-950 font-sans">
                BAB VIII. TANYA JAWAB UMUM & TROUBLESHOOTING
              </h2>
              <div className="space-y-2.5 font-sans text-xs">
                <div>
                  <p className="font-bold text-slate-900">Q: Apakah aplikasi ini aman dari kebocoran data?</p>
                  <p className="text-slate-600">A: Sangat aman, karena saat dijalankan secara lokal (localhost), data tersimpan di komputer sekolah sendiri dan tidak dikirim ke server luar mana pun.</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Q: Bagaimana cara mencetak dokumen ke printer atau menyimpannya sebagai file PDF?</p>
                  <p className="text-slate-600">A: Saat jendela pratinjau surat atau kuitansi muncul, klik tombol <em>"Cetak Sekarang (Ctrl+P)"</em>. Di dialog printer komputer Anda, pilih nama printer Anda untuk mencetak ke kertas, atau pilih <strong>"Save as PDF" (Simpan sebagai PDF)</strong> untuk menjadikannya berkas digital.</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Q: Bagaimana jika listrik padam saat sedang menginput data?</p>
                  <p className="text-slate-600">A: Aplikasi memiliki fitur sinkronisasi instan (*auto-save*). Data yang sudah Anda simpan tidak akan hilang.</p>
                </div>
              </div>
            </section>

            {/* Footer Lembar Pengesahan Panduan */}
            <div className="mt-12 pt-6 border-t border-slate-400 flex justify-between items-end text-xs font-sans">
              <div>
                <p className="font-bold">SI-TATAUSAHA SEKOLAH</p>
                <p className="text-slate-500">Versi 1.0.0 Stable Build</p>
              </div>
              <div className="text-right">
                <p>Disahkan untuk implementasi Tata Usaha</p>
                <p className="font-bold text-slate-900">{schoolProfile.namaSekolah}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
