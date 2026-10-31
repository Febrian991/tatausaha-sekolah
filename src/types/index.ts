export type Role = 'admin' | 'kepsek' | 'kasubag_tu' | 'staf_persuratan' | 'operator_dapodik';

export interface UserSession {
  id: string;
  username: string;
  name: string;
  role: Role;
  roleLabel: string;
  avatar?: string;
}

export type TitiMangsaPosition = 'header_right' | 'above_signature';

export interface SchoolProfile {
  namaPemda: string;
  namaDinas: string;
  cabangDinas: string;
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  alamat: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  pangkatKepalaSekolah: string;
  namaKasubagTU: string;
  nipKasubagTU: string;
  pangkatKasubagTU: string;
  logoKiriSvg?: string;
  logoKananSvg?: string;
  titiMangsaPosition: TitiMangsaPosition;
}

export interface ScanFileInfo {
  id: string;
  namaFile: string;
  tipe: 'image' | 'pdf';
  ukuran: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface DisposisiData {
  id: string;
  tujuanDisposisi: string[];
  batasWaktu: string;
  instruksi: string[];
  catatanPimpinan: string;
  tglDisposisi: string;
  pemberiDisposisi: string;
}

export interface SuratMasuk {
  id: string;
  noAgenda: string;
  noSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  asalSurat: string;
  perihal: string;
  ringkasan: string;
  klasifikasi: 'Biasa' | 'Penting' | 'Rahasia' | 'Segera';
  statusDisposisi: 'Belum' | 'Sudah';
  disposisi?: DisposisiData;
  scanFile?: ScanFileInfo;
}

export interface SuratKeluar {
  id: string;
  noAgenda: string;
  noSurat: string;
  kodeKlasifikasi: string;
  tujuanSurat: string;
  perihal: string;
  ringkasan: string;
  tanggalSurat: string;
  penandatangan: string;
  statusArsip: 'Draft' | 'Terkirim' | 'Diarsipkan';
  scanFile?: ScanFileInfo;
}

export type MutasiStatusDapodik = 
  | 'Belum Sinkron'
  | 'Proses Tarik'
  | 'Sudah Sinkron'
  | 'Dikeluarkan'
  | 'Validasi Cabdis';

export interface MutasiSiswa {
  id: string;
  jenis: 'masuk' | 'keluar';
  namaSiswa: string;
  nis: string;
  nisn: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  kelas: string;
  tempatTanggalLahir: string;
  sekolahAsal: string;
  sekolahTujuan: string;
  tanggalMutasi: string;
  alasanMutasi: string;
  nomorSuratRekomendasi: string;
  tanggalSuratRekomendasi: string;
  statusDapodik: MutasiStatusDapodik;
  catatanDapodik: string;
  scanBerkas?: ScanFileInfo;
}

export interface SPPDBiayaItem {
  id: string;
  uraian: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  total: number;
}

export interface SPPDData {
  id: string;
  noSuratTugas: string;
  noSPPD: string;
  dasarTugas: string;
  namaPegawai: string;
  nip: string;
  pangkatGol: string;
  jabatan: string;
  tingkatBiaya: string;
  maksudPerjalanan: string;
  alatAngkut: string;
  tempatBerangkat: string;
  tempatTujuan: string;
  lamaHari: number;
  tglBerangkat: string;
  tglKembali: string;
  rincianBiaya: SPPDBiayaItem[];
  pembebananAnggaran: string;
  mataAnggaran: string;
  pejabatPemberiPerintah: string;
  bendaharaPengeluaran: string;
  tanggalSurat: string;
}

export interface UndanganRapatGTKData {
  id: string;
  noSurat: string;
  sifat: 'Penting' | 'Biasa' | 'Segera';
  lampiran: string;
  perihal: string;
  tanggalRapat: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempatRapat: string;
  agenda: string[];
  dressCode: string;
  peserta: string;
  pimpinanRapat: string;
  catatanKhusus: string;
  tanggalSurat: string;
}

export interface PanggilanOrtuData {
  id: string;
  noSurat: string;
  sifat: 'Penting' | 'Rahasia';
  lampiran: string;
  perihal: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  namaOrtu: string;
  alamatOrtu: string;
  hariTanggal: string;
  waktu: string;
  tempat: string;
  menghadapKepada: string;
  keperluan: string;
  catatanWaliKelas: string;
  tanggalSurat: string;
}
