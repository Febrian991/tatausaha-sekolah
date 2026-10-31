import React, { useRef } from 'react';
import { SchoolProfile, SuratKedinasan, MutasiSiswa } from '../types/situ';
import { KopSuratResmi } from './KopSuratResmi';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatTanggalIndonesia } from '../utils/mockSituData';

interface SuratViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  suratData?: SuratKedinasan | null;
  mutasiData?: MutasiSiswa | null;
}

export const SuratViewerModal: React.FC<SuratViewerModalProps> = ({
  isOpen,
  onClose,
  profile,
  suratData,
  mutasiData
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const titiMangsaKota = suratData?.titiMangsa.kota || profile.titiMangsaKota;
  const titiMangsaTanggal = suratData?.titiMangsa.tanggal 
    ? formatTanggalIndonesia(suratData.titiMangsa.tanggal)
    : mutasiData?.tanggalSurat 
    ? formatTanggalIndonesia(mutasiData.tanggalSurat)
    : formatTanggalIndonesia(new Date().toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                PRATINJAU NASKAH DINAS RESMI (STANDAR A4/F4)
              </h3>
              <p className="text-[11px] text-slate-400">
                Format Tata Naskah Dinas Satuan Pendidikan Kemendikbudristek
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Print Surat</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview Container */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-4 sm:p-8 flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-md print-paper font-surat leading-relaxed text-[13px] sm:text-[14px]"
          >
            {/* Kop Surat Resmi (Menyesuaikan Mode Gambar Banner atau Teks + Logo Upload) */}
            <KopSuratResmi profile={profile} />

            {/* JIKA SURAT MUTASI SISWA DAPODIK */}
            {mutasiData ? (
              <div className="mt-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-base sm:text-lg font-bold tracking-wide underline uppercase">
                    SURAT KETERANGAN PINDAH SEKOLAH
                  </h2>
                  <div className="text-xs font-normal">
                    Nomor : {mutasiData.nomorSurat}
                  </div>
                </div>

                <p className="mt-4 text-justify">
                  Yang bertanda tangan di bawah ini Kepala {profile.namaSekolah}, {profile.kota}, Provinsi {profile.provinsi.replace('PEMERINTAH DAERAH PROVINSI ', '')}, dengan ini menerangkan bahwa:
                </p>

                <div className="pl-6 sm:pl-10 space-y-1.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">1. Nama Siswa</span>
                    <span className="col-span-8 font-bold">: {mutasiData.namaSiswa}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">2. Nomor Induk Siswa (NIS)</span>
                    <span className="col-span-8">: {mutasiData.nis}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">3. NISN</span>
                    <span className="col-span-8 font-semibold">: {mutasiData.nisn}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">4. Tempat, Tanggal Lahir</span>
                    <span className="col-span-8">: {mutasiData.tempatLahir}, {formatTanggalIndonesia(mutasiData.tanggalLahir)}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">5. Jenis Kelamin</span>
                    <span className="col-span-8">: {mutasiData.jenisKelamin}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">6. Tingkat / Kelas</span>
                    <span className="col-span-8">: {mutasiData.tingkatKelas} ({mutasiData.rombel})</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">7. Nama Orang Tua / Wali</span>
                    <span className="col-span-8">: {mutasiData.namaOrangTua}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">8. Pekerjaan Orang Tua</span>
                    <span className="col-span-8">: {mutasiData.pekerjaanOrangTua}</span>
                  </div>
                </div>

                <p className="text-justify mt-3">
                  Sesuai dengan surat permohonan kepindahan dari orang tua/wali siswa bersangkutan tertanggal {titiMangsaTanggal}, maka yang bersangkutan telah resmi mengajukan permohonan pindah sekolah ke:
                </p>

                <div className="pl-6 sm:pl-10 space-y-1.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 font-semibold">Sekolah Tujuan</span>
                    <span className="col-span-8 font-bold">: {mutasiData.sekolahAsalTujuan}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">Alasan Kepindahan</span>
                    <span className="col-span-8">: {mutasiData.alasanMutasi}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4">Status Data Dapodik</span>
                    <span className="col-span-8">: Dikeluarkan dari Sistem Dapodik Satuan Pendidikan</span>
                  </div>
                </div>

                <p className="text-justify mt-2">
                  Demikian Surat Keterangan Pindah Sekolah ini kami terbitkan dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>
            ) : suratData?.jenis === 'SPPD' ? (
              /* SPPD FORMAT */
              <div className="mt-5 space-y-4">
                <div className="text-center space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold tracking-wide underline uppercase">
                    SURAT PERINTAH PERJALANAN DINAS (SPPD)
                  </h2>
                  <div className="text-xs">
                    Nomor : {suratData.nomorSurat}
                  </div>
                </div>

                {/* SPPD Official 10-Row Table */}
                <table className="w-full border-collapse border border-black text-xs sm:text-[13px] mt-4">
                  <tbody>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center w-8">1.</td>
                      <td className="border border-black p-1.5 w-1/3">Pejabat Berwenang yang Memberi Perintah</td>
                      <td className="border border-black p-1.5">{profile.kepalaSekolah.gelar} {profile.namaSekolah}</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">2.</td>
                      <td className="border border-black p-1.5">Nama Pegawai yang Diperintahkan</td>
                      <td className="border border-black p-1.5 font-bold">
                        {suratData.konten.pegawaiBertugas?.[0]?.nama || 'Hendra Lesmana, M.Pd.'}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">3.</td>
                      <td className="border border-black p-1.5">a. Pangkat dan Golongan<br />b. Jabatan / Instansi</td>
                      <td className="border border-black p-1.5">
                        a. {suratData.konten.pegawaiBertugas?.[0]?.pangkat || 'Penata Muda Tk. I / III-b'}<br />
                        b. {suratData.konten.pegawaiBertugas?.[0]?.jabatan || 'Guru Mata Pelajaran Fisika'}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">4.</td>
                      <td className="border border-black p-1.5">Maksud Perjalanan Dinas</td>
                      <td className="border border-black p-1.5">
                        {suratData.konten.maksudPerjalanan || 'Mengikuti Bimbingan Teknis dan Pelatihan Pembina Olimpiade Sains Nasional (OSN)'}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">5.</td>
                      <td className="border border-black p-1.5">Alat Angkutan yang Digunakan</td>
                      <td className="border border-black p-1.5">{suratData.konten.alatAngkut || 'Kendaraan Umum / Kereta Api'}</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">6.</td>
                      <td className="border border-black p-1.5">a. Tempat Berangkat<br />b. Tempat Tujuan</td>
                      <td className="border border-black p-1.5">
                        a. {suratData.konten.tempatBerangkat || profile.kota}<br />
                        b. {suratData.konten.tempatTujuan || 'BBGP Provinsi Jawa Barat, Bandung Barat'}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">7.</td>
                      <td className="border border-black p-1.5">a. Lamanya Perjalanan Dinas<br />b. Tanggal Berangkat<br />c. Tanggal Kembali</td>
                      <td className="border border-black p-1.5">
                        a. {suratData.konten.lamaPerjalanan || '3 (Tiga) Hari'}<br />
                        b. {formatTanggalIndonesia(suratData.konten.tanggalBerangkat || '2026-11-03')}<br />
                        c. {formatTanggalIndonesia(suratData.konten.tanggalKembali || '2026-11-05')}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black p-1.5 text-center">8.</td>
                      <td className="border border-black p-1.5">Pembebanan Anggaran</td>
                      <td className="border border-black p-1.5">{suratData.konten.pembebananAnggaran || 'DPA Dana BOS / Biaya Operasional Sekolah Tahun Anggaran 2026'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : suratData?.jenis === 'TEMPLATE_CUSTOM' ? (
              /* FORMAT SURAT DARI TEMPLATE KUSTOM YANG DIUPLOAD */
              <div className="mt-5 space-y-4">
                {/* Header Bagian Surat */}
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <div className="flex gap-2">
                      <span className="w-16">Nomor</span>
                      <span>: {suratData.nomorSurat}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-16">Lampiran</span>
                      <span>: {suratData.lampiran || '-'}</span>
                    </div>
                    <div className="flex gap-2 font-semibold">
                      <span className="w-16">Hal</span>
                      <span>: {suratData.perihal}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span>{titiMangsaKota}, {titiMangsaTanggal}</span>
                  </div>
                </div>

                {/* Tujuan */}
                <div className="pt-2 text-xs sm:text-sm leading-snug">
                  <div>Kepada Yth.</div>
                  <div className="font-bold">
                    {suratData.konten.tujuanNama || 'Pihak Terkait'}
                  </div>
                  {suratData.konten.tujuanJabatan && (
                    <div>{suratData.konten.tujuanJabatan}</div>
                  )}
                  <div>di</div>
                  <div className="font-semibold">Tempat</div>
                </div>

                {/* Paragraf Pembuka Template Kustom */}
                {suratData.konten.customPembuka && (
                  <p className="text-justify indent-8 mt-3">
                    {suratData.konten.customPembuka}
                  </p>
                )}

                {/* Bagian Isi Format Surat yang Diunggah (Mempertahankan baris & spasi) */}
                <div className="pl-6 sm:pl-10 my-3 font-surat text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {suratData.konten.customIsi || suratData.konten.customTeksLengkap}
                </div>

                {/* Paragraf Penutup Template Kustom */}
                {suratData.konten.customPenutup && (
                  <p className="text-justify indent-8">
                    {suratData.konten.customPenutup}
                  </p>
                )}
              </div>
            ) : (
              /* FORMAT SURAT RESMI BIASA (UNDANGAN, PANGGILAN ORTU, KET AKTIF) */
              <div className="mt-5 space-y-4">
                {/* Header Bagian Surat: Nomor, Lampiran, Hal & Titi Mangsa */}
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <div className="flex gap-2">
                      <span className="w-16">Nomor</span>
                      <span>: {suratData?.nomorSurat || '005/092/SMAN1-TU/X/2026'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-16">Lampiran</span>
                      <span>: {suratData?.lampiran || '-'}</span>
                    </div>
                    <div className="flex gap-2 font-semibold">
                      <span className="w-16">Hal</span>
                      <span>: {suratData?.perihal || 'Undangan Rapat Dinas'}</span>
                    </div>
                  </div>

                  {/* Titi Mangsa Fleksibel di Kanan Atas */}
                  <div className="text-right">
                    <span>{titiMangsaKota}, {titiMangsaTanggal}</span>
                  </div>
                </div>

                {/* Tujuan Penerima Surat */}
                <div className="pt-2 text-xs sm:text-sm leading-snug">
                  <div>Kepada Yth.</div>
                  <div className="font-bold">
                    {suratData?.konten.tujuanNama || 'Bapak/Ibu Pendidik dan Tenaga Kependidikan'}
                  </div>
                  {suratData?.konten.tujuanJabatan && (
                    <div>{suratData.konten.tujuanJabatan}</div>
                  )}
                  <div>di</div>
                  <div className="font-semibold">Tempat</div>
                </div>

                {/* Paragraf Pembuka */}
                <p className="text-justify indent-8 mt-3">
                  Dengan hormat, sehubungan dengan agenda peningkatan mutu dan evaluasi pelaksanaan program sekolah semester berjalan pada {profile.namaSekolah}, bersama ini kami mengharapkan kehadiran Bapak/Ibu pada kegiatan yang akan dilaksanakan pada:
                </p>

                {/* Kotak Rincian Jadwal Acara */}
                <div className="pl-8 sm:pl-12 space-y-1 text-xs sm:text-sm my-2">
                  <div className="grid grid-cols-12">
                    <span className="col-span-3">Hari, Tanggal</span>
                    <span className="col-span-9 font-semibold">: {suratData?.konten.hariTanggalAcara || 'Senin, 02 November 2026'}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-3">Waktu</span>
                    <span className="col-span-9">: {suratData?.konten.waktuAcara || '08.30 WIB s.d. Selesai'}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-3">Tempat</span>
                    <span className="col-span-9">: {suratData?.konten.tempatAcara || 'Ruang Rapat Utama Lantai 2 / Aula Graha Kencana'}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-3">Agenda</span>
                    <span className="col-span-9 font-medium">: {suratData?.konten.agenda || 'Rapat Koordinasi Penilaian Akhir Semester (PAS) & Pembahasan Program Digitalisasi Tata Usaha'}</span>
                  </div>
                </div>

                {/* Paragraf Penutup */}
                <p className="text-justify indent-8">
                  Mengingat pentingnya agenda tersebut, kami mohon kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian, kehadiran, dan kerja sama yang baik, kami sampaikan terima kasih.
                </p>
              </div>
            )}

            {/* Kolom Tanda Tangan & Stempel Resmi Kedinasan */}
            <div className="mt-8 flex justify-end">
              <div className="w-72 text-center text-xs sm:text-sm relative space-y-1">
                <div>{profile.kepalaSekolah.gelar} {profile.namaSekolah},</div>

                {/* Tanda Tangan & Stempel Basah Digital Overlay */}
                <div className="relative h-24 flex items-center justify-center my-1">
                  {/* Stempel Basah Digital (Ungu kebiruan khas stempel sekolah dinas) */}
                  {profile.gunakanStempel && (
                    <div className="absolute -left-4 w-28 h-28 rounded-full border-2 border-purple-800/80 flex items-center justify-center p-1 pointer-events-none rotate-[-12deg] select-none">
                      <div className="w-full h-full rounded-full border border-purple-800/70 flex flex-col items-center justify-center text-[7px] text-purple-900 font-bold uppercase tracking-tight text-center leading-tight">
                        <span className="px-1 text-[6.5px]">DINAS PENDIDIKAN</span>
                        <span className="my-0.5 text-purple-900 font-extrabold text-[8px]">★ {profile.namaSekolah.slice(0, 14)} ★</span>
                        <span className="px-1 text-[6.5px]">{profile.kota.toUpperCase()}</span>
                      </div>
                    </div>
                  )}

                  {/* Tanda Tangan Digital */}
                  {profile.gunakanTtdDigital && (
                    <svg className="w-40 h-16 text-blue-950 stroke-current" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 45 C40 10, 60 70, 75 35 C90 10, 100 60, 120 40 C140 20, 150 50, 180 30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M40 55 C70 58, 130 52, 170 50" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Nama & NIP Pejabat */}
                <div className="font-bold underline text-sm tracking-wide">
                  {profile.kepalaSekolah.nama}
                </div>
                <div className="text-[12px]">{profile.kepalaSekolah.pangkat}</div>
                <div className="text-[12px] font-mono-data">NIP. {profile.kepalaSekolah.nip}</div>

                {/* Barcode / QR Verifikasi Keaslian Naskah Dinas */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[9px] text-slate-700 font-mono-data">
                  <div className="w-4 h-4 bg-slate-900 text-white flex items-center justify-center rounded-xs text-[7px] font-bold">QR</div>
                  <span>Terverifikasi Elektronik SI-TU / BSrE</span>
                </div>
              </div>
            </div>

            {/* Tembusan */}
            <div className="mt-6 pt-4 border-t border-slate-300 text-[11px] text-slate-700">
              <span className="font-bold block">Tembusan Yth:</span>
              <ol className="list-decimal pl-4 space-y-0.5">
                {suratData?.konten.customTembusan && suratData.konten.customTembusan.length > 0 ? (
                  suratData.konten.customTembusan.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))
                ) : (
                  <>
                    <li>Kepala Dinas Pendidikan Provinsi Jawa Barat</li>
                    <li>Kepala Cabang Dinas Pendidikan Wilayah VII</li>
                    <li>Ketua Komite {profile.namaSekolah}</li>
                    <li>Arsip Urusan Tata Usaha</li>
                  </>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
