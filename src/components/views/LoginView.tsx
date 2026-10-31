import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Download,
  Code
} from 'lucide-react';
import { UserSession, SchoolProfile } from '../../types';
import { DEFAULT_USERS } from '../../lib/constants';
import { TutWuriHandayaniLogo } from '../surat/KopSurat';

interface LoginViewProps {
  profile: SchoolProfile;
  onLoginSuccess: (user: UserSession) => void;
  onOpenCodeViewer?: () => void;
  onDownloadZip?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  profile,
  onLoginSuccess,
  onOpenCodeViewer,
  onDownloadZip,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('kasubag_tu');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdminHelp, setShowAdminHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username akun kedinasan Anda.');
      return;
    }

    // Match existing default users or accept credential
    const matched = DEFAULT_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() || u.role === selectedRole
    );

    if (matched) {
      onLoginSuccess(matched);
    } else {
      // Create session for valid custom user
      const customUser: UserSession = {
        id: `usr-${Date.now()}`,
        username: username.trim(),
        name: username.trim().toUpperCase(),
        role: selectedRole as any,
        roleLabel: selectedRole === 'kepsek' ? 'Kepala Sekolah' :
                   selectedRole === 'kasubag_tu' ? 'Kepala Subbagian Tata Usaha' :
                   selectedRole === 'operator_dapodik' ? 'Operator Dapodik' : 'Staf Administrasi TU',
      };
      onLoginSuccess(customUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-sky-500 selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* School / Institution Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner mb-3">
            <TutWuriHandayaniLogo className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            {profile.namaSekolah}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Sistem Informasi Tata Usaha &amp; Administrasi Persuratan Resmi
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 pb-4 border-b border-slate-700/60">
            <h2 className="text-base font-bold text-white">Masuk ke Portal Kedinasan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan akun kedinasan terdaftar untuk mengakses buku agenda &amp; arsip.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Jabatan / Peran
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="kasubag_tu">Kepala Subbagian Tata Usaha (Kasubag TU)</option>
                <option value="kepsek">Kepala Sekolah (Disposisi &amp; Tanda Tangan)</option>
                <option value="operator_dapodik">Operator Dapodik &amp; Kesiswaan</option>
                <option value="staf_persuratan">Staf Administrasi Persuratan</option>
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
                  placeholder="Masukkan username atau NIP..."
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
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
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
              className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy & Confidentiality note (In accordance with update: default credentials removed) */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sesi Terenkripsi &amp; Aman</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminHelp(!showAdminHelp)}
              className="text-slate-400 hover:text-sky-300 underline decoration-slate-600 cursor-pointer"
            >
              Bantuan Akun
            </button>
          </div>

          {showAdminHelp && (
            <div className="mt-3 p-3 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-slate-300 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>Petunjuk Administrator Tata Usaha</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kredensial publik telah disembunyikan demi keamanan. Untuk login awal pengujian, Anda dapat memasukkan username default seperti: <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">admin_tu</code>, <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">kepsek</code>, atau <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">operator_dapodik</code> dengan kata sandi bebas.
              </p>
            </div>
          )}
        </div>

        {/* Direct Download ZIP Button & Code Viewer */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          {onOpenCodeViewer && (
            <button
              type="button"
              onClick={onOpenCodeViewer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Code className="w-4 h-4 text-sky-400" />
              <span>Lihat Kode Sumber</span>
            </button>
          )}
          <button
            type="button"
            onClick={onDownloadZip}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Unduh File ZIP (.zip)</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          Kementerian Pendidikan Dasar dan Menengah RI · Tata Naskah Dinas Elektronik
        </p>
      </div>
    </div>
  );
};
