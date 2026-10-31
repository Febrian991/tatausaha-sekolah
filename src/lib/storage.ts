import { 
  SchoolProfile, 
  SuratMasuk, 
  SuratKeluar, 
  MutasiSiswa, 
  SPPDData, 
  UndanganRapatGTKData, 
  PanggilanOrtuData,
  UserSession,
  AppNotification,
  SiswaBukuInduk,
  TransaksiKas,
  PembayaranSiswa,
  AnggaranBOSItem
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_SURAT_MASUK,
  INITIAL_SURAT_KELUAR,
  INITIAL_MUTASI_SISWA,
  INITIAL_SPPD,
  INITIAL_UNDANGAN_RAPAT,
  INITIAL_PANGGILAN_ORTU,
  INITIAL_NOTIFICATIONS,
  INITIAL_SISWA_BUKU_INDUK,
  INITIAL_TRANSAKSI_KAS,
  INITIAL_PEMBAYARAN_SISWA,
  INITIAL_ANGGARAN_BOS,
  DEFAULT_USERS
} from './constants';

const KEYS = {
  PROFILE: 'situ_school_profile',
  SURAT_MASUK: 'situ_surat_masuk',
  SURAT_KELUAR: 'situ_surat_keluar',
  MUTASI: 'situ_mutasi_siswa',
  SPPD: 'situ_sppd_data',
  UNDANGAN: 'situ_undangan_rapat',
  PANGGILAN: 'situ_panggilan_ortu',
  USER_SESSION: 'situ_user_session',
  NOTIFICATIONS: 'situ_app_notifications',
  BUKU_INDUK: 'situ_siswa_buku_induk',
  KAS: 'situ_transaksi_kas',
  PEMBAYARAN: 'situ_pembayaran_siswa',
  BOS: 'situ_anggaran_bos',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

export const Storage = {
  getProfile: (): SchoolProfile => safeGet(KEYS.PROFILE, INITIAL_SCHOOL_PROFILE),
  setProfile: (data: SchoolProfile) => safeSet(KEYS.PROFILE, data),

  getSuratMasuk: (): SuratMasuk[] => safeGet(KEYS.SURAT_MASUK, INITIAL_SURAT_MASUK),
  setSuratMasuk: (data: SuratMasuk[]) => safeSet(KEYS.SURAT_MASUK, data),

  getSuratKeluar: (): SuratKeluar[] => safeGet(KEYS.SURAT_KELUAR, INITIAL_SURAT_KELUAR),
  setSuratKeluar: (data: SuratKeluar[]) => safeSet(KEYS.SURAT_KELUAR, data),

  getMutasi: (): MutasiSiswa[] => safeGet(KEYS.MUTASI, INITIAL_MUTASI_SISWA),
  setMutasi: (data: MutasiSiswa[]) => safeSet(KEYS.MUTASI, data),

  getSPPD: (): SPPDData => safeGet(KEYS.SPPD, INITIAL_SPPD),
  setSPPD: (data: SPPDData) => safeSet(KEYS.SPPD, data),

  getUndanganRapat: (): UndanganRapatGTKData => safeGet(KEYS.UNDANGAN, INITIAL_UNDANGAN_RAPAT),
  setUndanganRapat: (data: UndanganRapatGTKData) => safeSet(KEYS.UNDANGAN, data),

  getPanggilanOrtu: (): PanggilanOrtuData => safeGet(KEYS.PANGGILAN, INITIAL_PANGGILAN_ORTU),
  setPanggilanOrtu: (data: PanggilanOrtuData) => safeSet(KEYS.PANGGILAN, data),

  getNotifications: (): AppNotification[] => safeGet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (data: AppNotification[]) => safeSet(KEYS.NOTIFICATIONS, data),

  getBukuInduk: (): SiswaBukuInduk[] => safeGet(KEYS.BUKU_INDUK, INITIAL_SISWA_BUKU_INDUK),
  setBukuInduk: (data: SiswaBukuInduk[]) => safeSet(KEYS.BUKU_INDUK, data),

  getTransaksiKas: (): TransaksiKas[] => safeGet(KEYS.KAS, INITIAL_TRANSAKSI_KAS),
  setTransaksiKas: (data: TransaksiKas[]) => safeSet(KEYS.KAS, data),

  getPembayaranSiswa: (): PembayaranSiswa[] => safeGet(KEYS.PEMBAYARAN, INITIAL_PEMBAYARAN_SISWA),
  setPembayaranSiswa: (data: PembayaranSiswa[]) => safeSet(KEYS.PEMBAYARAN, data),

  getAnggaranBOS: (): AnggaranBOSItem[] => safeGet(KEYS.BOS, INITIAL_ANGGARAN_BOS),
  setAnggaranBOS: (data: AnggaranBOSItem[]) => safeSet(KEYS.BOS, data),

  getSession: (): UserSession | null => safeGet(KEYS.USER_SESSION, DEFAULT_USERS[0]),
  setSession: (data: UserSession | null) => safeSet(KEYS.USER_SESSION, data),

  resetAll: () => {
    safeSet(KEYS.PROFILE, INITIAL_SCHOOL_PROFILE);
    safeSet(KEYS.SURAT_MASUK, INITIAL_SURAT_MASUK);
    safeSet(KEYS.SURAT_KELUAR, INITIAL_SURAT_KELUAR);
    safeSet(KEYS.MUTASI, INITIAL_MUTASI_SISWA);
    safeSet(KEYS.SPPD, INITIAL_SPPD);
    safeSet(KEYS.UNDANGAN, INITIAL_UNDANGAN_RAPAT);
    safeSet(KEYS.PANGGILAN, INITIAL_PANGGILAN_ORTU);
    safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSet(KEYS.BUKU_INDUK, INITIAL_SISWA_BUKU_INDUK);
    safeSet(KEYS.KAS, INITIAL_TRANSAKSI_KAS);
    safeSet(KEYS.PEMBAYARAN, INITIAL_PEMBAYARAN_SISWA);
    safeSet(KEYS.BOS, INITIAL_ANGGARAN_BOS);
  },

  exportBackupJson: () => {
    const data = {
      version: '3.0-SI-TATAUSAHA-LENGKAP',
      exportedAt: new Date().toISOString(),
      profile: safeGet(KEYS.PROFILE, INITIAL_SCHOOL_PROFILE),
      suratMasuk: safeGet(KEYS.SURAT_MASUK, INITIAL_SURAT_MASUK),
      suratKeluar: safeGet(KEYS.SURAT_KELUAR, INITIAL_SURAT_KELUAR),
      mutasi: safeGet(KEYS.MUTASI, INITIAL_MUTASI_SISWA),
      sppd: safeGet(KEYS.SPPD, INITIAL_SPPD),
      undangan: safeGet(KEYS.UNDANGAN, INITIAL_UNDANGAN_RAPAT),
      panggilan: safeGet(KEYS.PANGGILAN, INITIAL_PANGGILAN_ORTU),
      bukuInduk: safeGet(KEYS.BUKU_INDUK, INITIAL_SISWA_BUKU_INDUK),
      kas: safeGet(KEYS.KAS, INITIAL_TRANSAKSI_KAS),
      pembayaran: safeGet(KEYS.PEMBAYARAN, INITIAL_PEMBAYARAN_SISWA),
      anggaranBOS: safeGet(KEYS.BOS, INITIAL_ANGGARAN_BOS),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_situ_sekolah_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackupJson: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) safeSet(KEYS.PROFILE, data.profile);
      if (data.suratMasuk) safeSet(KEYS.SURAT_MASUK, data.suratMasuk);
      if (data.suratKeluar) safeSet(KEYS.SURAT_KELUAR, data.suratKeluar);
      if (data.mutasi) safeSet(KEYS.MUTASI, data.mutasi);
      if (data.sppd) safeSet(KEYS.SPPD, data.sppd);
      if (data.undangan) safeSet(KEYS.UNDANGAN, data.undangan);
      if (data.panggilan) safeSet(KEYS.PANGGILAN, data.panggilan);
      if (data.bukuInduk) safeSet(KEYS.BUKU_INDUK, data.bukuInduk);
      if (data.kas) safeSet(KEYS.KAS, data.kas);
      if (data.pembayaran) safeSet(KEYS.PEMBAYARAN, data.pembayaran);
      if (data.anggaranBOS) safeSet(KEYS.BOS, data.anggaranBOS);
      return true;
    } catch {
      return false;
    }
  }
};
