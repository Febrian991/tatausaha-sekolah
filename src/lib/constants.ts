import { User, Siswa, MutasiSiswa, SuratDinas, TransaksiKeuangan, NotificationItem, SchoolProfile } from '../types';

export const OFFICIAL_ACCOUNTS: { [key: string]: { user: User; pass: string } } = {
  operator: {
    user: {
      id: 'USR-001',
      username: 'operator',
      nama: 'Bambang Supriyanto, S.Kom.',
      nip: '19850614 201001 1 012',
      role: 'operator',
      jabatan: 'Operator Sekolah & Super Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'operator123'
  },
  admin: {
    user: {
      id: 'USR-001',
      username: 'operator',
      nama: 'Bambang Supriyanto, S.Kom.',
      nip: '19850614 201001 1 012',
      role: 'operator',
      jabatan: 'Operator Sekolah & Super Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'operator123'
  },
  tu: {
    user: {
      id: 'USR-002',
      username: 'tu',
      nama: 'Siti Nurhaliza, A.Md.',
      nip: '19910423 201402 2 005',
      role: 'tu',
      jabatan: 'Staff Tata Usaha & Urusan Kesiswaan',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'tu123'
  },
  admin_tu: {
    user: {
      id: 'USR-002',
      username: 'tu',
      nama: 'Siti Nurhaliza, A.Md.',
      nip: '19910423 201402 2 005',
      role: 'tu',
      jabatan: 'Staff Tata Usaha & Urusan Kesiswaan',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'tu123'
  },
  bendahara: {
    user: {
      id: 'USR-003',
      username: 'bendahara',
      nama: 'Dra. Hj. Wahyuningsih',
      nip: '19790812 200501 2 009',
      role: 'bendahara',
      jabatan: 'Bendahara Pengeluaran BOS & Komite',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'bendahara123'
  },
  kepsek: {
    user: {
      id: 'USR-004',
      username: 'kepsek',
      nama: 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
      nip: '19680315 199303 1 003',
      role: 'kepsek',
      jabatan: 'Kepala Sekolah Pembina Tingkat I',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    pass: 'kepsek123'
  }
};

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'SMA NEGERI 1 HARAPAN BANGSA',
  npsn: '20214589',
  alamat: 'Jl. Pendidikan Nasional No. 45',
  desaKelurahan: 'Mekarjaya',
  kecamatan: 'Sukamaju',
  kabupatenKota: 'Kota Bandung',
  provinsi: 'Jawa Barat',
  kodePos: '40124',
  noTelepon: '(022) 7234891',
  email: 'info@sman1harapanbangsa.sch.id',
  website: 'https://sman1harapanbangsa.sch.id',
  namaKepsek: 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
  nipKepsek: '19680315 199303 1 003'
};

export const INITIAL_SISWA: Siswa[] = [
  {
    id: 'SIS-001',
    nis: '23241001',
    nisn: '0067823910',
    nama: 'Ahmad Faiz Al-Ghifari',
    jenisKelamin: 'L',
    kelas: 'X',
    rombel: 'X-MIPA-1',
    tempatLahir: 'Bandung',
    tanggalLahir: '2008-04-12',
    namaAyah: 'Deden Koswara',
    namaIbu: 'Rina Marlina',
    alamat: 'Jl. Cikutra Barat No. 12B RT 03/05 Bandung',
    noTelp: '081234567890',
    status: 'Aktif',
    tahunMasuk: '2023'
  },
  {
    id: 'SIS-002',
    nis: '23241002',
    nisn: '0068945201',
    nama: 'Anindya Putri Rahayu',
    jenisKelamin: 'P',
    kelas: 'X',
    rombel: 'X-MIPA-1',
    tempatLahir: 'Cimahi',
    tanggalLahir: '2008-07-25',
    namaAyah: 'Budi Santoso',
    namaIbu: 'Dewi Lestari',
    alamat: 'Komp. Graha Indah Blok C2 No. 8',
    noTelp: '081398765432',
    status: 'Aktif',
    tahunMasuk: '2023'
  },
  {
    id: 'SIS-003',
    nis: '22231015',
    nisn: '0054321980',
    nama: 'Dimas Arya Pratama',
    jenisKelamin: 'L',
    kelas: 'XI',
    rombel: 'XI-IPS-2',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-02-18',
    namaAyah: 'Hendra Pratama',
    namaIbu: 'Susilowati',
    alamat: 'Jl. Riau No. 110 Bandung',
    noTelp: '085712349900',
    status: 'Aktif',
    tahunMasuk: '2022'
  },
  {
    id: 'SIS-004',
    nis: '21221045',
    nisn: '0049102834',
    nama: 'Gita Permatasari',
    jenisKelamin: 'P',
    kelas: 'XII',
    rombel: 'XII-MIPA-3',
    tempatLahir: 'Bandung',
    tanggalLahir: '2006-09-03',
    namaAyah: 'Asep Saepudin',
    namaIbu: 'Enung Nurhayati',
    alamat: 'Jl. Terusan Buah Batu No. 40',
    noTelp: '082199887766',
    status: 'Aktif',
    tahunMasuk: '2021'
  },
  {
    id: 'SIS-005',
    nis: '23241088',
    nisn: '0071239845',
    nama: 'Rizky Ramadhani Syahputra',
    jenisKelamin: 'L',
    kelas: 'X',
    rombel: 'X-MIPA-2',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2008-01-14',
    namaAyah: 'Agus Syahputra',
    namaIbu: 'Ratna Juwita',
    alamat: 'Jl. Gegerkalong Tengah No. 19',
    noTelp: '081909871122',
    status: 'Aktif',
    tahunMasuk: '2023'
  }
];

export const INITIAL_MUTASI: MutasiSiswa[] = [
  {
    id: 'MUT-001',
    jenis: 'Masuk',
    tanggal: '2026-10-28',
    nisn: '0071239845',
    namaSiswa: 'Rizky Ramadhani Syahputra',
    kelas: 'X-MIPA-2',
    sekolahAsalTujuan: 'SMA Negeri 5 Surabaya',
    alasan: 'Mengikuti kepindahan tugas kedinasan orang tua ke Kodam III/Siliwangi',
    statusApproval: 'Menunggu Persetujuan Operator',
    statusDapodik: 'Belum Sinkron',
    diajukanOleh: 'Siti Nurhaliza, A.Md. (Tata Usaha)',
    tanggalPengajuan: '2026-10-28 09:15',
    noSuratMutasi: '421.3/089/Disdik/X/2026'
  },
  {
    id: 'MUT-002',
    jenis: 'Keluar',
    tanggal: '2026-10-15',
    nisn: '0069911223',
    namaSiswa: 'Muhammad Zaki Ardiansyah',
    kelas: 'XI-IPS-1',
    sekolahAsalTujuan: 'SMA Taruna Nusantara Magelang',
    alasan: 'Diterima beasiswa pendidikan khusus',
    statusApproval: 'Disetujui',
    statusDapodik: 'Dikeluarkan',
    diajukanOleh: 'Siti Nurhaliza, A.Md. (Tata Usaha)',
    tanggalPengajuan: '2026-10-15 11:30',
    disetujuiOleh: 'Bambang Supriyanto, S.Kom. (Operator)',
    tanggalApproval: '2026-10-16 08:20',
    noSuratMutasi: '421.3/074/SMAN1/MUT/2026'
  }
];

export const INITIAL_SURAT: SuratDinas[] = [
  {
    id: 'SRT-001',
    jenis: 'Masuk',
    noSurat: '421/1429-Disdik.Jabar/2026',
    tanggalSurat: '2026-10-25',
    tanggalDiterima: '2026-10-27',
    pengirimPenerima: 'Dinas Pendidikan Provinsi Jawa Barat',
    perihal: 'Undangan Rapat Koordinasi Penyusunan RKAS & Validasi BOSP Tahun Anggaran 2027',
    sifat: 'Penting',
    disposisi: {
      tujuan: 'Kepala Sekolah & Bendahara',
      instruksi: 'Harap hadir dan persiapkan berkas SPJ Triwulan III',
      batasWaktu: '2026-11-05',
      catatanKepsek: 'Siapkan draf RKAS bersama tim anggaran.'
    }
  },
  {
    id: 'SRT-002',
    jenis: 'Keluar',
    noSurat: '421.3/182/SMAN1/TU/X/2026',
    tanggalSurat: '2026-10-29',
    tanggalDiterima: '2026-10-29',
    pengirimPenerima: 'Orang Tua / Wali Siswa Kelas XII',
    perihal: 'Surat Pemberitahuan Pelaksanaan Asesmen Bakat Minat (ABM) Kedinasan',
    sifat: 'Biasa'
  }
];

export const INITIAL_TRANSAKSI: TransaksiKeuangan[] = [
  {
    id: 'TRX-001',
    tanggal: '2026-10-02',
    noBukti: 'BKM-2026/10/001',
    jenis: 'Masuk',
    kategori: 'BOS Reguler',
    uraian: 'Penerimaan Penyaluran Dana BOS Reguler Tahap II Gelombang 2',
    nominal: 185000000,
    saldo: 185000000,
    penanggungJawab: 'Dra. Hj. Wahyuningsih (Bendahara)'
  },
  {
    id: 'TRX-002',
    tanggal: '2026-10-08',
    noBukti: 'BKK-2026/10/004',
    jenis: 'Keluar',
    kategori: 'Operasional ATK',
    uraian: 'Pengadaan Kertas HVS A4/F4, Tinta Printer Kantor TU & Administrasi Ujian',
    nominal: 6450000,
    saldo: 178550000,
    penanggungJawab: 'Dra. Hj. Wahyuningsih (Bendahara)'
  },
  {
    id: 'TRX-003',
    tanggal: '2026-10-14',
    noBukti: 'BKK-2026/10/012',
    jenis: 'Keluar',
    kategori: 'Sarana & Prasarana',
    uraian: 'Perbaikan Jaringan Internet Fiber Optic Lab Komputer & Ruang Guru',
    nominal: 4200000,
    saldo: 174350000,
    penanggungJawab: 'Dra. Hj. Wahyuningsih (Bendahara)'
  },
  {
    id: 'TRX-004',
    tanggal: '2026-10-20',
    noBukti: 'BKM-2026/10/015',
    jenis: 'Masuk',
    kategori: 'Iuran Komite',
    uraian: 'Penerimaan Sumbangan Pengembangan Sarana Ekstrakurikuler Komite Sekolah',
    nominal: 15000000,
    saldo: 189350000,
    penanggungJawab: 'Dra. Hj. Wahyuningsih (Bendahara)'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    targetRole: 'operator',
    title: 'Permohonan Mutasi Baru dari Tata Usaha',
    message: 'Staff TU Siti Nurhaliza mengajukan Mutasi Masuk siswa Rizky Ramadhani Syahputra. Menunggu verifikasi & sinkronisasi Dapodik.',
    timestamp: '2026-10-28 09:15',
    isRead: false,
    linkTab: 'mutasi'
  },
  {
    id: 'NOTIF-002',
    targetRole: 'all',
    title: 'Surat Masuk Dinas Pendidikan',
    message: 'Surat Undangan Rakor RKAS TA 2027 telah didisposisikan oleh Kepala Sekolah.',
    timestamp: '2026-10-27 14:00',
    isRead: false,
    linkTab: 'persuratan'
  }
];
