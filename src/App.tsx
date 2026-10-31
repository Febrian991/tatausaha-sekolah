import React, { useState, useEffect } from 'react';
import { 
  UserSession, 
  SchoolProfile, 
  SuratMasuk, 
  SuratKeluar, 
  MutasiSiswa, 
  SPPDData, 
  UndanganRapatGTKData, 
  PanggilanOrtuData, 
  ScanFileInfo,
  AppNotification,
  SiswaBukuInduk,
  TransaksiKas,
  PembayaranSiswa,
  AnggaranBOSItem
} from './types';
import { Storage } from './lib/storage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { BukuIndukView } from './components/views/BukuIndukView';
import { SuratMasukView } from './components/views/SuratMasukView';
import { SuratKeluarView } from './components/views/SuratKeluarView';
import { MutasiSiswaView } from './components/views/MutasiSiswaView';
import { TemplateSuratView } from './components/views/TemplateSuratView';
import { KeuanganView } from './components/views/KeuanganView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';

// Modals
import { SuratMasukModal } from './components/modals/SuratMasukModal';
import { SuratKeluarModal } from './components/modals/SuratKeluarModal';
import { DisposisiModal } from './components/modals/DisposisiModal';
import { MutasiModal } from './components/modals/MutasiModal';
import { LightboxViewer } from './components/common/LightboxViewer';
import { PrintSuratModal, PrintDocumentType } from './components/modals/PrintSuratModal';

export default function App() {
  // Session
  const [user, setUser] = useState<UserSession | null>(() => Storage.getSession());
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Master Data
  const [profile, setProfile] = useState<SchoolProfile>(() => Storage.getProfile());
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => Storage.getSuratMasuk());
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => Storage.getSuratKeluar());
  const [mutasiList, setMutasiList] = useState<MutasiSiswa[]>(() => Storage.getMutasi());
  const [sppdData, setSppdData] = useState<SPPDData>(() => Storage.getSPPD());
  const [undanganData, setUndanganData] = useState<UndanganRapatGTKData>(() => Storage.getUndanganRapat());
  const [panggilanData, setPanggilanData] = useState<PanggilanOrtuData>(() => Storage.getPanggilanOrtu());

  // New Data Modules: Notifications, Buku Induk, Keuangan
  const [notifications, setNotifications] = useState<AppNotification[]>(() => Storage.getNotifications());
  const [bukuIndukList, setBukuIndukList] = useState<SiswaBukuInduk[]>(() => Storage.getBukuInduk());
  const [transaksiKasList, setTransaksiKasList] = useState<TransaksiKas[]>(() => Storage.getTransaksiKas());
  const [pembayaranSiswaList, setPembayaranSiswaList] = useState<PembayaranSiswa[]>(() => Storage.getPembayaranSiswa());
  const [anggaranBOSList, setAnggaranBOSList] = useState<AnggaranBOSItem[]>(() => Storage.getAnggaranBOS());

  // Modal States
  const [isSuratMasukModalOpen, setIsSuratMasukModalOpen] = useState(false);
  const [editingSuratMasuk, setEditingSuratMasuk] = useState<SuratMasuk | null>(null);

  const [isSuratKeluarModalOpen, setIsSuratKeluarModalOpen] = useState(false);
  const [editingSuratKeluar, setEditingSuratKeluar] = useState<SuratKeluar | null>(null);

  const [isDisposisiModalOpen, setIsDisposisiModalOpen] = useState(false);
  const [disposisiTargetSurat, setDisposisiTargetSurat] = useState<SuratMasuk | null>(null);

  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
  const [editingMutasi, setEditingMutasi] = useState<MutasiSiswa | null>(null);
  const [mutasiDefaultJenis, setMutasiDefaultJenis] = useState<'masuk' | 'keluar'>('masuk');

  const [activeLightboxFile, setActiveLightboxFile] = useState<ScanFileInfo | null>(null);
  const [activePrintDocument, setActivePrintDocument] = useState<PrintDocumentType | null>(null);

  // Sync initial view with user role
  useEffect(() => {
    if (user?.role === 'bendahara') {
      setCurrentView('keuangan');
    } else if (user?.role === 'tata_usaha' || user?.role === 'kasubag_tu' || user?.role === 'staf_persuratan') {
      if (currentView === 'keuangan' || currentView === 'settings') {
        setCurrentView('dashboard');
      }
    }
  }, [user]);

  // Authentication Handlers
  const handleLogin = (newUser: UserSession) => {
    setUser(newUser);
    Storage.setSession(newUser);
    if (newUser.role === 'bendahara') {
      setCurrentView('keuangan');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    Storage.setSession(null);
  };

  // Notification Handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      Storage.setNotifications(updated);
      return updated;
    });
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    Storage.setNotifications([]);
  };

  // Surat Masuk Handlers
  const handleSaveSuratMasuk = (saved: SuratMasuk) => {
    setSuratMasukList(prev => {
      const exists = prev.some(s => s.id === saved.id);
      const updated = exists ? prev.map(s => s.id === saved.id ? saved : s) : [saved, ...prev];
      Storage.setSuratMasuk(updated);
      return updated;
    });
  };

  const handleDeleteSuratMasuk = (id: string) => {
    if (confirm('Hapus surat masuk ini dari buku agenda?')) {
      setSuratMasukList(prev => {
        const updated = prev.filter(s => s.id !== id);
        Storage.setSuratMasuk(updated);
        return updated;
      });
    }
  };

  // Surat Keluar Handlers
  const handleSaveSuratKeluar = (saved: SuratKeluar) => {
    setSuratKeluarList(prev => {
      const exists = prev.some(s => s.id === saved.id);
      const updated = exists ? prev.map(s => s.id === saved.id ? saved : s) : [saved, ...prev];
      Storage.setSuratKeluar(updated);
      return updated;
    });
  };

  const handleDeleteSuratKeluar = (id: string) => {
    if (confirm('Hapus surat keluar ini dari agenda?')) {
      setSuratKeluarList(prev => {
        const updated = prev.filter(s => s.id !== id);
        Storage.setSuratKeluar(updated);
        return updated;
      });
    }
  };

  // Mutasi Siswa & Notification Workflow Handlers
  const handleSaveMutasi = (saved: MutasiSiswa) => {
    setMutasiList(prev => {
      const exists = prev.some(m => m.id === saved.id);
      const updated = exists ? prev.map(m => m.id === saved.id ? saved : m) : [saved, ...prev];
      Storage.setMutasi(updated);
      return updated;
    });

    // Automatically trigger notification for Operator Sekolah
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Permohonan Mutasi Siswa ${saved.jenis === 'masuk' ? 'Masuk' : 'Keluar'}`,
      message: `${user?.name || 'Tata Usaha'} mengajukan berkas mutasi ${saved.jenis}: ${saved.namaSiswa} (NISN: ${saved.nisn}, Kelas: ${saved.kelas}). Menunggu verifikasi Operator Dapodik & Super Admin.`,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: saved.jenis === 'masuk' ? 'mutasi_masuk' : 'mutasi_keluar',
      mutasiId: saved.id,
      diajukanOleh: user?.name || 'Tata Usaha',
    };

    setNotifications(prev => {
      const updatedNotifs = [newNotif, ...prev];
      Storage.setNotifications(updatedNotifs);
      return updatedNotifs;
    });

    // Also sync to Buku Induk if mutasi masuk
    if (saved.jenis === 'masuk') {
      setBukuIndukList(prev => {
        const existingSiswa = prev.find(s => s.nisn === saved.nisn);
        if (!existingSiswa) {
          const newSiswa: SiswaBukuInduk = {
            id: `sis-${Date.now()}`,
            nis: saved.nis || `${Math.floor(24251000 + Math.random() * 900)}`,
            nisn: saved.nisn,
            namaLengkap: saved.namaSiswa,
            jenisKelamin: saved.jenisKelamin,
            kelas: saved.kelas,
            tempatLahir: saved.tempatTanggalLahir.split(',')[0] || 'Bandung',
            tanggalLahir: '2009-01-01',
            agama: 'Islam',
            namaAyah: 'Orang Tua Siswa',
            namaIbu: 'Ibu Siswa',
            pekerjaanOrtu: 'PNS/Swasta',
            alamatSiswa: 'Alamat Siswa Mutasi Masuk',
            telepon: '08123456789',
            statusSiswa: 'Mutasi Masuk',
            sekolahAsal: saved.sekolahAsal,
          };
          const updated = [newSiswa, ...prev];
          Storage.setBukuInduk(updated);
          return updated;
        }
        return prev;
      });
    }
  };

  const handleDeleteMutasi = (id: string) => {
    if (confirm('Hapus data mutasi siswa ini?')) {
      setMutasiList(prev => {
        const updated = prev.filter(m => m.id !== id);
        Storage.setMutasi(updated);
        return updated;
      });
    }
  };

  const handleUpdateStatusDapodik = (id: string, newStatus: MutasiSiswa['statusDapodik']) => {
    setMutasiList(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, statusDapodik: newStatus } : m);
      Storage.setMutasi(updated);
      return updated;
    });
  };

  // Operator Sekolah Approval Actions
  const handleApproveMutasi = (id: string) => {
    setMutasiList(prev => {
      const target = prev.find(m => m.id === id);
      if (!target) return prev;
      const updated = prev.map(m => m.id === id ? {
        ...m,
        statusPengajuan: 'Disetujui Operator' as const,
        statusDapodik: (m.jenis === 'masuk' ? 'Sudah Sinkron' : 'Dikeluarkan') as MutasiSiswa['statusDapodik'],
        catatanOperator: `Disetujui dan disinkronkan ke Dapodik oleh ${user?.name || 'Operator Sekolah'}.`,
      } : m);
      Storage.setMutasi(updated);
      return updated;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Mutasi Telah Disetujui Operator',
      message: `Permohonan mutasi siswa telah disetujui oleh Operator Sekolah & disinkronkan ke laman sp.datadik.`,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'sistem',
    };
    setNotifications(prev => {
      const updated = [notif, ...prev];
      Storage.setNotifications(updated);
      return updated;
    });
  };

  const handleRejectMutasi = (id: string, catatan: string) => {
    setMutasiList(prev => {
      const updated = prev.map(m => m.id === id ? {
        ...m,
        statusPengajuan: 'Ditolak Operator' as const,
        catatanOperator: catatan,
      } : m);
      Storage.setMutasi(updated);
      return updated;
    });
  };

  // Buku Induk Handlers
  const handleAddSiswaBukuInduk = (siswa: SiswaBukuInduk) => {
    setBukuIndukList(prev => {
      const updated = [siswa, ...prev];
      Storage.setBukuInduk(updated);
      return updated;
    });
  };

  const handleEditSiswaBukuInduk = (siswa: SiswaBukuInduk) => {
    setBukuIndukList(prev => {
      const updated = prev.map(s => s.id === siswa.id ? siswa : s);
      Storage.setBukuInduk(updated);
      return updated;
    });
  };

  const handleDeleteSiswaBukuInduk = (id: string) => {
    setBukuIndukList(prev => {
      const updated = prev.filter(s => s.id !== id);
      Storage.setBukuInduk(updated);
      return updated;
    });
  };

  // Keuangan Handlers
  const handleAddTransaksiKas = (item: TransaksiKas) => {
    setTransaksiKasList(prev => {
      const updated = [item, ...prev];
      Storage.setTransaksiKas(updated);
      return updated;
    });
  };

  const handleAddPembayaranSiswa = (item: PembayaranSiswa) => {
    setPembayaranSiswaList(prev => {
      const updated = [item, ...prev];
      Storage.setPembayaranSiswa(updated);
      return updated;
    });

    // Also auto-record into BKU kas masuk
    const autoKas: TransaksiKas = {
      id: `kas-auto-${Date.now()}`,
      tanggal: item.tanggal,
      kodeAkun: '4.1.2.03',
      keterangan: `Penerimaan ${item.jenisPembayaran} a.n. ${item.namaSiswa} (${item.kelas}) - ${item.noKwitansi}`,
      jenis: 'masuk',
      kategori: 'SPP/Iuran Siswa',
      jumlah: item.jumlah,
      saldo: (transaksiKasList[0]?.saldo || 0) + item.jumlah,
      noBukti: item.noKwitansi,
      petugas: item.penerima,
    };
    handleAddTransaksiKas(autoKas);
  };

  // Settings & Templates Handlers
  const handleSaveProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
    Storage.setProfile(newProfile);
  };

  const handleSaveSPPD = (data: SPPDData) => {
    setSppdData(data);
    Storage.setSPPD(data);
  };

  const handleSaveUndangan = (data: UndanganRapatGTKData) => {
    setUndanganData(data);
    Storage.setUndanganRapat(data);
  };

  const handleSavePanggilan = (data: PanggilanOrtuData) => {
    setPanggilanData(data);
    Storage.setPanggilanOrtu(data);
  };

  const handleResetDefaults = () => {
    Storage.resetAll();
    setProfile(Storage.getProfile());
    setSuratMasukList(Storage.getSuratMasuk());
    setSuratKeluarList(Storage.getSuratKeluar());
    setMutasiList(Storage.getMutasi());
    setSppdData(Storage.getSPPD());
    setUndanganData(Storage.getUndanganRapat());
    setPanggilanData(Storage.getPanggilanOrtu());
    setNotifications(Storage.getNotifications());
    setBukuIndukList(Storage.getBukuInduk());
    setTransaksiKasList(Storage.getTransaksiKas());
    setPembayaranSiswaList(Storage.getPembayaranSiswa());
    setAnggaranBOSList(Storage.getAnggaranBOS());
  };

  const handleImportBackup = (jsonStr: string) => {
    const ok = Storage.importBackupJson(jsonStr);
    if (ok) {
      setProfile(Storage.getProfile());
      setSuratMasukList(Storage.getSuratMasuk());
      setSuratKeluarList(Storage.getSuratKeluar());
      setMutasiList(Storage.getMutasi());
      setSppdData(Storage.getSPPD());
      setUndanganData(Storage.getUndanganRapat());
      setPanggilanData(Storage.getPanggilanOrtu());
      setNotifications(Storage.getNotifications());
      setBukuIndukList(Storage.getBukuInduk());
      setTransaksiKasList(Storage.getTransaksiKas());
      setPembayaranSiswaList(Storage.getPembayaranSiswa());
      setAnggaranBOSList(Storage.getAnggaranBOS());
    }
    return ok;
  };

  // If user is not logged in, show secure Login View
  if (!user) {
    return (
      <LoginView
        profile={profile}
        onLoginSuccess={handleLogin}
      />
    );
  }

  const pendingDisposisiCount = suratMasukList.filter(s => s.statusDisposisi === 'Belum').length;
  const pendingMutasiCount = mutasiList.filter(m => m.statusPengajuan === 'Menunggu Persetujuan Operator').length;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        user={user}
        onSelectView={setCurrentView}
        pendingDisposisiCount={pendingDisposisiCount}
        pendingMutasiCount={pendingMutasiCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentView={currentView}
          user={user}
          profile={profile}
          notifications={notifications}
          onLogout={handleLogout}
          onOpenQuickPrint={() => setActivePrintDocument({ type: 'undangan', data: undanganData })}
          onNavigate={setCurrentView}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearNotifications={handleClearNotifications}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              mutasiList={mutasiList}
              profile={profile}
              onNavigate={setCurrentView}
              onOpenSuratMasukModal={() => {
                setEditingSuratMasuk(null);
                setIsSuratMasukModalOpen(true);
              }}
              onOpenSuratKeluarModal={() => {
                setEditingSuratKeluar(null);
                setIsSuratKeluarModalOpen(true);
              }}
              onOpenMutasiModal={() => {
                setEditingMutasi(null);
                setMutasiDefaultJenis('masuk');
                setIsMutasiModalOpen(true);
              }}
              onOpenLightbox={setActiveLightboxFile}
              onPrintDocument={(type) => {
                if (type === 'sppd') setActivePrintDocument({ type: 'sppd', data: sppdData });
                else if (type === 'undangan') setActivePrintDocument({ type: 'undangan', data: undanganData });
                else if (type === 'panggilan') setActivePrintDocument({ type: 'panggilan', data: panggilanData });
              }}
            />
          )}

          {currentView === 'buku-induk' && (
            <BukuIndukView
              user={user}
              profile={profile}
              bukuIndukList={bukuIndukList}
              onAddSiswa={handleAddSiswaBukuInduk}
              onEditSiswa={handleEditSiswaBukuInduk}
              onDeleteSiswa={handleDeleteSiswaBukuInduk}
            />
          )}

          {currentView === 'surat-masuk' && (
            <SuratMasukView
              suratList={suratMasukList}
              onAddSurat={() => {
                setEditingSuratMasuk(null);
                setIsSuratMasukModalOpen(true);
              }}
              onEditSurat={(surat) => {
                setEditingSuratMasuk(surat);
                setIsSuratMasukModalOpen(true);
              }}
              onDeleteSurat={handleDeleteSuratMasuk}
              onOpenDisposisi={(surat) => {
                setDisposisiTargetSurat(surat);
                setIsDisposisiModalOpen(true);
              }}
              onOpenLightbox={setActiveLightboxFile}
              onPrintDisposisi={(surat) => {
                setActivePrintDocument({ type: 'disposisi', data: surat });
              }}
            />
          )}

          {currentView === 'surat-keluar' && (
            <SuratKeluarView
              suratList={suratKeluarList}
              onAddSurat={() => {
                setEditingSuratKeluar(null);
                setIsSuratKeluarModalOpen(true);
              }}
              onEditSurat={(surat) => {
                setEditingSuratKeluar(surat);
                setIsSuratKeluarModalOpen(true);
              }}
              onDeleteSurat={handleDeleteSuratKeluar}
              onOpenLightbox={setActiveLightboxFile}
            />
          )}

          {currentView === 'mutasi' && (
            <MutasiSiswaView
              user={user}
              mutasiList={mutasiList}
              onAddMutasi={(jenis) => {
                setEditingMutasi(null);
                setMutasiDefaultJenis(jenis);
                setIsMutasiModalOpen(true);
              }}
              onEditMutasi={(item) => {
                setEditingMutasi(item);
                setIsMutasiModalOpen(true);
              }}
              onDeleteMutasi={handleDeleteMutasi}
              onOpenLightbox={setActiveLightboxFile}
              onPrintMutasi={(item) => {
                setActivePrintDocument({ type: 'mutasi', data: item });
              }}
              onUpdateStatusDapodik={handleUpdateStatusDapodik}
              onApproveMutasi={handleApproveMutasi}
              onRejectMutasi={handleRejectMutasi}
            />
          )}

          {currentView === 'template' && (
            <TemplateSuratView
              sppdData={sppdData}
              undanganData={undanganData}
              panggilanData={panggilanData}
              profile={profile}
              onSaveSPPD={handleSaveSPPD}
              onSaveUndangan={handleSaveUndangan}
              onSavePanggilan={handleSavePanggilan}
              onPrintDocument={(type) => {
                if (type === 'sppd') setActivePrintDocument({ type: 'sppd', data: sppdData });
                else if (type === 'undangan') setActivePrintDocument({ type: 'undangan', data: undanganData });
                else if (type === 'panggilan') setActivePrintDocument({ type: 'panggilan', data: panggilanData });
              }}
            />
          )}

          {currentView === 'keuangan' && (
            <KeuanganView
              user={user}
              profile={profile}
              transaksiKasList={transaksiKasList}
              pembayaranSiswaList={pembayaranSiswaList}
              anggaranBOSList={anggaranBOSList}
              onAddTransaksiKas={handleAddTransaksiKas}
              onAddPembayaranSiswa={handleAddPembayaranSiswa}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onExportBackup={Storage.exportBackupJson}
              onImportBackup={handleImportBackup}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>

      {/* MODAL 1: Surat Masuk */}
      <SuratMasukModal
        surat={editingSuratMasuk}
        isOpen={isSuratMasukModalOpen}
        onClose={() => {
          setIsSuratMasukModalOpen(false);
          setEditingSuratMasuk(null);
        }}
        onSave={handleSaveSuratMasuk}
      />

      {/* MODAL 2: Surat Keluar */}
      <SuratKeluarModal
        surat={editingSuratKeluar}
        profile={profile}
        isOpen={isSuratKeluarModalOpen}
        onClose={() => {
          setIsSuratKeluarModalOpen(false);
          setEditingSuratKeluar(null);
        }}
        onSave={handleSaveSuratKeluar}
      />

      {/* MODAL 3: Lembar Disposisi */}
      <DisposisiModal
        surat={disposisiTargetSurat}
        profile={profile}
        isOpen={isDisposisiModalOpen}
        onClose={() => {
          setIsDisposisiModalOpen(false);
          setDisposisiTargetSurat(null);
        }}
        onSave={handleSaveSuratMasuk}
        onPrintPreview={(surat) => {
          setIsDisposisiModalOpen(false);
          setActivePrintDocument({ type: 'disposisi', data: surat });
        }}
      />

      {/* MODAL 4: Mutasi Siswa Dapodik */}
      <MutasiModal
        user={user}
        mutasi={editingMutasi}
        defaultJenis={mutasiDefaultJenis}
        isOpen={isMutasiModalOpen}
        onClose={() => {
          setIsMutasiModalOpen(false);
          setEditingMutasi(null);
        }}
        onSave={handleSaveMutasi}
      />

      {/* MODAL 5: Lightbox Scan Fisik Viewer */}
      <LightboxViewer
        scanFile={activeLightboxFile}
        onClose={() => setActiveLightboxFile(null)}
      />

      {/* MODAL 6: Official A4 Document Print Preview */}
      <PrintSuratModal
        document={activePrintDocument}
        profile={profile}
        isOpen={!!activePrintDocument}
        onClose={() => setActivePrintDocument(null)}
      />
    </div>
  );
}
