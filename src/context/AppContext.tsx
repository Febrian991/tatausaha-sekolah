import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  SchoolProfile,
  Student,
  Staff,
  Mail,
  SPPTransaction,
  InventoryItem,
  PrintableDocumentData,
  UserAccount,
} from '../types/index.ts';
import {
  defaultSchoolProfile,
  defaultStudents,
  defaultStaff,
  defaultMails,
  defaultSPPTransactions,
  defaultInventory,
  defaultUsers,
  StoredUser,
} from '../data/initialData.ts';

interface AppContextType {
  currentUser: UserAccount | null;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message?: string };
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: (open: boolean) => void;
  isUserManagementOpen: boolean;
  setIsUserManagementOpen: (open: boolean) => void;
  users: StoredUser[];
  updateUserProfile: (data: {
    name?: string;
    nip?: string;
    jabatan?: string;
    roleLabel?: string;
    phone?: string;
    username?: string;
  }) => { success: boolean; message?: string };
  resetAllAccounts: () => { success: boolean; message: string };
  adminResetUserPassword: (userId: string, newPassword?: string) => { success: boolean; message: string };
  adminResetUserToDefault: (userId: string) => { success: boolean; message: string };
  adminUpdateUser: (userId: string, data: Partial<StoredUser>) => { success: boolean; message: string };
  adminAddUser: (user: Omit<StoredUser, 'id'>) => { success: boolean; message: string };
  adminDeleteUser: (userId: string) => { success: boolean; message: string };
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  staff: Staff[];
  addStaff: (member: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, member: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  mails: Mail[];
  addMail: (mail: Omit<Mail, 'id' | 'noAgenda'>) => void;
  updateMail: (id: string, mail: Partial<Mail>) => void;
  deleteMail: (id: string) => void;
  transactions: SPPTransaction[];
  addTransaction: (tx: Omit<SPPTransaction, 'id' | 'noKwitansi'>) => SPPTransaction;
  deleteTransaction: (id: string) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  printDoc: PrintableDocumentData | null;
  openPrintModal: (doc: PrintableDocumentData) => void;
  closePrintModal: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isBackupOpen: boolean;
  setIsBackupOpen: (open: boolean) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  resetAllData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => { success: boolean; message: string };
  // Quick stats
  stats: {
    activeStudents: number;
    totalStaff: number;
    pendingDispositions: number;
    monthlyIncome: number;
    damagedInventory: number;
  };
}

const STORAGE_KEY = 'si_tatausaha_db_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_school`);
      return saved ? JSON.parse(saved) : defaultSchoolProfile;
    } catch {
      return defaultSchoolProfile;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : defaultStudents;
    } catch {
      return defaultStudents;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
      return saved ? JSON.parse(saved) : defaultStaff;
    } catch {
      return defaultStaff;
    }
  });

  const [mails, setMails] = useState<Mail[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mails`);
      return saved ? JSON.parse(saved) : defaultMails;
    } catch {
      return defaultMails;
    }
  });

  const [transactions, setTransactions] = useState<SPPTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      return saved ? JSON.parse(saved) : defaultSPPTransactions;
    } catch {
      return defaultSPPTransactions;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : defaultInventory;
    } catch {
      return defaultInventory;
    }
  });

  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      if (!saved) return defaultUsers;
      const parsed: StoredUser[] = JSON.parse(saved);
      // Ensure super_admin exists in user list
      const hasSuperAdmin = parsed.some(
        (u) => u.role === 'super_admin' || u.username === 'superadmin'
      );
      if (!hasSuperAdmin) {
        return defaultUsers;
      }
      return parsed;
    } catch {
      return defaultUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [printDoc, setPrintDoc] = useState<PrintableDocumentData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_school`, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mails`, JSON.stringify(mails));
  }, [mails]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  // Profile actions
  const updateSchoolProfile = (partial: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...partial }));
  };

  // Student actions
  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `std-${Date.now().toString().slice(-4)}`;
    setStudents((prev) => [ { id, ...newStudent }, ...prev ]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Staff actions
  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const id = `stf-${Date.now().toString().slice(-4)}`;
    setStaff((prev) => [ { id, ...newStaff }, ...prev ]);
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // Mail actions
  const addMail = (newMail: Omit<Mail, 'id' | 'noAgenda'>) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const seq = String(mails.length + 1).padStart(4, '0');
    const prefix = newMail.jenis === 'Masuk' ? 'AG-M' : 'AG-K';
    const noAgenda = `${prefix}/${year}/${month}/${seq}`;
    const id = `mail-${Date.now().toString().slice(-4)}`;
    setMails((prev) => [ { id, noAgenda, ...newMail }, ...prev ]);
  };

  const updateMail = (id: string, updated: Partial<Mail>) => {
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMail = (id: string) => {
    setMails((prev) => prev.filter((m) => m.id !== id));
  };

  // Finance / SPP actions
  const addTransaction = (newTx: Omit<SPPTransaction, 'id' | 'noKwitansi'>) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const seq = String(transactions.length + 1).padStart(5, '0');
    const noKwitansi = `KW-TU/${year}/${month}/${seq}`;
    const id = `trx-${Date.now().toString().slice(-4)}`;
    const tx = { id, noKwitansi, ...newTx };
    setTransactions((prev) => [ tx, ...prev ]);
    return tx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Inventory actions
  const addInventoryItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const id = `inv-${Date.now().toString().slice(-4)}`;
    setInventory((prev) => [ { id, ...newItem }, ...prev ]);
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  // Print Modal
  const openPrintModal = (doc: PrintableDocumentData) => {
    setPrintDoc(doc);
  };

  const closePrintModal = () => {
    setPrintDoc(null);
  };

  // Reset to initial
  const resetAllData = () => {
    setSchoolProfile(defaultSchoolProfile);
    setStudents(defaultStudents);
    setStaff(defaultStaff);
    setMails(defaultMails);
    setTransactions(defaultSPPTransactions);
    setInventory(defaultInventory);
    localStorage.removeItem(`${STORAGE_KEY}_school`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_staff`);
    localStorage.removeItem(`${STORAGE_KEY}_mails`);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_inventory`);
  };

  // Backup & Restore
  const exportDataJSON = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      schoolProfile,
      students,
      staff,
      mails,
      transactions,
      inventory,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_tatausaha_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.schoolProfile || !data.students) {
        return { success: false, message: 'Format berkas JSON cadangan tidak valid.' };
      }
      setSchoolProfile(data.schoolProfile);
      setStudents(data.students || []);
      setStaff(data.staff || []);
      setMails(data.mails || []);
      setTransactions(data.transactions || []);
      setInventory(data.inventory || []);
      return { success: true, message: 'Data tata usaha berhasil dipulihkan.' };
    } catch (err: any) {
      return { success: false, message: `Gagal membaca file: ${err.message}` };
    }
  };

  const login = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check direct match or alias (e.g. admintu -> admin)
    const found = users.find((u) => {
      const matchName =
        u.username.toLowerCase() === cleanUser ||
        (cleanUser === 'admintu' && u.username.toLowerCase() === 'admin') ||
        (cleanUser === 'admin' && u.username.toLowerCase() === 'admintu');
      return matchName && u.password === cleanPass;
    });

    if (!found) {
      return {
        success: false,
        message: 'Username atau kata sandi tidak cocok. Silakan periksa kembali!',
      };
    }
    const { password: _, ...accountOnly } = found;
    setCurrentUser(accountOnly);

    // Role-based view redirect
    if (found.role === 'bendahara') {
      setCurrentView('finance');
    } else if (found.role === 'operator' || found.role === 'staf_tu') {
      setCurrentView('students');
    } else {
      setCurrentView('dashboard');
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Sesi pengguna tidak aktif.' };
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) return { success: false, message: 'Data pengguna tidak ditemukan.' };
    if (users[userIndex].password !== oldPass) {
      return { success: false, message: 'Kata sandi lama Anda tidak sesuai!' };
    }
    if (newPass.length < 4) {
      return { success: false, message: 'Kata sandi baru minimal 4 karakter.' };
    }
    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPass };
    setUsers(updatedUsers);
    return { success: true, message: 'Kata sandi Anda berhasil diperbarui.' };
  };

  // Setiap pengguna bisa mengedit sendiri identitas profilnya (Nama, NIP, Jabatan, RoleLabel, Phone, Username)
  const updateUserProfile = (data: {
    name?: string;
    nip?: string;
    jabatan?: string;
    roleLabel?: string;
    phone?: string;
    username?: string;
  }) => {
    if (!currentUser) return { success: false, message: 'Sesi pengguna tidak aktif.' };

    // If changing username, ensure uniqueness
    if (data.username && data.username.toLowerCase() !== currentUser.username.toLowerCase()) {
      const cleanUsername = data.username.trim().toLowerCase();
      const isTaken = users.some(
        (u) => u.id !== currentUser.id && u.username.toLowerCase() === cleanUsername
      );
      if (isTaken) {
        return { success: false, message: `Username "${data.username}" sudah digunakan oleh akun lain.` };
      }
    }

    const updatedAccount: UserAccount = {
      ...currentUser,
      ...data,
      name: data.name !== undefined ? data.name.trim() : currentUser.name,
      username: data.username !== undefined ? data.username.trim().toLowerCase() : currentUser.username,
      nip: data.nip !== undefined ? data.nip.trim() : currentUser.nip,
      jabatan: data.jabatan !== undefined ? data.jabatan.trim() : currentUser.jabatan,
      roleLabel: data.roleLabel !== undefined ? data.roleLabel.trim() : currentUser.roleLabel,
      phone: data.phone !== undefined ? data.phone.trim() : currentUser.phone,
    };

    setCurrentUser(updatedAccount);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              ...data,
              name: updatedAccount.name,
              username: updatedAccount.username,
              nip: updatedAccount.nip,
              jabatan: updatedAccount.jabatan,
              roleLabel: updatedAccount.roleLabel,
              phone: updatedAccount.phone,
            }
          : u
      )
    );

    return { success: true, message: 'Identitas profil berhasil diperbarui.' };
  };

  // SUPER ADMIN EXCLUSIVE: Reset Akun Semuanya ke Default
  const resetAllAccounts = () => {
    setUsers(defaultUsers);
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(defaultUsers));

    // If currently logged in as Super Admin, update current session to default Super Admin
    if (currentUser?.role === 'super_admin' || currentUser?.id === 'user-000') {
      const { password: _, ...superAdminAccount } = defaultUsers[0];
      setCurrentUser(superAdminAccount);
    }

    return {
      success: true,
      message: 'Seluruh akun (Super Admin, Admin TU, Bendahara, Kepsek, Operator) berhasil di-reset ke data dan sandi awal pabrik!',
    };
  };

  // Super Admin: Reset password specific user
  const adminResetUserPassword = (userId: string, newPassword?: string) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return { success: false, message: 'Pengguna tidak ditemukan.' };

    const defaultMatch = defaultUsers.find((d) => d.id === userId || d.username === users[userIndex].username);
    const targetPassword = newPassword || defaultMatch?.password || '123456';

    const updated = [...users];
    updated[userIndex] = { ...updated[userIndex], password: targetPassword };
    setUsers(updated);

    return {
      success: true,
      message: `Kata sandi akun ${users[userIndex].name} berhasil di-reset menjadi "${targetPassword}".`,
    };
  };

  // Super Admin: Reset specific user profile to default
  const adminResetUserToDefault = (userId: string) => {
    const defaultMatch = defaultUsers.find((d) => d.id === userId);
    if (!defaultMatch) return { success: false, message: 'Data default pengguna tidak ditemukan.' };

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...defaultMatch } : u)));
    if (currentUser?.id === userId) {
      const { password: _, ...cleanAccount } = defaultMatch;
      setCurrentUser(cleanAccount);
    }

    return {
      success: true,
      message: `Akun ${defaultMatch.name} berhasil dikembalikan ke pengaturan default.`,
    };
  };

  // Super Admin: Update user details
  const adminUpdateUser = (userId: string, data: Partial<StoredUser>) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return { success: false, message: 'Pengguna tidak ditemukan.' };

    const updated = [...users];
    updated[userIndex] = { ...updated[userIndex], ...data };
    setUsers(updated);

    if (currentUser?.id === userId) {
      const { password: _, ...cleanAccount } = updated[userIndex];
      setCurrentUser(cleanAccount);
    }

    return { success: true, message: 'Data pengguna berhasil diperbarui.' };
  };

  // Super Admin: Add new user
  const adminAddUser = (user: Omit<StoredUser, 'id'>) => {
    const cleanUsername = user.username.trim().toLowerCase();
    const exists = users.some((u) => u.username.toLowerCase() === cleanUsername);
    if (exists) {
      return { success: false, message: `Username "${user.username}" sudah digunakan!` };
    }

    const id = `user-${Date.now().toString().slice(-4)}`;
    const newUser: StoredUser = { ...user, id, username: cleanUsername };
    setUsers((prev) => [...prev, newUser]);
    return { success: true, message: `Akun baru "${user.name}" berhasil ditambahkan.` };
  };

  // Super Admin: Delete user
  const adminDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, message: 'Pengguna tidak ditemukan.' };
    if (target.role === 'super_admin' || target.id === 'user-000') {
      return { success: false, message: 'Akun Super Admin utama tidak dapat dihapus!' };
    }
    if (currentUser?.id === userId) {
      return { success: false, message: 'Anda tidak dapat menghapus akun yang sedang aktif digunakan!' };
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return { success: true, message: `Akun "${target.name}" berhasil dihapus.` };
  };

  // Calculated stats
  const activeStudents = students.filter((s) => s.status === 'Aktif').length;
  const totalStaff = staff.filter((s) => s.statusAktif).length;
  const pendingDispositions = mails.filter((m) => m.jenis === 'Masuk' && m.statusDisposisi === 'Belum').length;
  const monthlyIncome = transactions.reduce((acc, curr) => acc + (curr.nominal || 0), 0);
  const damagedInventory = inventory.filter((i) => i.kondisi !== 'Baik').length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        changePassword,
        updateUserProfile,
        isChangePasswordOpen,
        setIsChangePasswordOpen,
        isUserManagementOpen,
        setIsUserManagementOpen,
        users,
        resetAllAccounts,
        adminResetUserPassword,
        adminResetUserToDefault,
        adminUpdateUser,
        adminAddUser,
        adminDeleteUser,
        currentView,
        setCurrentView,
        schoolProfile,
        updateSchoolProfile,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        mails,
        addMail,
        updateMail,
        deleteMail,
        transactions,
        addTransaction,
        deleteTransaction,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        printDoc,
        openPrintModal,
        closePrintModal,
        isSettingsOpen,
        setIsSettingsOpen,
        isBackupOpen,
        setIsBackupOpen,
        isGuideOpen,
        setIsGuideOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        resetAllData,
        exportDataJSON,
        importDataJSON,
        stats: {
          activeStudents,
          totalStaff,
          pendingDispositions,
          monthlyIncome,
          damagedInventory,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
