import { SchoolProfile, MutasiSiswa, ArsipDigital, SuratKedinasan } from '../types/situ';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  provinsi: 'PEMERINTAH DAERAH PROVINSI JAWA BARAT',
  dinas: 'DINAS PENDIDIKAN',
  cabangDinas: 'CABANG DINAS PENDIDIKAN WILAYAH VII',
  namaSekolah: 'SMA NEGERI 1 TELADAN BANGSA',
  npsn: '20219876',
  nss: '301026001001',
  akreditasi: 'A (UNGGUL)',
  alamat: 'Jalan Pendidikan Nusantara No. 45, Kompleks Ki Hajar Dewantara',
  kota: 'Kota Bandung',
  kodePos: '40123',
  telepon: '(022) 7234567 / 0812-3456-7890',
  website: 'www.sman1teladanbangsa.sch.id',
  email: 'tatausaha@sman1teladanbangsa.sch.id',
  modeKop: 'TEKS_LOGO',
  kopBannerUrl: '',
  logoKiriUrl: '', // Will render Tut Wuri Handayani vector
  logoKananUrl: '', // Will render school emblem vector
  kepalaSekolah: {
    nama: 'Drs. H. Mulyono Hardjanto, M.Pd.',
    nip: '19680514 199303 1 004',
    pangkat: 'Pembina Utama Muda / IV-c',
    gelar: 'Kepala Sekolah'
  },
  kepalaTU: {
    nama: 'Siti Rahmawati, S.AP.',
    nip: '19820819 200801 2 006',
    pangkat: 'Penata Tk. I / III-d'
  },
  titiMangsaKota: 'Bandung',
  gunakanStempel: true,
  gunakanTtdDigital: true
};

export const INITIAL_CUSTOM_TEMPLATES = [
  {
    id: 'TPL-001',
    namaTemplate: 'Surat Permohonan Izin / Rekomendasi Kegiatan',
    kodeKlasifikasi: '421.3',
    perihalDefault: 'Permohonan Izin Tempat dan Dispensasi Kegiatan Siswa',
    pembuka: 'Dengan hormat, dalam rangka mengembangkan minat, bakat, dan prestasi peserta didik pada {{nama_sekolah}}, bersama ini kami mengajukan permohonan rekomendasi dan izin pelaksanaan kegiatan sebagai berikut:',
    formatIsi: `Nama Kegiatan   : {{nama_kegiatan}}
Hari, Tanggal   : {{hari_tanggal}}
Waktu           : {{waktu_pelaksanaan}}
Tempat Kegiatan : {{tempat_kegiatan}}
Peserta         : {{jumlah_peserta}} orang siswa perwakilan OSIS/MPK`,
    penutup: 'Demikian surat permohonan ini kami sampaikan, atas perhatian, perkenan, dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.',
    tembusanDefault: [
      'Kepala Cabang Dinas Pendidikan Wilayah VII',
      'Ketua Komite Sekolah',
      'Arsip Kearsipan TU'
    ],
    fileReferensiNama: 'Format_Rekomendasi_Kegiatan.docx',
    diuploadPada: '2026-10-30'
  },
  {
    id: 'TPL-002',
    namaTemplate: 'Surat Pemberitahuan Kalender & Libur Semester',
    kodeKlasifikasi: '421.2',
    perihalDefault: 'Pemberitahuan Pelaksanaan Ujian dan Libur Akhir Semester Ganjil',
    pembuka: 'Dengan hormat, berdasarkan Kalender Pendidikan Dinas Pendidikan Provinsi Jawa Barat Tahun Ajaran 2026/2027 serta hasil rapat dewan guru {{nama_sekolah}}, kami sampaikan informasi penting kepada Bapak/Ibu Orang Tua/Wali Siswa sebagai berikut:',
    formatIsi: `1. Pelaksanaan Penilaian Akhir Semester (PAS) Ganjil dilaksanakan pada tanggal {{tgl_mulai_pas}} s.d. {{tgl_selesai_pas}}.
2. Pengolahan nilai dan rapat pleno kelulusan/kenaikan semester pada {{tgl_rapat_pleno}}.
3. Pembagian Buku Laporan Hasil Belajar (Rapor) dilaksanakan pada {{tgl_rapor}}.
4. Libur akhir semester ganjil dimulai tanggal {{tgl_mulai_libur}} s.d. {{tgl_selesai_libur}}.
5. Kegiatan Belajar Mengajar (KBM) Semester Genap dimulai kembali pada {{tgl_masuk_genap}}.`,
    penutup: 'Kami mengharapkan bantuan Bapak/Ibu untuk terus mendampingi dan memantau kegiatan belajar putra/putri di rumah selama masa ujian dan liburan sekolah. Atas kerja samanya kami ucapkan terima kasih.',
    tembusanDefault: [
      'Ketua Komite Sekolah',
      'Pengawas Pembina Sekolah',
      'Arsip'
    ],
    fileReferensiNama: 'Format_Edaran_Libur_Semester.docx',
    diuploadPada: '2026-10-29'
  }
];


export const INITIAL_MUTASI_SISWA: MutasiSiswa[] = [
  {
    id: 'MUT-001',
    jenis: 'KELUAR',
    nomorSurat: '421.2/084/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-28',
    namaSiswa: 'Ahmad Faiz Al-Faruq',
    nisn: '0078129345',
    nis: '242510042',
    tingkatKelas: 'XI',
    rombel: 'XI MIPA 2',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Bandung',
    tanggalLahir: '2008-04-12',
    namaOrangTua: 'Bambang Supriyanto',
    pekerjaanOrangTua: 'PNS / ASN',
    sekolahAsalTujuan: 'SMA Negeri 3 Jakarta Pusat',
    alasanMutasi: 'Mengikuti mutasi tugas kedinasan orang tua ke Jakarta',
    statusDapodik: 'Sinkron Berhasil'
  },
  {
    id: 'MUT-002',
    jenis: 'MASUK',
    nomorSurat: '421.2/091/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-25',
    namaSiswa: 'Nadhira Putri Aulia',
    nisn: '0089234120',
    nis: '242510118',
    tingkatKelas: 'X',
    rombel: 'X-E3',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2009-08-21',
    namaOrangTua: 'Dr. Hendra Gunawan',
    pekerjaanOrangTua: 'Dokter Spesialis',
    sekolahAsalTujuan: 'SMA Negeri 5 Surabaya',
    alasanMutasi: 'Kepindahan domisili keluarga ke Kota Bandung',
    statusDapodik: 'Sinkron Berhasil'
  },
  {
    id: 'MUT-003',
    jenis: 'KELUAR',
    nomorSurat: '421.2/095/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-20',
    namaSiswa: 'Muhammad Rizky Pratama',
    nisn: '0067341289',
    nis: '232411089',
    tingkatKelas: 'XII',
    rombel: 'XII IPS 1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Cimahi',
    tanggalLahir: '2007-11-05',
    namaOrangTua: 'Ir. Dedi Suryadi',
    pekerjaanOrangTua: 'Wiraswasta',
    sekolahAsalTujuan: 'SMA Taruna Nusantara Magelang',
    alasanMutasi: 'Diterima melalui seleksi jalur prestasi khusus',
    statusDapodik: 'Sinkron Berhasil'
  },
  {
    id: 'MUT-004',
    jenis: 'MASUK',
    nomorSurat: '421.2/098/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-18',
    namaSiswa: 'Clarissa Zahra Maharani',
    nisn: '0087452319',
    nis: '242510156',
    tingkatKelas: 'X',
    rombel: 'X-E1',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '2009-02-14',
    namaOrangTua: 'Agus Purnomo, S.E.',
    pekerjaanOrangTua: 'Karyawan BUMN',
    sekolahAsalTujuan: 'SMA Negeri 1 Teladan Yogyakarta',
    alasanMutasi: 'Mendekat ke kediaman nenek / urusan keluarga',
    statusDapodik: 'Menunggu Tarik Data'
  }
];

export const INITIAL_ARSIP_DIGITAL: ArsipDigital[] = [
  {
    id: 'ARS-2026-001',
    jenis: 'MASUK',
    nomorAgenda: 'AGD/2026/X/0142',
    nomorSurat: '420/8921-Disdik/Set.2026',
    tanggalSurat: '2026-10-26',
    tanggalTerimaKirim: '2026-10-27',
    pengirimPenerima: 'Dinas Pendidikan Provinsi Jawa Barat',
    perihal: 'Instruksi Pelaksanaan Asesmen Bakat Minat (ABM) Kelas XII Tahun 2026',
    kategori: 'Dinas Pendidikan',
    disposisiPimpinan: 'Kepala Sekolah: Wakasek Kurikulum dan Tim Proktor agar segera menyusun jadwal sesi serta sosialisasi ke siswa.',
    statusTindakLanjut: 'Dalam Proses',
    namaFileScan: 'Scan_Surat_Dinas_ABM_2026.pdf',
    ukuranFile: '1.4 MB',
    catatanPetugas: 'Diterima via kurir dinas & portal e-Office Disdik'
  },
  {
    id: 'ARS-2026-002',
    jenis: 'KELUAR',
    nomorAgenda: 'AGD/2026/X/0143',
    nomorSurat: '005/092/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-28',
    tanggalTerimaKirim: '2026-10-28',
    pengirimPenerima: 'Seluruh Pendidik & Tenaga Kependidikan (GTK)',
    perihal: 'Undangan Rapat Koordinasi Persiapan Penilaian Akhir Semester Ganjil',
    kategori: 'Kepegawaian',
    disposisiPimpinan: 'Disetujui untuk diedarkan kepada seluruh GTK.',
    statusTindakLanjut: 'Selesai',
    namaFileScan: 'Undangan_Rapat_GTK_PAS_Ganjil.pdf',
    ukuranFile: '420 KB',
    catatanPetugas: 'Surat fisik ditempel di mading guru dan versi PDF dibagikan di grup WhatsApp dinas'
  },
  {
    id: 'ARS-2026-003',
    jenis: 'MASUK',
    nomorAgenda: 'AGD/2026/X/0144',
    nomorSurat: 'B-342/Kemenag.02/PP.00/10/2026',
    tanggalSurat: '2026-10-24',
    tanggalTerimaKirim: '2026-10-25',
    pengirimPenerima: 'Kantor Kementerian Agama Kota Bandung',
    perihal: 'Pemberitahuan Pendataan Guru Pendidikan Agama Islam (PAI) Semester Ganjil',
    kategori: 'Kemenag',
    disposisiPimpinan: 'Teruskan ke Guru PAI dan Koordinator SIAGA/SIMPATIKA.',
    statusTindakLanjut: 'Selesai',
    namaFileScan: 'Edaran_Kemenag_Pendataan_PAI.pdf',
    ukuranFile: '890 KB',
    catatanPetugas: 'Telah diserahkan ke Pak Ruslan (Guru PAI)'
  },
  {
    id: 'ARS-2026-004',
    jenis: 'KELUAR',
    nomorAgenda: 'AGD/2026/X/0145',
    nomorSurat: '090/094/SMAN1-TU/X/2026',
    tanggalSurat: '2026-10-29',
    tanggalTerimaKirim: '2026-10-29',
    pengirimPenerima: 'Bpk. Hendra Lesmana, M.Pd. (Guru Fisika)',
    perihal: 'Surat Tugas & SPPD Pelatihan Olimpiade Sains Nasional (OSN) di BBGP Jabar',
    kategori: 'Kepegawaian',
    disposisiPimpinan: 'Diterbitkan SPPD 3 hari kerja dengan biaya APBD/BOS.',
    statusTindakLanjut: 'Selesai',
    namaFileScan: 'SPPD_Surat_Tugas_BBGP.pdf',
    ukuranFile: '680 KB',
    catatanPetugas: 'Berkas SPPD rangkap 3 telah diserahkan beserta lembar visum'
  }
];

export const formatTanggalIndonesia = (dateString: string): string => {
  if (!dateString) return '';
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const thn = parts[0];
    const bln = bulan[parseInt(parts[1], 10) - 1] || parts[1];
    const tgl = parseInt(parts[2], 10);
    return `${tgl} ${bln} ${thn}`;
  }
  return dateString;
};
