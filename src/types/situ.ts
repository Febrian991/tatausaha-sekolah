export interface SchoolProfile {
  provinsi: string;
  dinas: string;
  cabangDinas: string;
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  alamat: string;
  kota: string;
  kodePos: string;
  telepon: string;
  website: string;
  email: string;
  // Mode Kop Surat: apakah teks + logo atau gambar kop penuh yang di-upload
  modeKop: 'TEKS_LOGO' | 'GAMBAR_BANNER';
  kopBannerUrl?: string; // Gambar Kop Surat Lengkap yang diupload (base64)
  logoKiriUrl: string; // Logo Pemda / Tut Wuri Handayani (bisa upload)
  logoKananUrl: string; // Logo Sekolah (bisa upload)
  kepalaSekolah: {
    nama: string;
    nip: string;
    pangkat: string;
    gelar: string;
  };
  kepalaTU: {
    nama: string;
    nip: string;
    pangkat: string;
  };
  titiMangsaKota: string;
  gunakanStempel: boolean;
  gunakanTtdDigital: boolean;
}

export type JenisSurat = 
  | 'SPPD'
  | 'UNDANGAN_GTK'
  | 'PANGGILAN_ORTU'
  | 'KET_AKTIF'
  | 'MUTASI_SISWA'
  | 'PENGANTAR_DINAS'
  | 'TEMPLATE_CUSTOM';

export interface CustomTemplateSurat {
  id: string;
  namaTemplate: string;
  kodeKlasifikasi: string; // misal: 421.2 / 005 / 800
  perihalDefault: string;
  pembuka: string;
  formatIsi: string; // teks dengan tag {{nama_siswa}}, {{hari_tanggal}}, dsb.
  penutup: string;
  tembusanDefault: string[];
  fileReferensiNama?: string;
  diuploadPada: string;
}

export interface SuratKedinasan {
  id: string;
  jenis: JenisSurat;
  templateId?: string; // Jika menggunakan custom template
  nomorSurat: string;
  lampiran: string;
  perihal: string;
  titiMangsa: {
    kota: string;
    tanggal: string;
  };
  // Konten spesifik
  konten: {
    // Untuk Undangan GTK & Panggilan Ortu
    tujuanNama?: string;
    tujuanJabatan?: string;
    hariTanggalAcara?: string;
    waktuAcara?: string;
    tempatAcara?: string;
    agenda?: string;

    // Untuk Panggilan Ortu
    namaSiswa?: string;
    kelasSiswa?: string;
    nisnSiswa?: string;
    alasanPanggilan?: string;

    // Untuk Keterangan Aktif
    keperluanKeterangan?: string;
    namaOrtu?: string;
    pekerjaanOrtu?: string;

    // Untuk SPPD & Surat Tugas
    dasarSuratTugas?: string;
    pegawaiBertugas?: {
      nama: string;
      nip: string;
      pangkat: string;
      jabatan: string;
    }[];
    maksudPerjalanan?: string;
    tempatBerangkat?: string;
    tempatTujuan?: string;
    lamaPerjalanan?: string;
    tanggalBerangkat?: string;
    tanggalKembali?: string;
    alatAngkut?: string;
    pembebananAnggaran?: string;

    // Untuk Pengantar Dinas
    daftarBerkas?: {
      uraian: string;
      banyaknya: string;
      keterangan: string;
    }[];

    // Untuk Template Custom yang di-upload
    customTeksLengkap?: string;
    customPembuka?: string;
    customIsi?: string;
    customPenutup?: string;
    customTembusan?: string[];
  };
  dibuatOleh: string;
  createdAt: string;
}

export interface MutasiSiswa {
  id: string;
  jenis: 'KELUAR' | 'MASUK';
  nomorSurat: string;
  tanggalSurat: string;
  namaSiswa: string;
  nisn: string;
  nis: string;
  tingkatKelas: string;
  rombel: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  namaOrangTua: string;
  pekerjaanOrangTua: string;
  sekolahAsalTujuan: string;
  alasanMutasi: string;
  statusDapodik: 'Sinkron Berhasil' | 'Draft' | 'Menunggu Tarik Data';
}

export interface ArsipDigital {
  id: string;
  jenis: 'MASUK' | 'KELUAR';
  nomorAgenda: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalTerimaKirim: string;
  pengirimPenerima: string;
  perihal: string;
  kategori: 'Dinas Pendidikan' | 'Kemenag' | 'Kesiswaan' | 'Kepegawaian' | 'Keuangan & BOS' | 'Organisasi/Lainnya';
  disposisiPimpinan: string;
  statusTindakLanjut: 'Selesai' | 'Dalam Proses' | 'Belum Ditindaklanjuti';
  namaFileScan?: string;
  ukuranFile?: string;
  catatanPetugas: string;
}
