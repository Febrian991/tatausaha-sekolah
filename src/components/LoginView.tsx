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
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const LoginView: React.FC = () => {
  const { login, schoolProfile } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Silakan masukkan username pengguna.');
      return;
    }
    if (!password) {
      setError('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(username.trim(), password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message || 'Login gagal. Periksa kembali username dan kata sandi.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-sans">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">SI-TATAUSAHA</h1>
            <p className="text-slate-400 text-xs truncate max-w-xs">{schoolProfile.namaSekolah}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-mono block">NPSN {schoolProfile.npsn}</span>
          <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
            Akreditasi {schoolProfile.akreditasi.split(' ')[0]}
          </span>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Autentikasi Pengguna Resmi</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Silakan masukkan Username dan Kata Sandi terdaftar Anda untuk mengakses modul kerja.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username Pengguna
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
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

          {/* Security & Access Protection Info */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Sesi Enkripsi Terlindungi
              </span>
              <span className="font-semibold text-slate-500">5 Tingkat Hak Akses</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Tingkat Wewenang:</strong> Super Admin &gt; Admin Tata Usaha &gt; Bendahara &gt; Kepala Sekolah (Plus Operator). Fitur terlengkap dan Reset Akun berada di Super Admin.
                </p>
              </div>

              <details className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 cursor-pointer">
                <summary className="font-semibold text-blue-600 hover:text-blue-800 select-none">
                  Lihat Kredensial Akun Default (Klik di sini)
                </summary>
                <div className="mt-2 space-y-1 font-mono text-[10px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-violet-700 font-bold">1. Super Admin:</span>
                    <span>superadmin / superadmin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-bold">2. Admin TU:</span>
                    <span>admin / admin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700 font-bold">3. Bendahara:</span>
                    <span>bendahara / bendahara123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700 font-bold">4. Kepala Sekolah:</span>
                    <span>kepsek / kepsek123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 font-bold">5. Operator:</span>
                    <span>operator / operator123</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>© {new Date().getFullYear()} SI-TATAUSAHA Terpadu</span>
        <div className="flex items-center gap-2">
          <a
            href="/api/download-source-zip"
            download="SI-TATAUSAHA-LENGKAP.zip"
            className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
            title="Unduh seluruh file project (ZIP)"
          >
            Unduh Source Code (.ZIP)
          </a>
          <span>·</span>
          <span className="font-mono text-[11px] text-slate-500">v1.5.0</span>
        </div>
      </footer>
    </div>
  );
};
