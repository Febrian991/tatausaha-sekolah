export type ViewMode =
  | 'dashboard'
  | 'students'
  | 'staff'
  | 'mail'
  | 'finance'
  | 'inventory'
  | 'ai-letters';

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  statusSekolah: 'Negeri' | 'Swasta';
  dinasPendidikan: string;
  alamat: string;
  kelurahanDesa: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kepalaTU: string;
  nipKepalaTU: string;
  bendahara: string;
  nipBendahara: string;
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  kelas: string;
  jurusan: string;
  namaWali: string;
  pekerjaanWali: string;
  kontakWali: string;
  alamat: string;
  tahunMasuk: string;
  status: 'Aktif' | 'Lulus' | 'Mutasi Keluar' | 'Cuti';
  catatanKhusus?: string;
}

export interface Staff {
  id: string;
  nip: string;
  nuptk: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  jenisKelamin: 'L' | 'P';
  unitKerja: 'Tenaga Pendidik (Guru)' | 'Tenaga Kependidikan (TU)' | 'Petugas Keamanan' | 'Petugas Kebersihan';
  jabatan: string;
  golongan: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT (Honorer Guru)' | 'PTT (Honorer TU)';
  mataPelajaran?: string;
  pendidikanTerakhir: string;
  telepon: string;
  email: string;
  statusAktif: boolean;
}

export interface Mail {
  id: string;
  jenis: 'Masuk' | 'Keluar';
  noAgenda: string;
  noSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  pengirim: string;
  penerima: string;
  perihal: string;
  kodeKlasifikasi: string; // Misal: 421.1 (Kurikulum), 421.2 (Sarpras), 421.3 (Kesiswaan), 421.4 (Kepegawaian)
  ringkasan: string;
  statusDisposisi: 'Belum' | 'Sudah Didisposisi' | 'Selesai';
  disposisiKepada?: string;
  instruksiDisposisi?: string;
  catatanKepalaSekolah?: string;
  batasWaktu?: string;
  fileLampiranNama?: string;
}

export interface SPPTransaction {
  id: string;
  noKwitansi: string;
  studentId: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  jenisPembayaran: 'SPP Bulanan' | 'DSP / Uang Pangkal' | 'Uang Ujian & Asesmen' | 'Seragam & Praktik' | 'Iuran Kegiatan Organisasi';
  bulan: string; // Misal: "Juli 2026", "Agustus 2026"
  nominal: number;
  tanggalBayar: string;
  metode: 'Tunai' | 'Transfer Bank' | 'QRIS' | 'Virtual Account';
  petugasTU: string;
  status: 'Lunas' | 'Sebagian';
  keterangan?: string;
}

export interface InventoryItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: 'Elektronik & Komputer' | 'Mebel & Perlengkapan' | 'Media Pembelajaran' | 'Alat Olahraga' | 'Buku & Pustaka' | 'Peralatan Lab';
  lokasiRuang: string; // Ruang Lab Komputer 1, Ruang Kelas XI-RPL 1, Perpustakaan, dsb.
  jumlah: number;
  satuan: string; // Unit, Buah, Set, Paket
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  tahunPerolehan: string;
  sumberDana: 'BOS Reguler' | 'BOS Kinerja' | 'Komite Sekolah' | 'Bantuan Pemerintah (DAK)' | 'Yayasan';
  penanggungJawab: string;
}

export interface PrintableDocumentData {
  type: 'surat-keterangan-aktif' | 'surat-tugas' | 'surat-panggilan' | 'kuitansi-spp' | 'lembar-disposisi' | 'agenda-surat' | 'kartu-inventaris' | 'kustom-ai';
  title: string;
  data: any;
  customBody?: string;
  nomorSuratCustom?: string;
}

export type UserRole = 'kepsek' | 'kepala_tu' | 'bendahara' | 'staf_tu';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  nip?: string;
  jabatan: string;
  avatarColor: string;
}

