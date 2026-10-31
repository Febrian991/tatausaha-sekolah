import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, CheckCircle2, AlertCircle, Shield, User, BadgeCheck, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const ChangePasswordModal: React.FC = () => {
  const {
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    changePassword,
    updateUserProfile,
    currentUser,
    setIsUserManagementOpen,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile edit states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [phone, setPhone] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password edit states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setNip(currentUser.nip || '');
      setJabatan(currentUser.jabatan || '');
      setPhone(currentUser.phone || '');
      setRoleLabel(currentUser.roleLabel || '');
    }
  }, [currentUser, isChangePasswordOpen]);

  if (!isChangePasswordOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Nama lengkap tidak boleh kosong!');
      return;
    }

    const res = updateUserProfile({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      nip: nip.trim(),
      jabatan: jabatan.trim(),
      phone: phone.trim(),
      roleLabel: roleLabel.trim() || currentUser.roleLabel,
    });

    if (res && !res.success) {
      setProfileError(res.message || 'Gagal menyimpan profil.');
    } else {
      setProfileSuccess('Identitas profil dan akun Anda berhasil disimpan!');
      setTimeout(() => {
        setProfileSuccess(null);
      }, 3000);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword) {
      setPasswordError('Masukkan kata sandi lama Anda.');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('Kata sandi baru minimal 4 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.message || 'Gagal mengubah kata sandi.');
    } else {
      setPasswordSuccess('Kata sandi berhasil diperbarui! Gunakan sandi baru ini saat login berikutnya.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPasswordSuccess(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${currentUser.avatarColor || 'bg-blue-600'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Pengaturan Profil & Akun Pengguna</h3>
              <p className="text-[11px] text-slate-400">Username: <span className="font-mono text-blue-300 font-semibold">{currentUser.username}</span> ({currentUser.roleLabel})</p>
            </div>
          </div>
          <button
            onClick={() => setIsChangePasswordOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>Ubah Nama & Identitas Profil</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Keamanan & Sandi</span>
          </button>
        </div>

        {/* Tab Content: Profile Name & Identity */}
        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{profileError}</span>
              </div>
            )}

            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-slate-700 text-xs leading-relaxed">
              Setiap pengguna dapat mengubah identitas dirinya sendiri. Data nama dan jabatan di bawah ini tampil di <strong>Banner Dashboard</strong>, <strong>Kop & Tanda Tangan Dokumen</strong>, serta di pojok kanan atas aplikasi.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Drs. H. Mulyadi Suherman, M.Pd."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Login Pengguna <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username login"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Label Peran / Jabatan (Badge)
                </label>
                <input
                  type="text"
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  placeholder="Contoh: Admin Tata Usaha"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Jabatan Resmi
                </label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Koordinator Tata Usaha"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / Karpeg
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 19750812 199903 1 004"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* If Super Admin, show shortcut to Master User Management */}
            {currentUser.role === 'super_admin' && (
              <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-violet-900 block">Wewenang Super Administrator:</span>
                  <span className="text-violet-700 text-[11px]">Buka panel kontrol untuk Kelola Akun & Reset Akun Semuanya</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setIsUserManagementOpen(true);
                  }}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  Buka Kelola Akun & Reset
                </button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Identitas</span>
              </button>
            </div>
          </form>
        ) : (
          /* Tab Content: Password */
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi Lama</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi Baru</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ulangi Kata Sandi Baru</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password baru"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Simpan Kata Sandi Baru
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
