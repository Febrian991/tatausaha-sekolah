import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  KeyRound,
  UserPlus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Crown,
  Building,
  Receipt,
  GraduationCap,
  Laptop,
  Check,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { StoredUser } from '../data/initialData.ts';
import { UserRole } from '../types/index.ts';

export const UserManagementModal: React.FC = () => {
  const {
    isUserManagementOpen,
    setIsUserManagementOpen,
    currentUser,
    users,
    resetAllAccounts,
    adminResetUserPassword,
    adminResetUserToDefault,
    adminUpdateUser,
    adminAddUser,
    adminDeleteUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hierarchy' | 'reset-all' | 'manage-users' | 'add-user'>('hierarchy');
  const [confirmMasterReset, setConfirmMasterReset] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick password reveal per user ID
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});

  // Editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('operator');
  const [editJabatan, setEditJabatan] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Add new user state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('operator');
  const [newJabatan, setNewJabatan] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isUserManagementOpen) return null;

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  // Master Reset All Accounts
  const handleExecuteMasterReset = () => {
    const res = resetAllAccounts();
    setConfirmMasterReset(false);
    showNotice(res.success ? 'success' : 'error', res.message);
  };

  // Start editing a user
  const startEdit = (user: StoredUser) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditPassword(user.password);
    setEditRole(user.role);
    setEditJabatan(user.jabatan);
    setEditNip(user.nip || '');
    setEditPhone(user.phone || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    const roleLabels: Record<string, string> = {
      super_admin: 'Super Admin (Master)',
      admin_tu: 'Admin Tata Usaha',
      bendahara: 'Bendahara Sekolah',
      kepsek: 'Kepala Sekolah',
      operator: 'Operator Sekolah',
      kepala_tu: 'Admin Tata Usaha',
      staf_tu: 'Operator Sekolah',
    };

    const res = adminUpdateUser(editingUserId, {
      name: editName.trim(),
      username: editUsername.trim().toLowerCase(),
      password: editPassword.trim(),
      role: editRole,
      roleLabel: roleLabels[editRole] || editRole,
      jabatan: editJabatan.trim(),
      nip: editNip.trim(),
      phone: editPhone.trim(),
    });

    if (res.success) {
      showNotice('success', res.message);
      setEditingUserId(null);
    } else {
      showNotice('error', res.message);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) {
      showNotice('error', 'Nama, Username, dan Kata Sandi wajib diisi!');
      return;
    }

    const roleLabels: Record<string, string> = {
      super_admin: 'Super Admin (Master)',
      admin_tu: 'Admin Tata Usaha',
      bendahara: 'Bendahara Sekolah',
      kepsek: 'Kepala Sekolah',
      operator: 'Operator Sekolah',
      kepala_tu: 'Admin Tata Usaha',
      staf_tu: 'Operator Sekolah',
    };

    const res = adminAddUser({
      name: newName.trim(),
      username: newUsername.trim().toLowerCase(),
      password: newPassword.trim(),
      role: newRole,
      roleLabel: roleLabels[newRole] || newRole,
      jabatan: newJabatan.trim() || 'Staf Tata Usaha',
      nip: newNip.trim(),
      phone: newPhone.trim(),
      avatarColor:
        newRole === 'super_admin'
          ? 'bg-violet-700'
          : newRole === 'admin_tu'
          ? 'bg-blue-600'
          : newRole === 'bendahara'
          ? 'bg-emerald-600'
          : newRole === 'kepsek'
          ? 'bg-purple-600'
          : 'bg-amber-600',
    });

    if (res.success) {
      showNotice('success', res.message);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewJabatan('');
      setNewNip('');
      setNewPhone('');
      setActiveTab('manage-users');
    } else {
      showNotice('error', res.message);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
            <Crown className="w-3 h-3 text-violet-600" />
            Super Admin (Master)
          </span>
        );
      case 'admin_tu':
      case 'kepala_tu':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Building className="w-3 h-3 text-blue-600" />
            Admin Tata Usaha
          </span>
        );
      case 'bendahara':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Receipt className="w-3 h-3 text-emerald-600" />
            Bendahara Keuangan
          </span>
        );
      case 'kepsek':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <GraduationCap className="w-3 h-3 text-purple-600" />
            Kepala Sekolah
          </span>
        );
      case 'operator':
      case 'staf_tu':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Laptop className="w-3 h-3 text-amber-600" />
            Operator Sekolah
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 my-auto">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-linear-to-r from-slate-950 via-slate-900 to-violet-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/90 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  Pusat Manajemen Akun & Hak Akses
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hierarki wewenang: Super Admin &gt; Admin Tata Usaha &gt; Bendahara &gt; Kepala Sekolah (Plus Operator)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingUserId(null);
              setIsUserManagementOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notice Banner */}
        {actionNotice && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all ${
              actionNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'hierarchy'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Struktur Hierarki & Wewenang</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage-users')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'manage-users'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Kelola Daftar Pengguna ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reset-all')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'reset-all'
                ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-lg'
                : 'border-transparent text-rose-600 hover:text-rose-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Reset Akun Semuanya</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add-user')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'add-user'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Pengguna</span>
          </button>
        </div>

        {/* Tab 1: Hierarchy View */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'hierarchy' && (
            <div className="space-y-6">
              {/* Hierarchy Banner */}
              <div className="bg-linear-to-r from-violet-50 via-blue-50 to-emerald-50 border border-violet-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-violet-900 uppercase tracking-wider">
                    Struktur Hak Akses Berjenjang
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="px-3 py-1 bg-violet-600 text-white rounded-lg shadow-2xs flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    1. Super Admin
                  </span>
                  <span className="text-slate-400 font-black">&gt;</span>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow-2xs flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    2. Admin Tata Usaha
                  </span>
                  <span className="text-slate-400 font-black">&gt;</span>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg shadow-2xs flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5" />
                    3. Bendahara
                  </span>
                  <span className="text-slate-400 font-black">&gt;</span>
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-lg shadow-2xs flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    4. Kepala Sekolah
                  </span>
                  <span className="text-slate-400 font-black">&gt;</span>
                  <span className="px-3 py-1 bg-amber-600 text-white rounded-lg shadow-2xs flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5" />
                    5. Operator Sekolah
                  </span>
                </div>
              </div>

              {/* Roles Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Super Admin */}
                <div className="p-4 rounded-xl border-2 border-violet-300 bg-violet-50/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        <Crown className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">1. Super Admin (Master)</h4>
                        <span className="text-[10px] text-violet-700 font-bold">Wewenang Tertinggi &amp; Paling Lengkap</span>
                      </div>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span><strong>Fitur Paling Lengkap:</strong> Mengakses seluruh modul Admin TU, Bendahara, Kepsek, dan Operator.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span><strong>Reset Akun Semuanya:</strong> Memiliki tombol Master Reset untuk mengembalikan seluruh akun ke pengaturan pabrik.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span><strong>Kelola Pengguna:</strong> Tambah akun baru, reset password per pengguna, atau ubah identitas &amp; role siapapun.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span><strong>Konfigurasi Kop &amp; Cadangan:</strong> Akses penuh pengaturan instansi &amp; backup/restore data JSON.</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Admin Tata Usaha */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">2. Admin Tata Usaha</h4>
                      <span className="text-[10px] text-blue-700 font-bold">Koordinator Administrasi Operasional</span>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Persuratan &amp; Disposisi:</strong> Agenda surat masuk/keluar, nomor surat, lembar disposisi dinas.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Buku Induk &amp; PTK:</strong> Data lengkap siswa, mutasi, serta data pegawai/guru (PTK).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Sarpras &amp; AI Letter Studio:</strong> Inventaris ruangan dan pembuatan draf surat resmi AI.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Edit Identitas:</strong> Bisa mengubah nama profil, gelar, NIP, no telp, dan sandi sendiri.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Bendahara */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">3. Bendahara Sekolah</h4>
                      <span className="text-[10px] text-emerald-700 font-bold">Pengelola Keuangan &amp; SPP / BOS</span>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Kas &amp; SPP:</strong> Pencatatan setoran SPP siswa, DSP/Uang Pangkal, Uang Ujian.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Kwitansi &amp; BKU:</strong> Cetak kwitansi resmi bukti pembayaran &amp; rekap kas per metode bayar.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Buku Induk Siswa:</strong> Cek status data kesiswaan untuk verifikasi tunggakan.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Edit Identitas:</strong> Bisa mengubah nama profil, NIP, no telp, dan kata sandi sendiri.</span>
                    </li>
                  </ul>
                </div>

                {/* 4. Kepala Sekolah */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">4. Kepala Sekolah</h4>
                      <span className="text-[10px] text-purple-700 font-bold">Pimpinan Eksekutif Sekolah</span>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Dashboard Ringkasan Eksekutif:</strong> Statistik total siswa, PTK, anggaran kas &amp; aset.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Lembar Disposisi:</strong> Pengisian instruksi disposisi surat masuk kepada para wakasek/staf.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Pengesahan Surat &amp; TTD:</strong> Penandatanganan surat keterangan aktif, surat tugas, dsb.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Edit Identitas:</strong> Bisa mengubah nama kepala sekolah, NIP, no telp, dan kata sandi sendiri.</span>
                    </li>
                  </ul>
                </div>

                {/* 5. Operator Sekolah */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">5. Operator Sekolah</h4>
                      <span className="text-[10px] text-amber-700 font-bold">Entri Data &amp; Agenda Harian</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bertugas menginput dan memperbarui Buku Induk Siswa, mencatat agenda surat masuk &amp; surat keluar harian, serta inventarisasi barang sarana prasarana. Dapat mengubah identitas profil &amp; sandinya sendiri.
                  </p>
                </div>
              </div>

              {/* Quick Jump Action */}
              <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
                <div>
                  <h5 className="font-bold text-sm">Butuh Mengembalikan Seluruh Kredensial?</h5>
                  <p className="text-xs text-slate-300">
                    Gunakan fitur <strong>Reset Akun Semuanya</strong> jika terjadi lupa password atau ingin membersihkan konfigurasi akun.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('reset-all')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Buka Reset Akun</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Reset Akun Semuanya */}
          {activeTab === 'reset-all' && (
            <div className="space-y-6">
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 text-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-rose-900 tracking-tight">
                      Fitur Khusus Super Admin: Reset Akun Semuanya
                    </h4>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                      Tombol di bawah ini akan menghapus seluruh modifikasi username/password dan mengembalikan 5 akun resmi sekolah ke pengaturan awal pabrik secara instan.
                    </p>
                  </div>
                </div>

                {/* Default Accounts Table Preview */}
                <div className="mt-5 bg-white border border-rose-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-rose-100/60 border-b border-rose-200 font-bold text-xs text-rose-900 flex items-center justify-between">
                    <span>Daftar Akun yang Akan Dipulihkan:</span>
                    <span className="text-[11px] font-mono">Total 5 Akun Resmi</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="font-bold text-violet-800 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-violet-600" />
                        Super Admin
                      </div>
                      <div className="font-mono text-slate-700">superadmin</div>
                      <div className="font-mono text-slate-500">superadmin123</div>
                      <div className="text-slate-600">Akses Paling Lengkap &amp; Master Reset</div>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="font-bold text-blue-800 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        Admin TU
                      </div>
                      <div className="font-mono text-slate-700">admin / admintu</div>
                      <div className="font-mono text-slate-500">admin123</div>
                      <div className="text-slate-600">Persuratan, Siswa, PTK, Sarpras</div>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                        Bendahara
                      </div>
                      <div className="font-mono text-slate-700">bendahara</div>
                      <div className="font-mono text-slate-500">bendahara123</div>
                      <div className="text-slate-600">Keuangan, Kas, SPP &amp; Kwitansi</div>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="font-bold text-purple-800 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                        Kepala Sekolah
                      </div>
                      <div className="font-mono text-slate-700">kepsek</div>
                      <div className="font-mono text-slate-500">kepsek123</div>
                      <div className="text-slate-600">Ringkasan Eksekutif &amp; Disposisi</div>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-amber-600" />
                        Operator Sekolah
                      </div>
                      <div className="font-mono text-slate-700">operator</div>
                      <div className="font-mono text-slate-500">operator123</div>
                      <div className="text-slate-600">Input Siswa &amp; Agenda Harian</div>
                    </div>
                  </div>
                </div>

                {/* Reset Confirmation Button Card */}
                <div className="mt-6 pt-5 border-t border-rose-200">
                  {!confirmMasterReset ? (
                    <button
                      type="button"
                      onClick={() => setConfirmMasterReset(true)}
                      className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Akun Semuanya ke Pengaturan Awal Pabrik</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-white border-2 border-rose-600 rounded-xl space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>Konfirmasi: Yakin ingin mereset seluruh akun pengguna?</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Seluruh nama akun dan password kustom akan dikembalikan ke 5 akun bawaan (Super Admin, Admin TU, Bendahara, Kepala Sekolah, Operator).
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setConfirmMasterReset(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteMasterReset}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ya, Jalankan Reset Sekarang!</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Manage Users List */}
          {activeTab === 'manage-users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Daftar Akun Pengguna Aktif</h4>
                  <p className="text-xs text-slate-500">
                    Sebagai Super Admin, Anda dapat mengubah nama, username, password, atau mereset akun perorangan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('add-user')}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>

              {/* Editing user form overlay */}
              {editingUserId && (
                <form
                  onSubmit={handleSaveEdit}
                  className="p-4 bg-slate-50 border-2 border-violet-300 rounded-xl space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h5 className="font-bold text-xs text-violet-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-violet-600" />
                      <span>Edit Data Akun Pengguna</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setEditingUserId(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Lengkap &amp; Gelar
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Username Login
                      </label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-violet-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Kata Sandi / Password Baru
                      </label>
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-violet-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Peran / Hak Akses (Role)
                      </label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-600"
                      >
                        <option value="super_admin">Super Admin (Master)</option>
                        <option value="admin_tu">Admin Tata Usaha</option>
                        <option value="bendahara">Bendahara Sekolah</option>
                        <option value="kepsek">Kepala Sekolah</option>
                        <option value="operator">Operator Sekolah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Jabatan Resmi
                      </label>
                      <input
                        type="text"
                        value={editJabatan}
                        onChange={(e) => setEditJabatan(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        NIP / Karpeg
                      </label>
                      <input
                        type="text"
                        value={editNip}
                        onChange={(e) => setEditNip(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        No. HP / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingUserId(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              )}

              {/* Users Cards */}
              <div className="space-y-2.5">
                {users.map((u) => {
                  const isCurrentUser = currentUser?.id === u.id;
                  const isPasswordRevealed = revealedPasswords[u.id];

                  return (
                    <div
                      key={u.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl ${
                            u.avatarColor || 'bg-slate-700'
                          } text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs mt-0.5`}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {u.name}
                            </span>
                            {getRoleBadge(u.role)}
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                                Sesi Anda
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {u.jabatan} {u.nip ? `· NIP ${u.nip}` : ''}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                            <span>User: <strong className="text-slate-800 font-semibold">{u.username}</strong></span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              Pass:
                              <strong className="text-slate-800 font-semibold">
                                {isPasswordRevealed ? u.password : '••••••'}
                              </strong>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(u.id)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                title={isPasswordRevealed ? 'Sembunyikan' : 'Lihat password'}
                              >
                                {isPasswordRevealed ? (
                                  <EyeOff className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(u)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Ubah nama, username, role, atau password"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const res = adminResetUserToDefault(u.id);
                            showNotice(res.success ? 'success' : 'error', res.message);
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Reset nama dan password akun ini ke bawaan pabrik"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-600" />
                          <span>Reset Default</span>
                        </button>

                        {u.role !== 'super_admin' && u.id !== 'user-000' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus akun "${u.name}"?`)) {
                                const res = adminDeleteUser(u.id);
                                showNotice(res.success ? 'success' : 'error', res.message);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Akun Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Add New User */}
          {activeTab === 'add-user' && (
            <form onSubmit={handleCreateUser} className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-3 text-xs text-violet-900 leading-relaxed">
                Tambahkan akun staf, operator, atau wakil kepala sekolah baru ke dalam sistem dengan pembagian peran yang sesuai.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Dra. Hj. Ratna Juwita, M.Pd."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peran / Hak Akses (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white font-semibold"
                  >
                    <option value="operator">Operator Sekolah (Kesiswaan, Surat, Sarpras)</option>
                    <option value="bendahara">Bendahara (Keuangan, SPP, Kas)</option>
                    <option value="admin_tu">Admin Tata Usaha (Persuratan, PTK, Siswa, Sarpras)</option>
                    <option value="kepsek">Kepala Sekolah (Ringkasan Eksekutif, Disposisi)</option>
                    <option value="super_admin">Super Admin (Master - Seluruh Fitur)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username Login <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Contoh: ratnajuwita"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi / Password Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter, contoh: ratna123"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Resmi
                  </label>
                  <input
                    type="text"
                    value={newJabatan}
                    onChange={(e) => setNewJabatan(e.target.value)}
                    placeholder="Contoh: Staf Administrasi Kesiswaan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    placeholder="Contoh: 19850101 201001 2 005"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage-users')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambahkan Pengguna Baru</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Setiap pengguna dapat mengubah nama, NIP, no HP, dan kata sandinya sendiri melalui menu profil.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setIsUserManagementOpen(false);
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
