import React, { useState } from 'react';
import {
  Mail,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Mail as MailType } from '../types/index.ts';

export const MailArchiveView: React.FC = () => {
  const { mails, addMail, updateMail, deleteMail, openPrintModal, schoolProfile, globalSearchQuery } = useApp();

  const [activeTab, setActiveTab] = useState<'Masuk' | 'Keluar'>('Masuk');
  const [search, setSearch] = useState('');
  const [filterDisposisi, setFilterDisposisi] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisposisiModalOpen, setIsDisposisiModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<MailType | null>(null);

  // New Mail Form State
  const [formData, setFormData] = useState({
    jenis: 'Masuk' as 'Masuk' | 'Keluar',
    noSurat: '',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    tanggalDiterima: new Date().toISOString().slice(0, 10),
    pengirim: '',
    penerima: schoolProfile.namaSekolah,
    perihal: '',
    kodeKlasifikasi: '421.1 (Kurikulum & Pembelajaran)',
    ringkasan: '',
    statusDisposisi: 'Belum' as 'Belum' | 'Sudah Didisposisi' | 'Selesai',
    disposisiKepada: '',
    instruksiDisposisi: '',
    catatanKepalaSekolah: '',
    batasWaktu: '',
    fileLampiranNama: '',
  });

  // Disposisi Quick Form
  const [disposisiData, setDisposisiData] = useState({
    disposisiKepada: 'Wakasek Kurikulum & KTU',
    instruksiDisposisi: 'Tindak lanjuti segera dan koordinasikan dengan pihak terkait.',
    catatanKepalaSekolah: '',
    batasWaktu: '',
    statusDisposisi: 'Sudah Didisposisi' as 'Belum' | 'Sudah Didisposisi' | 'Selesai',
  });

  const activeSearch = globalSearchQuery || search;

  const filteredMails = mails.filter((m) => {
    const matchesTab = m.jenis === activeTab;
    const matchesSearch =
      m.noSurat.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.noAgenda.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.perihal.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.pengirim.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesDisposisi =
      filterDisposisi === 'ALL' || m.statusDisposisi === filterDisposisi;
    return matchesTab && matchesSearch && matchesDisposisi;
  });

  const countMasuk = mails.filter((m) => m.jenis === 'Masuk').length;
  const countKeluar = mails.filter((m) => m.jenis === 'Keluar').length;
  const countPending = mails.filter((m) => m.jenis === 'Masuk' && m.statusDisposisi === 'Belum').length;

  const handleOpenAdd = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      jenis: activeTab,
      noSurat: activeTab === 'Masuk' ? '421.1/   /Cadwil.VII/2026' : `421.3/${Math.floor(100 + Math.random() * 899)}/${schoolProfile.namaSekolah.replace(/\s+/g, '')}/X/2026`,
      tanggalSurat: today,
      tanggalDiterima: today,
      pengirim: activeTab === 'Masuk' ? 'Dinas Pendidikan Jawa Barat' : `Kepala ${schoolProfile.namaSekolah}`,
      penerima: activeTab === 'Masuk' ? `Kepala ${schoolProfile.namaSekolah}` : 'Orang Tua / Wali Siswa',
      perihal: '',
      kodeKlasifikasi: '421.1 (Kurikulum & Pembelajaran)',
      ringkasan: '',
      statusDisposisi: activeTab === 'Masuk' ? 'Belum' : 'Selesai',
      disposisiKepada: '',
      instruksiDisposisi: '',
      catatanKepalaSekolah: '',
      batasWaktu: '',
      fileLampiranNama: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenDisposisi = (mail: MailType) => {
    setSelectedMail(mail);
    setDisposisiData({
      disposisiKepada: mail.disposisiKepada || 'Wakasek Kurikulum & Kepala Tata Usaha',
      instruksiDisposisi: mail.instruksiDisposisi || 'Pelajari dan tindak lanjuti sesuai ketentuan kedinasan.',
      catatanKepalaSekolah: mail.catatanKepalaSekolah || '',
      batasWaktu: mail.batasWaktu || '',
      statusDisposisi: 'Sudah Didisposisi',
    });
    setIsDisposisiModalOpen(true);
  };

  const handleSaveDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMail) return;
    updateMail(selectedMail.id, {
      ...disposisiData,
      statusDisposisi: 'Sudah Didisposisi',
    });
    setIsDisposisiModalOpen(false);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.noSurat || !formData.perihal) return;
    addMail(formData);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Navigation Tabs & KPI Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Masuk')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Masuk'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Agenda Surat Masuk ({countMasuk})</span>
            {countPending > 0 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {countPending} Perlu Disposisi
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('Keluar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Keluar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Agenda Surat Keluar ({countKeluar})</span>
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrasi Surat {activeTab}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor agenda, nomor surat, pengirim, perihal..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {activeTab === 'Masuk' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status Disposisi:</span>
            <select
              value={filterDisposisi}
              onChange={(e) => setFilterDisposisi(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="ALL">Semua</option>
              <option value="Belum">Belum Didisposisi</option>
              <option value="Sudah Didisposisi">Sudah Didisposisi</option>
              <option value="Selesai">Selesai / Diarsipkan</option>
            </select>
          </div>
        )}
      </div>

      {/* Mail Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-4 font-semibold">No. Agenda & Tanggal</th>
                <th className="py-2.5 px-4 font-semibold">Nomor & Asal Surat</th>
                <th className="py-2.5 px-4 font-semibold">Perihal & Ringkasan</th>
                <th className="py-2.5 px-4 font-semibold">Klasifikasi</th>
                {activeTab === 'Masuk' && <th className="py-2.5 px-4 font-semibold">Disposisi Kepsek</th>}
                <th className="py-2.5 px-4 font-semibold text-right">Aksi Persuratan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada arsip surat {activeTab} yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredMails.map((mail) => (
                  <tr key={mail.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700 align-top">
                      <div className="font-bold text-blue-700">{mail.noAgenda}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Tgl Surat: {mail.tanggalSurat}</div>
                      {mail.tanggalDiterima && (
                        <div className="text-slate-400 text-[10px]">Terima: {mail.tanggalDiterima}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="font-mono text-slate-900 font-semibold">{mail.noSurat}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {activeTab === 'Masuk' ? `Dari: ${mail.pengirim}` : `Kepada: ${mail.penerima}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm align-top">
                      <div className="font-semibold text-slate-900 leading-snug">{mail.perihal}</div>
                      {mail.ringkasan && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {mail.ringkasan}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className="text-[11px] text-slate-600 font-medium">{mail.kodeKlasifikasi}</span>
                    </td>
                    {activeTab === 'Masuk' && (
                      <td className="py-3 px-4 align-top">
                        {mail.statusDisposisi === 'Belum' ? (
                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              Menunggu Arahan
                            </span>
                            <button
                              onClick={() => handleOpenDisposisi(mail)}
                              className="block text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                            >
                              + Isi Disposisi
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              {mail.statusDisposisi}
                            </span>
                            <div className="text-[11px] text-slate-700 font-medium">
                              {mail.disposisiKepada}
                            </div>
                            {mail.instruksiDisposisi && (
                              <p className="text-[10px] text-slate-500 italic line-clamp-1">
                                "{mail.instruksiDisposisi}"
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        {activeTab === 'Masuk' && (
                          <button
                            onClick={() =>
                              openPrintModal({
                                type: 'lembar-disposisi',
                                title: `Lembar Disposisi - ${mail.noSurat}`,
                                data: mail,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            title="Cetak Lembar Disposisi Kepala Sekolah"
                          >
                            <Printer className="w-3.5 h-3.5 inline mr-1" />
                            <span>Cetak</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus arsip surat ${mail.noSurat}?`)) {
                              deleteMail(mail.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Hapus Surat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disposisi Modal */}
      {isDisposisiModalOpen && selectedMail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Form Disposisi Kepala Sekolah</h3>
                <p className="text-xs text-slate-500">Nomor Surat: {selectedMail.noSurat}</p>
              </div>
              <button
                onClick={() => setIsDisposisiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDisposisi} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Diteruskan Kepada (Tujuan Disposisi)*</label>
                <input
                  type="text"
                  required
                  value={disposisiData.disposisiKepada}
                  onChange={(e) => setDisposisiData({ ...disposisiData, disposisiKepada: e.target.value })}
                  placeholder="Misal: Wakasek Kurikulum, KTU, Tim IT"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Instruksi / Arahan Pimpinan*</label>
                <textarea
                  rows={3}
                  required
                  value={disposisiData.instruksiDisposisi}
                  onChange={(e) => setDisposisiData({ ...disposisiData, instruksiDisposisi: e.target.value })}
                  placeholder="Arahan tindak lanjut, koordinasi, atau penugasan khusus..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Batas Waktu Penyelesaian</label>
                  <input
                    type="date"
                    value={disposisiData.batasWaktu}
                    onChange={(e) => setDisposisiData({ ...disposisiData, batasWaktu: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status Disposisi</label>
                  <select
                    value={disposisiData.statusDisposisi}
                    onChange={(e) => setDisposisiData({ ...disposisiData, statusDisposisi: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="Sudah Didisposisi">Sudah Didisposisi</option>
                    <option value="Selesai">Selesai / Arsip</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDisposisiModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Simpan & Perbarui Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Mail Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-5 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                Registrasi Surat {formData.jenis} Baru ke Buku Agenda
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nomor Surat Resmi*</label>
                  <input
                    type="text"
                    required
                    value={formData.noSurat}
                    onChange={(e) => setFormData({ ...formData, noSurat: e.target.value })}
                    placeholder="Contoh: 421.1/182/Disdik/2026"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kode Klasifikasi Tata Usaha</label>
                  <select
                    value={formData.kodeKlasifikasi}
                    onChange={(e) => setFormData({ ...formData, kodeKlasifikasi: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="421.1 (Kurikulum & Pembelajaran)">421.1 (Kurikulum & Pembelajaran)</option>
                    <option value="421.2 (Sarana & Prasarana)">421.2 (Sarana & Prasarana)</option>
                    <option value="421.3 (Kesiswaan & Beasiswa)">421.3 (Kesiswaan & Beasiswa)</option>
                    <option value="421.4 (Kepegawaian & Ketenagaan)">421.4 (Kepegawaian & Ketenagaan)</option>
                    <option value="421.6 (Keuangan & Anggaran BOS)">421.6 (Keuangan & Anggaran BOS)</option>
                    <option value="421.7 (Kerjasama Industri & Prakerin)">421.7 (Kerjasama Industri & Prakerin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {formData.jenis === 'Masuk' ? 'Instansi / Pihak Pengirim*' : 'Pengirim'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pengirim}
                    onChange={(e) => setFormData({ ...formData, pengirim: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {formData.jenis === 'Masuk' ? 'Penerima' : 'Tujuan Surat / Penerima*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.penerima}
                    onChange={(e) => setFormData({ ...formData, penerima: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    value={formData.tanggalSurat}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Diterima TU</label>
                  <input
                    type="date"
                    value={formData.tanggalDiterima}
                    onChange={(e) => setFormData({ ...formData, tanggalDiterima: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Perihal Surat*</label>
                <input
                  type="text"
                  required
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  placeholder="Ringkasan pokok isi surat..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Ringkasan / Uraian Isi Surat</label>
                <textarea
                  rows={2}
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Keterangan singkat mengenai agenda atau instruksi pada surat..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Simpan ke Buku Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
