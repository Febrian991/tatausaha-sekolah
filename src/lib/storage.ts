import { 
  User, 
  Siswa, 
  MutasiSiswa, 
  SuratDinas, 
  TransaksiKeuangan, 
  NotificationItem, 
  SchoolProfile 
} from '../types';
import { 
  OFFICIAL_ACCOUNTS, 
  INITIAL_SCHOOL_PROFILE, 
  INITIAL_SISWA, 
  INITIAL_MUTASI, 
  INITIAL_SURAT, 
  INITIAL_TRANSAKSI, 
  INITIAL_NOTIFICATIONS 
} from './constants';

const KEYS = {
  CURRENT_USER: 'simas_current_user',
  SISWA: 'simas_siswa_list',
  MUTASI: 'simas_mutasi_list',
  SURAT: 'simas_surat_list',
  TRANSAKSI: 'simas_transaksi_list',
  NOTIFICATIONS: 'simas_notifications_list',
  PROFILE: 'simas_school_profile'
};

export const storage = {
  // Authentication
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // Siswa
  getSiswaList(): Siswa[] {
    const raw = localStorage.getItem(KEYS.SISWA);
    if (!raw) {
      localStorage.setItem(KEYS.SISWA, JSON.stringify(INITIAL_SISWA));
      return INITIAL_SISWA;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SISWA;
    }
  },

  saveSiswaList(list: Siswa[]): void {
    localStorage.setItem(KEYS.SISWA, JSON.stringify(list));
  },

  // Mutasi
  getMutasiList(): MutasiSiswa[] {
    const raw = localStorage.getItem(KEYS.MUTASI);
    if (!raw) {
      localStorage.setItem(KEYS.MUTASI, JSON.stringify(INITIAL_MUTASI));
      return INITIAL_MUTASI;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MUTASI;
    }
  },

  saveMutasiList(list: MutasiSiswa[]): void {
    localStorage.setItem(KEYS.MUTASI, JSON.stringify(list));
  },

  // Surat Dinas
  getSuratList(): SuratDinas[] {
    const raw = localStorage.getItem(KEYS.SURAT);
    if (!raw) {
      localStorage.setItem(KEYS.SURAT, JSON.stringify(INITIAL_SURAT));
      return INITIAL_SURAT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SURAT;
    }
  },

  saveSuratList(list: SuratDinas[]): void {
    localStorage.setItem(KEYS.SURAT, JSON.stringify(list));
  },

  // Keuangan
  getTransaksiList(): TransaksiKeuangan[] {
    const raw = localStorage.getItem(KEYS.TRANSAKSI);
    if (!raw) {
      localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(INITIAL_TRANSAKSI));
      return INITIAL_TRANSAKSI;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSAKSI;
    }
  },

  saveTransaksiList(list: TransaksiKeuangan[]): void {
    localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(list));
  },

  // Notifikasi
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(list: NotificationItem[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // Profile
  getSchoolProfile(): SchoolProfile {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_SCHOOL_PROFILE));
      return INITIAL_SCHOOL_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SCHOOL_PROFILE;
    }
  },

  saveSchoolProfile(profile: SchoolProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }
};
