import React, { useState } from 'react';
import { X, Printer, Settings2 } from 'lucide-react';
import { 
  SchoolProfile, 
  TitiMangsaPosition, 
  SPPDData, 
  UndanganRapatGTKData, 
  PanggilanOrtuData, 
  MutasiSiswa, 
  SuratMasuk 
} from '../../types';
import { KopSurat } from '../surat/KopSurat';

export type PrintDocumentType = 
  | { type: 'sppd'; data: SPPDData }
  | { type: 'undangan'; data: UndanganRapatGTKData }
  | { type: 'panggilan'; data: PanggilanOrtuData }
  | { type: 'mutasi'; data: MutasiSiswa }
  | { type: 'disposisi'; data: SuratMasuk };

interface PrintSuratModalProps {
  document: PrintDocumentType | null;
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSuratModal: React.FC<PrintSuratModalProps> = ({
  document,
  profile,
  isOpen,
  onClose,
}) => {
  const [titiMangsaPos, setTitiMangsaPos] = useState<TitiMangsaPosition>(profile.titiMangsaPosition);
  const [activeTabSPPD, setActiveTabSPPD] = useState<'lembar1' | 'lembar2'>('lembar1');

  if (!isOpen || !document) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getTerbilang = (total: number) => {
    // Standard friendly Indonesian terbilang helper
    return `Tiga Juta Delapan Ratus Sembilan Puluh Ribu Rupiah`;
  };

  const formattedToday = `${profile.kotaKabupaten.replace(/^(Kota|Kabupaten)\s+/i, '')}, ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Toolbar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-semibold">
                Pratinjau Cetak Surat Resmi Kedinasan (Format A4)
              </h2>
              <p className="text-xs text-slate-400">
                Kop surat resmi berlogo ganda, titi mangsa kedinasan, dan cap/ttd pejabat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Opsi Titi Mangsa Switcher */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs">
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300">Posisi Titi Mangsa:</span>
              <button
                type="button"
                onClick={() => setTitiMangsaPos('header_right')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  titiMangsaPos === 'header_right' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanan Atas
              </button>
              <button
                type="button"
                onClick={() => setTitiMangsaPos('above_signature')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  titiMangsaPos === 'above_signature' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Atas TTD
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-toolbar for SPPD (Lembar 1 vs Lembar 2) */}
        {document.type === 'sppd' && (
          <div className="no-print bg-slate-200 border-b border-slate-300 px-6 py-2 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-700">Pilih Halaman SPPD:</span>
            <button
              onClick={() => setActiveTabSPPD('lembar1')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTabSPPD === 'lembar1' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lembar 1: Surat Perintah Tugas &amp; SPPD
            </button>
            <button
              onClick={() => setActiveTabSPPD('lembar2')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTabSPPD === 'lembar2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lembar 2: Rincian Perhitungan Biaya Riil
            </button>
          </div>
        )}

        {/* Document Printable Viewport (White A4 Paper Simulator) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-300/60">
          <div className="print-area w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-2xl rounded-xs flex flex-col justify-between font-surat">
            
            {/* DOCUMENT 1: SPPD */}
            {document.type === 'sppd' && (
              <div>
                <KopSurat
                  profile={profile}
                  overrideTitiMangsaPos={titiMangsaPos}
                  nomorSurat={document.data.noSuratTugas}
                />

                {activeTabSPPD === 'lembar1' ? (
                  <div>
                    <div className="text-center my-4">
                      <h2 className="text-base font-bold tracking-wider uppercase underline">
                        SURAT PERINTAH TUGAS
                      </h2>
                      <p className="text-xs">Nomor: {document.data.noSuratTugas}</p>
                    </div>

                    <div className="text-xs leading-relaxed space-y-4 my-6">
                      <div className="grid grid-cols-[100px_10px_1fr] items-start">
                        <span className="font-semibold">Dasar Tugas</span>
                        <span>:</span>
                        <span>{document.data.dasarTugas}</span>
                      </div>

                      <div className="text-center font-bold tracking-wide my-4 uppercase">
                        MEMERINTAHKAN:
                      </div>

                      <div className="space-y-1.5 pl-2">
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Kepada Nama</span>
                          <span>:</span>
                          <span className="font-bold">{document.data.namaPegawai}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>NIP</span>
                          <span>:</span>
                          <span>{document.data.nip}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Pangkat / Golongan</span>
                          <span>:</span>
                          <span>{document.data.pangkatGol}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Jabatan</span>
                          <span>:</span>
                          <span>{document.data.jabatan}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Tingkat Biaya</span>
                          <span>:</span>
                          <span>{document.data.tingkatBiaya}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pl-2 pt-2 border-t border-slate-200">
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Untuk Maksud</span>
                          <span>:</span>
                          <span className="font-medium">{document.data.maksudPerjalanan}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Tempat Berangkat</span>
                          <span>:</span>
                          <span>{document.data.tempatBerangkat}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Tempat Tujuan</span>
                          <span>:</span>
                          <span className="font-semibold">{document.data.tempatTujuan}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Lamanya Tugas</span>
                          <span>:</span>
                          <span>{document.data.lamaHari} (tiga) hari kerja</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Tanggal Pelaksanaan</span>
                          <span>:</span>
                          <span>{document.data.tglBerangkat} s.d. {document.data.tglKembali}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Alat Angkutan</span>
                          <span>:</span>
                          <span>{document.data.alatAngkut}</span>
                        </div>
                        <div className="grid grid-cols-[140px_10px_1fr]">
                          <span>Pembebanan Anggaran</span>
                          <span>:</span>
                          <span>{document.data.pembebananAnggaran}</span>
                        </div>
                      </div>

                      <p className="pt-2 text-justify">
                        Demikian Surat Tugas ini diberikan kepada yang bersangkutan untuk dilaksanakan dengan penuh rasa tanggung jawab dan setelah selesai segera membuat laporan tertulis.
                      </p>
                    </div>

                    {/* TTD Pejabat */}
                    <div className="flex justify-end mt-12 text-xs">
                      <div className="w-64 text-center">
                        {titiMangsaPos === 'above_signature' && (
                          <p className="mb-1 font-medium">{formattedToday}</p>
                        )}
                        <p className="font-bold">Kepala Sekolah,</p>
                        <div className="h-20" />
                        <p className="font-bold underline">{profile.namaKepalaSekolah}</p>
                        <p>NIP. {profile.nipKepalaSekolah}</p>
                        <p className="text-[11px] text-gray-700">{profile.pangkatKepalaSekolah}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center my-4">
                      <h2 className="text-base font-bold tracking-wider uppercase underline">
                        RINCIAN PERHITUNGAN BIAYA PERJALANAN DINAS (RIIL)
                      </h2>
                      <p className="text-xs">Lampiran SPPD Nomor: {document.data.noSPPD}</p>
                    </div>

                    <table className="w-full text-xs border-collapse border border-black my-6">
                      <thead>
                        <tr className="bg-gray-100 font-bold text-center">
                          <th className="border border-black p-2 w-10">No</th>
                          <th className="border border-black p-2 text-left">Perincian Biaya</th>
                          <th className="border border-black p-2 w-20">Volume</th>
                          <th className="border border-black p-2 w-28 text-right">Harga Satuan</th>
                          <th className="border border-black p-2 w-32 text-right">Jumlah Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.data.rincianBiaya.map((item, idx) => (
                          <tr key={item.id}>
                            <td className="border border-black p-2 text-center">{idx + 1}</td>
                            <td className="border border-black p-2">{item.uraian}</td>
                            <td className="border border-black p-2 text-center">{item.volume} {item.satuan}</td>
                            <td className="border border-black p-2 text-right tabular-nums">{formatRupiah(item.hargaSatuan)}</td>
                            <td className="border border-black p-2 text-right font-medium tabular-nums">{formatRupiah(item.total)}</td>
                          </tr>
                        ))}
                        <tr className="font-bold bg-gray-50">
                          <td colSpan={4} className="border border-black p-2 text-right uppercase">
                            Jumlah Total Pengeluaran
                          </td>
                          <td className="border border-black p-2 text-right tabular-nums">
                            {formatRupiah(document.data.rincianBiaya.reduce((acc, curr) => acc + curr.total, 0))}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="text-xs p-2.5 border border-black bg-gray-50 italic mb-8">
                      <strong>Terbilang:</strong> {getTerbilang(document.data.rincianBiaya.reduce((acc, curr) => acc + curr.total, 0))}
                    </div>

                    <div className="grid grid-cols-2 text-xs gap-8 pt-4">
                      <div className="text-center">
                        <p>Telah menerima jumlah uang sebesar tersebut di atas</p>
                        <p className="font-bold mt-1">Yang Menerima,</p>
                        <div className="h-16" />
                        <p className="font-bold underline">{document.data.namaPegawai}</p>
                        <p>NIP. {document.data.nip}</p>
                      </div>

                      <div className="text-center">
                        {titiMangsaPos === 'above_signature' && (
                          <p className="mb-1 font-medium">{formattedToday}</p>
                        )}
                        <p className="font-bold">Lunas dibayar,</p>
                        <p className="font-semibold">Bendahara Pengeluaran,</p>
                        <div className="h-14" />
                        <p className="font-bold underline">{document.data.bendaharaPengeluaran.split('(')[0]}</p>
                        <p>{document.data.bendaharaPengeluaran.match(/\((.*?)\)/)?.[1] || 'NIP. Bendahara'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENT 2: UNDANGAN RAPAT DINAS GTK */}
            {document.type === 'undangan' && (
              <div>
                <KopSurat
                  profile={profile}
                  overrideTitiMangsaPos={titiMangsaPos}
                  nomorSurat={document.data.noSurat}
                  sifat={document.data.sifat}
                  lampiran={document.data.lampiran}
                  perihal={document.data.perihal}
                  tujuanPenerima={document.data.peserta}
                />

                <div className="text-xs leading-relaxed space-y-4 my-6">
                  <p>Dengan hormat,</p>
                  <p className="text-justify indent-8">
                    Dalam rangka koordinasi pelaksanaan tugas pokok dan fungsi, serta menyamakan persepsi guna meningkatkan mutu layanan pendidikan, dengan ini kami mengundang Bapak/Ibu Guru dan Tenaga Kependidikan untuk hadir dalam Rapat Dinas yang akan dilaksanakan pada:
                  </p>

                  <div className="pl-8 space-y-1.5">
                    <div className="grid grid-cols-[130px_10px_1fr]">
                      <span>Hari / Tanggal</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.tanggalRapat}</span>
                    </div>
                    <div className="grid grid-cols-[130px_10px_1fr]">
                      <span>Waktu / Pukul</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.waktuMulai} s.d. {document.data.waktuSelesai}</span>
                    </div>
                    <div className="grid grid-cols-[130px_10px_1fr]">
                      <span>Tempat</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.tempatRapat}</span>
                    </div>
                    <div className="grid grid-cols-[130px_10px_1fr]">
                      <span>Pakaian / Seragam</span>
                      <span>:</span>
                      <span>{document.data.dressCode}</span>
                    </div>
                    <div className="grid grid-cols-[130px_10px_1fr] items-start">
                      <span>Pimpinan Rapat</span>
                      <span>:</span>
                      <span className="font-bold">{document.data.pimpinanRapat}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold mb-1">Agenda Pembahasan Rapat:</p>
                    <ol className="list-decimal pl-6 space-y-1">
                      {document.data.agenda.map((ag, i) => (
                        <li key={i} className="text-justify">{ag}</li>
                      ))}
                    </ol>
                  </div>

                  <p className="text-justify indent-8 pt-2">
                    {document.data.catatanKhusus} Atas perhatian, kedisiplinan, dan kerja sama yang baik dari Bapak/Ibu sekalian, kami sampaikan terima kasih.
                  </p>
                </div>

                {/* TTD Pejabat */}
                <div className="flex justify-end mt-12 text-xs">
                  <div className="w-64 text-center">
                    {titiMangsaPos === 'above_signature' && (
                      <p className="mb-1 font-medium">{formattedToday}</p>
                    )}
                    <p className="font-bold">Kepala Sekolah,</p>
                    <div className="h-20" />
                    <p className="font-bold underline">{profile.namaKepalaSekolah}</p>
                    <p>NIP. {profile.nipKepalaSekolah}</p>
                    <p className="text-[11px] text-gray-700">{profile.pangkatKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 3: PANGGILAN ORANG TUA / WALI */}
            {document.type === 'panggilan' && (
              <div>
                <KopSurat
                  profile={profile}
                  overrideTitiMangsaPos={titiMangsaPos}
                  nomorSurat={document.data.noSurat}
                  sifat={document.data.sifat}
                  lampiran={document.data.lampiran}
                  perihal={document.data.perihal}
                  tujuanPenerima={document.data.namaOrtu}
                />

                <div className="text-xs leading-relaxed space-y-4 my-6">
                  <p>Dengan hormat,</p>
                  <p className="text-justify indent-8">
                    Sehubungan dengan perkembangan proses belajar mengajar serta kedisiplinan peserta didik di sekolah, melalui surat ini kami mengundang Bapak/Ibu Orang Tua / Wali dari:
                  </p>

                  <div className="pl-8 space-y-1.5 p-3 bg-gray-50 border border-gray-200">
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>Nama Peserta Didik</span>
                      <span>:</span>
                      <span className="font-bold uppercase">{document.data.namaSiswa}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>NISN</span>
                      <span>:</span>
                      <span className="font-mono">{document.data.nisn}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>Kelas / Rombel</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.kelas}</span>
                    </div>
                  </div>

                  <p className="text-justify indent-8">
                    Untuk hadir berkonsultasi di sekolah yang dijadwalkan pada:
                  </p>

                  <div className="pl-8 space-y-1.5">
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>Hari / Tanggal</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.hariTanggal}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>Waktu / Pukul</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.waktu}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr]">
                      <span>Tempat</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.tempat}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr] items-start">
                      <span>Menghadap Kepada</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.menghadapKepada}</span>
                    </div>
                    <div className="grid grid-cols-[140px_10px_1fr] items-start">
                      <span>Keperluan</span>
                      <span>:</span>
                      <span className="font-medium text-justify">{document.data.keperluan}</span>
                    </div>
                  </div>

                  <p className="text-justify indent-8 pt-2">
                    {document.data.catatanWaliKelas} Demi kelancaran dan keberhasilan studi ananda, kehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.
                  </p>
                </div>

                {/* TTD Pejabat & Guru BK */}
                <div className="grid grid-cols-2 text-xs gap-8 mt-12">
                  <div className="text-center">
                    <p className="font-bold">Mengetahui,</p>
                    <p className="font-semibold">Guru Bimbingan Konseling / Wali Kelas,</p>
                    <div className="h-20" />
                    <p className="font-bold underline">Dra. Nur Indah Lestari</p>
                    <p>NIP. 19820419 200801 2 006</p>
                  </div>

                  <div className="text-center">
                    {titiMangsaPos === 'above_signature' && (
                      <p className="mb-1 font-medium">{formattedToday}</p>
                    )}
                    <p className="font-bold">Kepala Sekolah,</p>
                    <div className="h-20" />
                    <p className="font-bold underline">{profile.namaKepalaSekolah}</p>
                    <p>NIP. {profile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 4: MUTASI SISWA (MASUK ATAU KELUAR) */}
            {document.type === 'mutasi' && (
              <div>
                <KopSurat
                  profile={profile}
                  overrideTitiMangsaPos={titiMangsaPos}
                  nomorSurat={document.data.nomorSuratRekomendasi}
                />

                <div className="text-center my-4">
                  <h2 className="text-base font-bold tracking-wider uppercase underline">
                    {document.data.jenis === 'masuk'
                      ? 'SURAT KETERANGAN MENERIMA MUTASI SISWA'
                      : 'SURAT KETERANGAN PINDAH SEKOLAH'}
                  </h2>
                  <p className="text-xs">Nomor: {document.data.nomorSuratRekomendasi}</p>
                </div>

                <div className="text-xs leading-relaxed space-y-4 my-6">
                  <p className="text-justify indent-8">
                    Yang bertanda tangan di bawah ini, Kepala {profile.namaSekolah}, menerangkan bahwa:
                  </p>

                  <div className="pl-8 space-y-1.5 p-3 bg-gray-50 border border-gray-200">
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>Nama Siswa</span>
                      <span>:</span>
                      <span className="font-bold uppercase">{document.data.namaSiswa}</span>
                    </div>
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>Nomor Induk Siswa (NIS)</span>
                      <span>:</span>
                      <span className="font-mono">{document.data.nis || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>NISN</span>
                      <span>:</span>
                      <span className="font-mono font-bold">{document.data.nisn}</span>
                    </div>
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>Jenis Kelamin</span>
                      <span>:</span>
                      <span>{document.data.jenisKelamin}</span>
                    </div>
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>Tempat, Tanggal Lahir</span>
                      <span>:</span>
                      <span>{document.data.tempatTanggalLahir || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[160px_10px_1fr]">
                      <span>Tingkat / Kelas</span>
                      <span>:</span>
                      <span className="font-semibold">{document.data.kelas}</span>
                    </div>
                  </div>

                  {document.data.jenis === 'masuk' ? (
                    <div className="space-y-2">
                      <p className="text-justify indent-8">
                        Berdasarkan surat permohonan orang tua/wali dan surat rekomendasi perpindahan dari sekolah asal, yang bersangkutan telah <strong>DITERIMA</strong> sebagai peserta didik pindahan di {profile.namaSekolah} terhitung sejak tanggal <strong>{document.data.tanggalMutasi}</strong>, yang berasal dari:
                      </p>
                      <div className="pl-8 space-y-1">
                        <div className="grid grid-cols-[160px_10px_1fr]">
                          <span>Sekolah Asal</span>
                          <span>:</span>
                          <span className="font-bold">{document.data.sekolahAsal}</span>
                        </div>
                        <div className="grid grid-cols-[160px_10px_1fr]">
                          <span>Alasan Mutasi</span>
                          <span>:</span>
                          <span>{document.data.alasanMutasi}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-justify indent-8">
                        Telah mengajukan pindah sekolah atas permohonan orang tua/wali murid dengan alasan <strong>{document.data.alasanMutasi}</strong>, menuju ke satuan pendidikan:
                      </p>
                      <div className="pl-8 space-y-1">
                        <div className="grid grid-cols-[160px_10px_1fr]">
                          <span>Sekolah Tujuan</span>
                          <span>:</span>
                          <span className="font-bold">{document.data.sekolahTujuan}</span>
                        </div>
                        <div className="grid grid-cols-[160px_10px_1fr]">
                          <span>Tanggal Efektif Keluar</span>
                          <span>:</span>
                          <span>{document.data.tanggalMutasi}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-2 border border-black bg-gray-50 text-[11px] leading-normal">
                    <strong>Catatan Administrasi Dapodik:</strong> Siswa ini terdaftar dalam alur perpindahan data peserta didik secara resmi (Status: {document.data.statusDapodik}) pada sistem pendataan Kementerian Pendidikan Dasar dan Menengah RI.
                  </div>

                  <p className="text-justify indent-8 pt-2">
                    Demikian surat keterangan mutasi ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
                  </p>
                </div>

                {/* TTD Pejabat */}
                <div className="flex justify-end mt-12 text-xs">
                  <div className="w-64 text-center">
                    {titiMangsaPos === 'above_signature' && (
                      <p className="mb-1 font-medium">{formattedToday}</p>
                    )}
                    <p className="font-bold">Kepala Sekolah,</p>
                    <div className="h-20" />
                    <p className="font-bold underline">{profile.namaKepalaSekolah}</p>
                    <p>NIP. {profile.nipKepalaSekolah}</p>
                    <p className="text-[11px] text-gray-700">{profile.pangkatKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 5: LEMBAR DISPOSISI */}
            {document.type === 'disposisi' && (
              <div>
                <KopSurat
                  profile={profile}
                  overrideTitiMangsaPos={titiMangsaPos}
                />

                <div className="text-center my-3">
                  <h2 className="text-base font-bold tracking-wider uppercase underline">
                    LEMBAR DISPOSISI RESMI
                  </h2>
                  <p className="text-xs">TATA USAHA &amp; KEPALA SEKOLAH</p>
                </div>

                <div className="border border-black text-xs my-4 divide-y divide-black">
                  <div className="grid grid-cols-2 divide-x divide-black p-2">
                    <div>
                      <span className="font-semibold text-gray-700">Nomor Agenda: </span>
                      <span className="font-mono font-bold">{document.data.noAgenda}</span>
                    </div>
                    <div className="pl-2">
                      <span className="font-semibold text-gray-700">Tingkat Klasifikasi: </span>
                      <span className="font-bold">{document.data.klasifikasi}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-black p-2">
                    <div>
                      <span className="font-semibold text-gray-700">Tanggal Diterima: </span>
                      <span>{document.data.tanggalDiterima}</span>
                    </div>
                    <div className="pl-2">
                      <span className="font-semibold text-gray-700">Tanggal Surat: </span>
                      <span>{document.data.tanggalSurat}</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <span className="font-semibold text-gray-700">Nomor Surat: </span>
                    <span className="font-bold">{document.data.noSurat}</span>
                  </div>

                  <div className="p-2">
                    <span className="font-semibold text-gray-700">Asal Instansi: </span>
                    <span>{document.data.asalSurat}</span>
                  </div>

                  <div className="p-2">
                    <span className="font-semibold text-gray-700">Perihal / Isi Ringkas: </span>
                    <p className="mt-1 font-medium">{document.data.perihal}</p>
                  </div>

                  <div className="p-2 min-h-[90px]">
                    <span className="font-bold text-gray-800 uppercase block mb-1">
                      Diteruskan Kepada Yth:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {document.data.disposisi?.tujuanDisposisi.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 font-semibold">
                          <span>[v]</span>
                          <span>{t}</span>
                        </div>
                      )) || <p className="text-gray-400">Belum ada tujuan disposisi</p>}
                    </div>
                  </div>

                  <div className="p-2 min-h-[90px]">
                    <span className="font-bold text-gray-800 uppercase block mb-1">
                      Petunjuk / Instruksi Disposisi:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {document.data.disposisi?.instruksi.map((ins, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 font-semibold">
                          <span>[v]</span>
                          <span>{ins}</span>
                        </div>
                      )) || <p className="text-gray-400">Belum ada instruksi</p>}
                    </div>
                  </div>

                  <div className="p-2 min-h-[70px]">
                    <span className="font-bold text-gray-800 uppercase block mb-1">
                      Catatan Tambahan Pimpinan:
                    </span>
                    <p className="italic text-gray-800">
                      {document.data.disposisi?.catatanPimpinan || 'Segera tindak lanjuti sesuai pedoman kedinasan.'}
                    </p>
                  </div>
                </div>

                {/* TTD Pejabat */}
                <div className="flex justify-end mt-8 text-xs">
                  <div className="w-64 text-center">
                    {titiMangsaPos === 'above_signature' && (
                      <p className="mb-1 font-medium">{formattedToday}</p>
                    )}
                    <p className="font-bold">Kepala Sekolah,</p>
                    <div className="h-16" />
                    <p className="font-bold underline">{profile.namaKepalaSekolah}</p>
                    <p>NIP. {profile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer watermark note */}
            <div className="text-[9px] text-gray-400 text-center border-t border-gray-200 pt-2 mt-8">
              Dicetak secara digital melalui Sistem Informasi Tata Usaha (SI-TU) Satuan Pendidikan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
