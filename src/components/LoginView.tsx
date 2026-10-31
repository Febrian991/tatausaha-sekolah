import React, { useState } from 'react';
import {
  School,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const LoginView: React.FC = () => {
  const { login, schoolProfile, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Silakan masukkan username Anda.');
      return;
    }
    if (!password) {
      setError('Silakan masukkan password akun Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message || 'Login gagal. Periksa kembali username dan password.');
      }
    }, 200);
  };

  const handleQuickLogin = (userItem: (typeof users)[0]) => {
    setUsername(userItem.username);
    setPassword(userItem.password);
    setError(null);
    login(userItem.username, userItem.password);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'kepala_tu':
        return { label: 'Administrator', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'kepsek':
        return { label: 'Pimpinan / Eksekutif', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'bendahara':
        return { label: 'Keuangan & SPP', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'staf_tu':
        return { label: 'Operator Administrasi', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Pengguna', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-sans">
      {/* Top School Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base sm:text-lg tracking-tight">SI-TATAUSAHA</h1>
            <p className="text-slate-400 text-xs truncate max-w-xs sm:max-w-md">{schoolProfile.namaSekolah}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400 font-mono">NPSN: {schoolProfile.npsn}</span>
          <p className="text-xs text-emerald-400 font-medium">Akreditasi {schoolProfile.akreditasi.split(' ')[0]}</p>
        </div>
      </div>

      {/* Main Login Card & Quick Login Section */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Form Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Autentikasi Pengguna Aman</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke Portal</h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan masukkan kredensial akun tugas Anda untuk mengelola administrasi sekolah.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username Pengguna</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: admin / kepsek / bendahara"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Data Tersimpan Aman
              </span>
              <span>Hak Akses Terlindungi</span>
            </div>
          </div>

          {/* Right Role-Selection Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <span>Akses Cepat Berdasarkan Jabatan</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Klik salah satu akun di bawah untuk langsung masuk sesuai tugas Anda:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {users.map((item) => {
                const badge = getRoleBadge(item.role);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleQuickLogin(item)}
                    className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg ${item.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                          {item.name.charAt(0)}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-snug line-clamp-1">{item.jabatan}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-slate-400 font-mono">
                        User: <span className="text-slate-200 font-bold">{item.username}</span> | Pass: <span className="text-slate-200 font-bold">{item.password}</span>
                      </div>
                      <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-bold text-xs flex items-center gap-0.5">
                        Pilih ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Role Rights Summary Card */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300">
              <div className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pembagian Hak Akses Jabatan:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  <span><strong>Kepala TU</strong>: Akses penuh semua modul & pengaturan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                  <span><strong>Kepala Sekolah</strong>: Ringkasan eksekutif & lembar disposisi</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span><strong>Bendahara</strong>: Kas, SPP, kwitansi & keuangan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span><strong>Operator</strong>: Buku induk kesiswaan, surat & aset</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <span>© {new Date().getFullYear()} Sistem Informasi Tata Usaha Terpadu</span>
        <div className="flex items-center gap-3">
          <a
            href="/api/download-source-zip"
            download="SI-TATAUSAHA-LENGKAP.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-lg text-xs font-medium transition-colors"
            title="Unduh seluruh file project terbaru (ZIP) untuk diupload ke GitHub / Vercel"
          >
            <span>📥 Unduh Kode Terbaru (.ZIP)</span>
          </a>
          <span className="font-mono text-[11px] text-slate-500">Versi 1.5.0 Production Ready</span>
        </div>
      </div>
    </div>
  );
};
