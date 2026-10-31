export type UserRole = 'operator' | 'tu' | 'bendahara' | 'kepsek';

export interface User {
  id: string;
  username: string;
  nama: string;
  nip: string;
  role: UserRole;
  jabatan: string;
  avatarUrl?: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  kelas: string;
  rombel: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaAyah: string;
  namaIbu: string;
  alamat: string;
  noTelp: string;
  status: 'Aktif' | 'Mutasi Keluar' | 'Lulus';
  tahunMasuk: string;
}

export interface MutasiSiswa {
  id: string;
  jenis: 'Masuk' | 'Keluar';
  tanggal: string;
  nisn: string;
  namaSiswa: string;
  kelas: string;
  sekolahAsalTujuan: string;
  alasan: string;
  statusApproval: 'Menunggu Persetujuan Operator' | 'Disetujui' | 'Ditolak';
  statusDapodik: 'Belum Sinkron' | 'Sudah Sinkron' | 'Dikeluarkan';
  diajukanOleh: string;
  tanggalPengajuan: string;
  disetujuiOleh?: string;
  tanggalApproval?: string;
  catatan?: string;
  noSuratMutasi?: string;
}

export interface SuratDinas {
  id: string;
  jenis: 'Masuk' | 'Keluar';
  noSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  pengirimPenerima: string;
  perihal: string;
  sifat: 'Biasa' | 'Penting' | 'Rahasia' | 'Segera';
  lampiran?: string;
  disposisi?: {
    tujuan: string;
    instruksi: string;
    batasWaktu: string;
    catatanKepsek?: string;
  };
}

export interface TransaksiKeuangan {
  id: string;
  tanggal: string;
  noBukti: string;
  jenis: 'Masuk' | 'Keluar';
  kategori: 'BOS Reguler' | 'BOS Kinerja' | 'Iuran Komite' | 'Sarana & Prasarana' | 'Operasional ATK' | 'Honor Pendidik' | 'Kegiatan Siswa' | 'Lainnya';
  uraian: string;
  nominal: number;
  saldo: number;
  penanggungJawab: string;
  buktiKwitansi?: string;
}

export interface NotificationItem {
  id: string;
  targetRole: 'operator' | 'tu' | 'bendahara' | 'kepsek' | 'all';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  noTelepon: string;
  email: string;
  website: string;
  namaKepsek: string;
  nipKepsek: string;
}
