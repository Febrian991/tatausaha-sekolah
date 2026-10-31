/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolProfile, SuratKedinasan, MutasiSiswa, ArsipDigital } from './types/situ';
import { 
  DEFAULT_SCHOOL_PROFILE, 
  INITIAL_MUTASI_SISWA, 
  INITIAL_ARSIP_DIGITAL 
} from './utils/mockSituData';
import { SituTopNav } from './components/layout/SituTopNav';
import { GeneratorSuratView } from './components/views/GeneratorSuratView';
import { MutasiSiswaView } from './components/views/MutasiSiswaView';
import { ArsipDigitalView } from './components/views/ArsipDigitalView';
import { PengaturanKopView } from './components/views/PengaturanKopView';
import { SuratViewerModal } from './components/SuratViewerModal';
import { Check, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'surat' | 'mutasi' | 'arsip' | 'pengaturan'>('surat');

  // Persistent States
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('situ_school_profile');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_PROFILE;
  });

  const [mutasiList, setMutasiList] = useState<MutasiSiswa[]>(() => {
    const saved = localStorage.getItem('situ_mutasi_list');
    return saved ? JSON.parse(saved) : INITIAL_MUTASI_SISWA;
  });

  const [arsipList, setArsipList] = useState<ArsipDigital[]>(() => {
    const saved = localStorage.getItem('situ_arsip_list');
    return saved ? JSON.parse(saved) : INITIAL_ARSIP_DIGITAL;
  });

  // Modal State for Full Screen Print / Preview
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratKedinasan | null>(null);
  const [selectedMutasi, setSelectedMutasi] = useState<MutasiSiswa | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('situ_school_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('situ_mutasi_list', JSON.stringify(mutasiList));
  }, [mutasiList]);

  useEffect(() => {
    localStorage.setItem('situ_arsip_list', JSON.stringify(arsipList));
  }, [arsipList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePreviewSurat = (surat: SuratKedinasan) => {
    setSelectedSurat(surat);
    setSelectedMutasi(null);
    setModalOpen(true);
  };

  const handleCetakSuratPindah = (mutasi: MutasiSiswa) => {
    setSelectedMutasi(mutasi);
    setSelectedSurat(null);
    setModalOpen(true);
  };

  const handleSimpanArsip = (surat: SuratKedinasan) => {
    const newArsip: ArsipDigital = {
      id: `ARS-${Date.now()}`,
      jenis: 'KELUAR',
      nomorAgenda: `AGD/${new Date().getFullYear()}/X/0${Math.floor(160 + Math.random() * 40)}`,
      nomorSurat: surat.nomorSurat,
      tanggalSurat: surat.titiMangsa.tanggal,
      tanggalTerimaKirim: new Date().toISOString().split('T')[0],
      pengirimPenerima: surat.konten.tujuanNama || 'Seluruh Penerima Surat',
      perihal: surat.perihal,
      kategori: 'Kepegawaian',
      disposisiPimpinan: 'Disetujui dan diarsipkan di Urusan Tata Usaha.',
      statusTindakLanjut: 'Selesai',
      namaFileScan: `${surat.jenis}_${surat.nomorSurat.replace(/\//g, '_')}.pdf`,
      ukuranFile: '540 KB',
      catatanPetugas: 'Diterbitkan melalui Generator Naskah Dinas SI-TU'
    };

    setArsipList((prev) => [newArsip, ...prev]);
    showToast('Naskah Dinas berhasil disimpan ke Buku Agenda Surat Keluar!');
  };

  const handleAddMutasi = (newMutasi: MutasiSiswa) => {
    setMutasiList((prev) => [newMutasi, ...prev]);
    showToast('Data mutasi siswa berhasil dicatat dan disinkronkan!');
  };

  const handleAddArsip = (newArsip: ArsipDigital) => {
    setArsipList((prev) => [newArsip, ...prev]);
    showToast('Surat baru berhasil dicatat di Buku Agenda Kearsipan!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Official Top Navigation */}
      <SituTopNav activeView={activeView} setActiveView={setActiveView} />

      {/* Mobile Tab Strip (Only for small screens) */}
      <div className="flex md:hidden items-center justify-around bg-white border-b border-slate-200 px-2 py-2 text-xs font-semibold no-print">
        <button
          onClick={() => setActiveView('surat')}
          className={`px-2 py-1 rounded ${activeView === 'surat' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'}`}
        >
          Persuratan
        </button>
        <button
          onClick={() => setActiveView('mutasi')}
          className={`px-2 py-1 rounded ${activeView === 'mutasi' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'}`}
        >
          Mutasi Siswa
        </button>
        <button
          onClick={() => setActiveView('arsip')}
          className={`px-2 py-1 rounded ${activeView === 'arsip' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'}`}
        >
          Arsip Scan
        </button>
        <button
          onClick={() => setActiveView('pengaturan')}
          className={`px-2 py-1 rounded ${activeView === 'pengaturan' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'}`}
        >
          Kop & Titi
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Administrative Views */}
      <main className="flex-1">
        {activeView === 'surat' && (
          <GeneratorSuratView
            profile={profile}
            onPreviewSurat={handlePreviewSurat}
            onSimpanArsip={handleSimpanArsip}
          />
        )}

        {activeView === 'mutasi' && (
          <MutasiSiswaView
            profile={profile}
            mutasiList={mutasiList}
            onAddMutasi={handleAddMutasi}
            onCetakSuratPindah={handleCetakSuratPindah}
          />
        )}

        {activeView === 'arsip' && (
          <ArsipDigitalView
            profile={profile}
            arsipList={arsipList}
            onAddArsip={handleAddArsip}
          />
        )}

        {activeView === 'pengaturan' && (
          <PengaturanKopView
            profile={profile}
            onUpdateProfile={setProfile}
          />
        )}
      </main>

      {/* Official Print & Full Preview Modal */}
      <SuratViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        profile={profile}
        suratData={selectedSurat}
        mutasiData={selectedMutasi}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{profile.namaSekolah}</span>
            <span>·</span>
            <span>Sistem Informasi Tata Usaha & Kearsipan (SI-TU)</span>
            <span>·</span>
            <span>NPSN: {profile.npsn}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Standar Naskah Dinas Kemendikbudristek RI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
