import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Info,
  AlertOctagon,
  KeyRound
} from 'lucide-react';
import { UserSession, SchoolProfile, Role } from '../../types';
import { DEFAULT_USERS } from '../../lib/constants';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';

interface LoginViewProps {
  profile: SchoolProfile;
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  profile,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('operator');
  const [password, setPassword] = useState('operator123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('operator_superadmin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdminHelp, setShowAdminHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMsg('Silakan masukkan username akun kedinasan Anda.');
      return;
    }

    if (!trimmedPass) {
      setErrorMsg('Silakan masukkan kata sandi akun kedinasan.');
      return;
    }

    // STRICT AUTHENTICATION: Match against registered accounts only
    const matched = DEFAULT_USERS.find(
      u => u.username.toLowerCase() === trimmedUser
    );

    // If user is not found in database, STRICTLY DENY ACCESS
    if (!matched) {
      setErrorMsg(
        `Akses Ditolak: Username "${username.trim()}" tidak terdaftar dalam pangkalan data kedinasan. Anda tidak memiliki hak akses ke sistem ini.`
      );
      return;
    }

    // Verify password strictly
    const expectedPassword = matched.password || 'admin123';
    if (trimmedPass !== expectedPassword) {
      setErrorMsg(
        'Akses Ditolak: Kata sandi yang Anda masukkan tidak cocok. Periksa kembali atau hubungi Operator Sekolah / Super Admin.'
      );
      return;
    }

    // Role verification: inform if different role selected
    onLoginSuccess(matched);
  };

  const setQuickAccount = (u: string, p: string, r: Role) => {
    setUsername(u);
    setPassword(p);
    setSelectedRole(r);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-sky-500 selection:text-white relative">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* School / Institution Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner mb-3">
            <TutWuriHandayaniLogo className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            {profile.namaSekolah}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Sistem Informasi Tata Usaha, Administrasi Persuratan &amp; Keuangan Sekolah
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-5 pb-4 border-b border-slate-700/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Masuk ke Portal Kedinasan</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Autentikasi akun terdaftar untuk mengakses modul &amp; arsip.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-sky-500/10 border border-sky-400/30 text-sky-300">
                <ShieldCheck className="w-3 h-3 text-sky-400" />
                <span>Terotentikasi</span>
              </span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs rounded-xl flex items-start gap-2.5 shadow-sm animate-in fade-in">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong className="block font-bold text-rose-300 mb-0.5">Gagal Masuk:</strong>
                {errorMsg}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Jabatan / Peran
              </label>
              <select
                value={selectedRole}
                onChange={e => {
                  const newRole = e.target.value as Role;
                  setSelectedRole(newRole);
                  // Auto-suggest username if default
                  if (newRole === 'operator_superadmin') {
                    setUsername('operator');
                    setPassword('operator123');
                  } else if (newRole === 'tata_usaha') {
                    setUsername('tu');
                    setPassword('tu123');
                  } else if (newRole === 'bendahara') {
                    setUsername('bendahara');
                    setPassword('bendahara123');
                  } else if (newRole === 'kepala_sekolah') {
                    setUsername('kepsek');
                    setPassword('kepsek123');
                  }
                  setErrorMsg(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="operator_superadmin">
                  👑 Operator Sekolah + Super Admin (Versi Lengkap)
                </option>
                <option value="tata_usaha">
                  📋 Tata Usaha (Buku Induk, Persuratan &amp; Pengajuan Mutasi)
                </option>
                <option value="bendahara">
                  💰 Bendahara Sekolah (Khusus Keuangan Saja)
                </option>
                <option value="kepala_sekolah">
                  🏛️ Kepala Sekolah (Monitoring &amp; Disposisi)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / NIP Kedinasan
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Masukkan username akun resmi..."
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi Akun
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Masukkan kata sandi kedinasan..."
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Masuk Aplikasi Kedinasan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Login Chips for Ease of Access */}
          <div className="mt-5 pt-4 border-t border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>Pilih Cepat Akun Kedinasan Terdaftar:</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setQuickAccount('operator', 'operator123', 'operator_superadmin')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'operator'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="font-bold truncate text-white">👑 Operator + Super Admin</div>
                <div className="text-[10px] text-slate-400 truncate">operator / operator123</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickAccount('tu', 'tu123', 'tata_usaha')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'tu'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="font-bold truncate text-white">📋 Tata Usaha (TU)</div>
                <div className="text-[10px] text-slate-400 truncate">tu / tu123</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickAccount('bendahara', 'bendahara123', 'bendahara')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'bendahara'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="font-bold truncate text-white">💰 Bendahara Sekolah</div>
                <div className="text-[10px] text-slate-400 truncate">bendahara / bendahara123</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickAccount('kepsek', 'kepsek123', 'kepala_sekolah')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'kepsek'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="font-bold truncate text-white">🏛️ Kepala Sekolah</div>
                <div className="text-[10px] text-slate-400 truncate">kepsek / kepsek123</div>
              </button>
            </div>
          </div>

          {/* Privacy & Confidentiality note */}
          <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Akses Terbatas Pegawai Resmi</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminHelp(!showAdminHelp)}
              className="text-slate-400 hover:text-sky-300 underline decoration-slate-600 cursor-pointer"
            >
              Info Hak Akses
            </button>
          </div>

          {showAdminHelp && (
            <div className="mt-3 p-3 bg-slate-900/95 border border-slate-700 rounded-lg text-xs text-slate-300 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>Ketentuan Hak Akses &amp; Jabatan:</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-white">Operator Sekolah + Super Admin:</strong> Akses penuh seluruh sistem, verifikasi/approval mutasi siswa dari TU, manajemen pengguna, persuratan &amp; sinkronisasi Dapodik.
                </li>
                <li>
                  <strong className="text-white">Tata Usaha:</strong> Akses Buku Induk Siswa, Persuratan (Masuk &amp; Keluar), dan Pengajuan Permohonan Mutasi Masuk/Keluar (otomatis memicu notifikasi ke Operator Sekolah).
                </li>
                <li>
                  <strong className="text-white">Bendahara Sekolah:</strong> Khusus masalah keuangan sekolah saja (Kas Masuk/Keluar, SPP, BOS/BOSP, RKAS, Cetak Kwitansi).
                </li>
                <li>
                  <strong className="text-rose-400">Pengguna Tanpa Akun:</strong> Ditolak otomatis oleh sistem dan tidak dapat mengakses portal.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          Kementerian Pendidikan Dasar dan Menengah RI · Tata Naskah Dinas Elektronik
        </p>
      </div>
    </div>
  );
};
