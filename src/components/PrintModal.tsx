import React, { useRef } from 'react';
import { Printer, X, Download, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

// Helper function to format Indonesian currency words (terbilang)
function terbilangRupiah(nominal: number): string {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];
  if (nominal < 12) return bilangan[nominal];
  if (nominal < 20) return terbilangRupiah(nominal - 10) + ' Belas';
  if (nominal < 100) return terbilangRupiah(Math.floor(nominal / 10)) + ' Puluh ' + terbilangRupiah(nominal % 10);
  if (nominal < 200) return 'Seratus ' + terbilangRupiah(nominal - 100);
  if (nominal < 1000) return terbilangRupiah(Math.floor(nominal / 100)) + ' Ratus ' + terbilangRupiah(nominal % 100);
  if (nominal < 2000) return 'Seribu ' + terbilangRupiah(nominal - 1000);
  if (nominal < 1000000) return terbilangRupiah(Math.floor(nominal / 1000)) + ' Ribu ' + terbilangRupiah(nominal % 1000);
  if (nominal < 1000000000) return terbilangRupiah(Math.floor(nominal / 1000000)) + ' Juta ' + terbilangRupiah(nominal % 1000000);
  return nominal.toString();
}

export const PrintModal: React.FC = () => {
  const { printDoc, closePrintModal, schoolProfile } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!printDoc) return null;

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const docElement = document.getElementById('printable-document');
    if (docElement) {
      navigator.clipboard.writeText(docElement.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderOfficialLetterhead = () => (
    <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-6 text-center select-text">
      <div className="flex items-center justify-between gap-4 mb-1">
        {/* Logo / Lambang Tut Wuri Handayani / Lambang Sekolah */}
        <div className="w-16 h-16 rounded border border-slate-300 flex items-center justify-center p-1 shrink-0">
          <div className="text-center font-bold text-[10px] leading-tight text-slate-700">
            KEMDIKBUD<br />RISET
          </div>
        </div>

        <div className="flex-1 text-center">
          <p className="text-[11px] font-semibold text-slate-800 tracking-wide uppercase leading-tight whitespace-pre-line">
            {schoolProfile.dinasPendidikan}
          </p>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight uppercase mt-0.5">
            {schoolProfile.namaSekolah}
          </h1>
          <p className="text-[11px] text-slate-600 font-medium">
            NPSN: <span className="font-mono">{schoolProfile.npsn}</span> | NSS: <span className="font-mono">{schoolProfile.nss}</span> | Akreditasi: {schoolProfile.akreditasi}
          </p>
          <p className="text-[10px] text-slate-600 leading-tight mt-0.5">
            {schoolProfile.alamat}, Kel. {schoolProfile.kelurahanDesa}, Kec. {schoolProfile.kecamatan}, {schoolProfile.kotaKabupaten} - {schoolProfile.provinsi} {schoolProfile.kodePos}
          </p>
          <p className="text-[10px] text-slate-600 leading-tight">
            Telp: {schoolProfile.telepon} · Pos-el: {schoolProfile.email} · Laman: {schoolProfile.website}
          </p>
        </div>

        {/* Logo Kanan / Lambang Daerah */}
        <div className="w-16 h-16 rounded border border-slate-300 flex items-center justify-center p-1 shrink-0">
          <div className="text-center font-bold text-[10px] leading-tight text-slate-700">
            PROVINSI<br />JABAR
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop-print-hide">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 no-print shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{printDoc.title}</h3>
            <p className="text-xs text-slate-500">Pratinjau Dokumen Resmi Standar A4 Cetak</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Ctrl+P)</span>
            </button>
            <button
              onClick={closePrintModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Sheet (Simulated A4 paper) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-200/60 flex justify-center">
          <div
            id="printable-document"
            className="bg-white w-full max-w-[210mm] min-h-[297mm] p-10 shadow-lg text-slate-900 text-sm leading-relaxed select-text"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {/* Kop Surat Sekolah Resmi */}
            {renderOfficialLetterhead()}

            {/* Document Dynamic Body */}
            {printDoc.type === 'surat-keterangan-aktif' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-bold underline tracking-wider uppercase">
                    SURAT KETERANGAN SISWA AKTIF
                  </h2>
                  <p className="text-xs mt-1 font-sans">
                    Nomor: 421.3 / {String(printDoc.data?.id || '018').replace(/\D/g, '').padEnd(3, '0')} / {schoolProfile.namaSekolah.replace(/\s+/g, '')} / X / 2026
                  </p>
                </div>

                <p className="mb-4 text-justify indent-8">
                  Yang bertanda tangan di bawah ini, Kepala {schoolProfile.namaSekolah}, dengan ini menerangkan dengan sesungguhnya bahwa:
                </p>

                <table className="w-full mb-4 text-xs font-sans">
                  <tbody>
                    <tr className="border-b border-transparent">
                      <td className="w-44 py-1 font-medium">Nama Lengkap</td>
                      <td className="w-4 py-1">:</td>
                      <td className="py-1 font-bold">{printDoc.data?.nama}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Nomor Induk Siswa Nasional (NISN)</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-mono">{printDoc.data?.nisn}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Nomor Induk Siswa (NIS)</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-mono">{printDoc.data?.nis}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Kelas / Jurusan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.kelas} ({printDoc.data?.jurusan})</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Tempat, Tanggal Lahir</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.tempatLahir}, {printDoc.data?.tanggalLahir}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Nama Orang Tua / Wali</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.namaWali}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Alamat Tempat Tinggal</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.alamat}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mb-4 text-justify indent-8">
                  Adalah benar-benar peserta didik yang terdaftar dan tercatat masih AKTIF mengikuti proses kegiatan belajar mengajar di {schoolProfile.namaSekolah} pada Semester Ganjil Tahun Pelajaran 2026/2027 serta berkelakuan baik.
                </p>

                <p className="mb-6 text-justify indent-8">
                  Surat keterangan ini diberikan atas permohonan yang bersangkutan untuk keperluan: <strong>Pengurusan Beasiswa / Kelengkapan Administrasi Kedinasan</strong>.
                </p>

                <p className="mb-8 text-justify">
                  Demikian surat keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>

                {/* Tanda Tangan */}
                <div className="flex justify-between items-end mt-12 text-xs">
                  <div className="w-48 text-center">
                    <p className="mb-16">Mengetahui,<br />Kepala Tata Usaha,</p>
                    <p className="font-bold underline">{schoolProfile.kepalaTU}</p>
                    <p>NIP. {schoolProfile.nipKepalaTU}</p>
                  </div>

                  <div className="w-56 text-center">
                    <p className="mb-1">{schoolProfile.kotaKabupaten}, {todayFormatted}</p>
                    <p className="mb-16">Kepala Sekolah,</p>
                    <p className="font-bold underline">{schoolProfile.kepalaSekolah}</p>
                    <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'kuitansi-spp' && (
              <div>
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold underline uppercase">
                    BUKTI PEMBAYARAN / KUITANSI RESMI TATA USAHA
                  </h2>
                  <p className="text-xs font-mono font-sans mt-0.5">
                    No. Kwitansi: {printDoc.data?.noKwitansi}
                  </p>
                </div>

                <div className="border border-slate-400 p-4 rounded text-xs font-sans space-y-2 mb-6">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-slate-600 font-medium">Telah Diterima Dari</div>
                    <div className="col-span-3 font-bold text-slate-900">{printDoc.data?.namaSiswa} (NISN: {printDoc.data?.nisn})</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-slate-600 font-medium">Kelas / Tingkat</div>
                    <div className="col-span-3">{printDoc.data?.kelas}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-slate-600 font-medium">Uang Sebesar</div>
                    <div className="col-span-3 font-bold italic bg-slate-100 p-1.5 rounded">
                      " # {terbilangRupiah(printDoc.data?.nominal || 0)} Rupiah # "
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-slate-600 font-medium">Untuk Pembayaran</div>
                    <div className="col-span-3">
                      <strong>{printDoc.data?.jenisPembayaran}</strong> Periode: <strong>{printDoc.data?.bulan}</strong>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-slate-600 font-medium">Metode Pembayaran</div>
                    <div className="col-span-3">{printDoc.data?.metode} - Status: LUNAS</div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 border border-slate-300 p-3 rounded mb-8 font-sans">
                  <span className="text-sm font-semibold">Jumlah Total Diterima:</span>
                  <span className="text-lg font-bold font-mono text-blue-900">
                    Rp {(printDoc.data?.nominal || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between items-end text-xs font-sans">
                  <div className="text-center w-48">
                    <p className="mb-14">Penyetor / Siswa,</p>
                    <p className="font-bold underline">{printDoc.data?.namaSiswa}</p>
                  </div>
                  <div className="text-center w-56">
                    <p className="mb-1">{schoolProfile.kotaKabupaten}, {printDoc.data?.tanggalBayar || todayFormatted}</p>
                    <p className="mb-14">Petugas Bendahara Tata Usaha,</p>
                    <p className="font-bold underline">{printDoc.data?.petugasTU || schoolProfile.bendahara}</p>
                    <p className="text-[10px] text-slate-500">Cap Lunas Tata Usaha Sekolah</p>
                  </div>
                </div>

                {/* Perforated separator for duplicate copy */}
                <div className="my-8 border-b-2 border-dashed border-slate-400 text-center relative">
                  <span className="bg-white px-3 text-[10px] text-slate-400 absolute top-[-8px] left-1/2 -translate-x-1/2">
                    Gunting di sini untuk Arsip Bendahara Sekolah
                  </span>
                </div>

                {/* Ringkasan Rangkap 2 */}
                <div className="text-[11px] text-slate-600 font-sans">
                  <p className="font-semibold text-slate-800">[LEMBAR ARSIP TATA USAHA] - No: {printDoc.data?.noKwitansi}</p>
                  <p>Siswa: {printDoc.data?.namaSiswa} ({printDoc.data?.kelas}) · Nominal: Rp {(printDoc.data?.nominal || 0).toLocaleString('id-ID')} · Tgl: {printDoc.data?.tanggalBayar}</p>
                </div>
              </div>
            )}

            {printDoc.type === 'lembar-disposisi' && (
              <div>
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold underline uppercase">LEMBAR DISPOSISI KEPALA SEKOLAH</h2>
                  <p className="text-xs font-sans mt-0.5">Tata Kelola Persuratan dan Kearsipan Dinas</p>
                </div>

                <table className="w-full border-collapse border border-slate-800 text-xs font-sans mb-4">
                  <tbody>
                    <tr>
                      <td className="border border-slate-800 p-2 font-semibold w-1/4 bg-slate-50">Surat Dari</td>
                      <td className="border border-slate-800 p-2 w-1/4">{printDoc.data?.pengirim}</td>
                      <td className="border border-slate-800 p-2 font-semibold w-1/4 bg-slate-50">Diterima Tanggal</td>
                      <td className="border border-slate-800 p-2 w-1/4">{printDoc.data?.tanggalDiterima}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-semibold bg-slate-50">No. Surat</td>
                      <td className="border border-slate-800 p-2 font-mono">{printDoc.data?.noSurat}</td>
                      <td className="border border-slate-800 p-2 font-semibold bg-slate-50">No. Agenda</td>
                      <td className="border border-slate-800 p-2 font-mono">{printDoc.data?.noAgenda}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Tanggal Surat</td>
                      <td className="border border-slate-800 p-2">{printDoc.data?.tanggalSurat}</td>
                      <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Sifat Surat</td>
                      <td className="border border-slate-800 p-2 font-bold text-red-700">Sangat Segera / Penting</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 font-semibold bg-slate-50">Perihal</td>
                      <td colSpan={3} className="border border-slate-800 p-2 font-medium">{printDoc.data?.perihal}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Disposisi Kepada & Instruksi */}
                <table className="w-full border-collapse border border-slate-800 text-xs font-sans mb-6">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-800 p-2 text-left w-1/2">Diteruskan Kepada Yth:</th>
                      <th className="border border-slate-800 p-2 text-left w-1/2">Instruksi / Arahan Kepala Sekolah:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-800 p-3 align-top space-y-1.5">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Wakasek Kurikulum</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Wakasek Kesiswaan</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Wakasek Sarana & Prasarana</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Wakasek Hubungan Industri (BKK)</label>
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Kepala Tata Usaha (KTU)</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Bendahara Sekolah</label>
                        <p className="mt-2 text-slate-700 font-bold">Catatan Tujuan: {printDoc.data?.disposisiKepada || '-'}</p>
                      </td>
                      <td className="border border-slate-800 p-3 align-top space-y-1.5">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Tindak lanjuti segera</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Hadiri / Wakili</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Siapkan tanggapan / jawaban</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Koordinasikan dengan bagian terkait</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Arsipkan</label>
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded font-medium">
                          Arahan Khusus: {printDoc.data?.instruksiDisposisi || 'Mohon ditindaklanjuti sesuai instruksi kerja dinas.'}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end text-xs font-sans">
                  <div className="w-56 text-center">
                    <p className="mb-1">{schoolProfile.kotaKabupaten}, {todayFormatted}</p>
                    <p className="mb-14">Kepala Sekolah,</p>
                    <p className="font-bold underline">{schoolProfile.kepalaSekolah}</p>
                    <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'surat-tugas' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-base font-bold underline uppercase">SURAT PERINTAH TUGAS DINAS</h2>
                  <p className="text-xs font-sans mt-0.5">
                    Nomor: 800 / 094 / SMKN1-TB / X / 2026
                  </p>
                </div>

                <p className="mb-4 text-justify indent-8">
                  Berdasarkan Program Kerja Sekolah dan Agenda Peningkatan Kompetensi Pendidik/Tenaga Kependidikan, Kepala {schoolProfile.namaSekolah} dengan ini menugaskan kepada:
                </p>

                <table className="w-full mb-4 text-xs font-sans">
                  <tbody>
                    <tr>
                      <td className="w-40 py-1 font-medium">Nama Lengkap</td>
                      <td className="w-4 py-1">:</td>
                      <td className="py-1 font-bold">{printDoc.data?.nama}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">NIP / NUPTK</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-mono">{printDoc.data?.nip || '-'} / {printDoc.data?.nuptk || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Pangkat / Golongan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.golongan || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Jabatan Kedinasan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.jabatan}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Unit Kerja</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{printDoc.data?.unitKerja}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mb-4 text-justify">
                  <p className="font-bold mb-1">Untuk Melaksanakan Tugas:</p>
                  <p className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs">
                    {printDoc.data?.tugasDetail || 'Mengikuti Rapat Koordinasi dan Bimbingan Teknis Standarisasi Administrasi Sekolah Tingkat Provinsi Jawa Barat.'}
                  </p>
                </div>

                <p className="mb-8 text-justify indent-8">
                  Demikian surat perintah tugas ini diberikan untuk dilaksanakan dengan penuh rasa tanggung jawab dan setelah selesai melaksanakan tugas segera menyampaikan laporan tertulis kepada pimpinan.
                </p>

                <div className="flex justify-end text-xs font-sans">
                  <div className="w-56 text-center">
                    <p className="mb-1">{schoolProfile.kotaKabupaten}, {todayFormatted}</p>
                    <p className="mb-16">Kepala Sekolah,</p>
                    <p className="font-bold underline">{schoolProfile.kepalaSekolah}</p>
                    <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {printDoc.type === 'kustom-ai' && (
              <div className="text-justify font-sans text-xs leading-relaxed whitespace-pre-wrap">
                {printDoc.customBody || 'Draf surat sedang disusun...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
