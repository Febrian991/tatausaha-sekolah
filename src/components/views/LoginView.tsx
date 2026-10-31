import React, { useState } from 'react';
import { OFFICIAL_ACCOUNTS } from '../../lib/constants';
import { User } from '../../types';
import { 
  Building2, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  School
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const accountEntry = OFFICIAL_ACCOUNTS[cleanUser];

    setTimeout(() => {
      setIsLoading(false);
      // Access Guard: Strict verification
      if (!accountEntry) {
        setErrorMessage(
          'Akses Ditolak: Username tidak terdaftar dalam pangkalan data kedinasan. Anda tidak memiliki hak akses ke sistem ini.'
        );
        return;
      }

      if (accountEntry.pass !== password) {
        setErrorMessage(
          'Akses Ditolak: Kata sandi yang dimasukkan tidak sesuai dengan kredensial kedinasan yang terdaftar.'
        );
        return;
      }

      onLoginSuccess(accountEntry.user);
    }, 400);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Emblem / Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/30 mb-4">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          PORTAL ADMINISTRASI KEDINASAN
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Sistem Informasi Manajemen Administrasi Sekolah (SIMAS)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {/* Error Alert (Access Guard) */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">PERINGATAN KEAMANAN</span>
                {errorMessage}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / NIP Pegawai
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username akun resmi"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
            </button>
          </form>

          {/* Quick Credential Helper for Inspection */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-xs">
            <span className="text-slate-500 font-medium block mb-2 text-center">
              Pilih Akun Kedinasan untuk Akses Cepat:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('operator', 'operator123')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-slate-800">👑 Operator & Super Admin</div>
                <div className="text-slate-500 text-[10px]">user: operator / pass: operator123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('tu', 'tu123')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-slate-800">📋 Tata Usaha (TU)</div>
                <div className="text-slate-500 text-[10px]">user: tu / pass: tu123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('bendahara', 'bendahara123')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-slate-800">💰 Bendahara BOS</div>
                <div className="text-slate-500 text-[10px]">user: bendahara / pass: bendahara123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('kepsek', 'kepsek123')}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-slate-800">🏛️ Kepala Sekolah</div>
                <div className="text-slate-500 text-[10px]">user: kepsek / pass: kepsek123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Sistem Keamanan Terintegrasi Pangkalan Data Dapodik</span>
        </p>
      </div>
    </div>
  );
};
