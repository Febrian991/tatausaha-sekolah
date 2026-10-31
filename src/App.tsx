import React, { useState } from 'react';
import { 
  UserSession, 
  SchoolProfile, 
  SuratMasuk, 
  SuratKeluar, 
  MutasiSiswa, 
  SPPDData, 
  UndanganRapatGTKData, 
  PanggilanOrtuData, 
  ScanFileInfo 
} from './types';
import { Storage } from './lib/storage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { SuratMasukView } from './components/views/SuratMasukView';
import { SuratKeluarView } from './components/views/SuratKeluarView';
import { MutasiSiswaView } from './components/views/MutasiSiswaView';
import { TemplateSuratView } from './components/views/TemplateSuratView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';

// Modals
import { SuratMasukModal } from './components/modals/SuratMasukModal';
import { SuratKeluarModal } from './components/modals/SuratKeluarModal';
import { DisposisiModal } from './components/modals/DisposisiModal';
import { MutasiModal } from './components/modals/MutasiModal';
import { LightboxViewer } from './components/common/LightboxViewer';
import { PrintSuratModal, PrintDocumentType } from './components/modals/PrintSuratModal';
import { CodeViewerModal } from './components/modals/CodeViewerModal';
import { downloadProjectZip } from './lib/downloadHelper';

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
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);

  // Authentication Handlers
  const handleLogin = (newUser: UserSession) => {
    setUser(newUser);
    Storage.setSession(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    Storage.setSession(null);
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

  // Mutasi Siswa Handlers
  const handleSaveMutasi = (saved: MutasiSiswa) => {
    setMutasiList(prev => {
      const exists = prev.some(m => m.id === saved.id);
      const updated = exists ? prev.map(m => m.id === saved.id ? saved : m) : [saved, ...prev];
      Storage.setMutasi(updated);
      return updated;
    });
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
    }
    return ok;
  };

  // If user is not logged in, show secure Login View
  if (!user) {
    return (
      <>
        <LoginView
          profile={profile}
          onLoginSuccess={handleLogin}
          onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
          onDownloadZip={downloadProjectZip}
        />
        <CodeViewerModal
          isOpen={isCodeViewerOpen}
          onClose={() => setIsCodeViewerOpen(false)}
          onDownloadZip={downloadProjectZip}
        />
      </>
    );
  }

  const pendingDisposisiCount = suratMasukList.filter(s => s.statusDisposisi === 'Belum').length;
  const pendingMutasiCount = mutasiList.filter(m => m.statusDapodik === 'Proses Tarik' || m.statusDapodik === 'Validasi Cabdis').length;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
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
          onLogout={handleLogout}
          onOpenQuickPrint={() => setActivePrintDocument({ type: 'undangan', data: undanganData })}
          onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
          onDownloadZip={downloadProjectZip}
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
              onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
              onDownloadZip={downloadProjectZip}
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

      {/* MODAL 7: Source Code Explorer & Downloader */}
      <CodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
        onDownloadZip={downloadProjectZip}
      />
    </div>
  );
}
