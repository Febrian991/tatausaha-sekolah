import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  HelpCircle,
  Settings2
} from 'lucide-react';
import { 
  SPPDData, 
  UndanganRapatGTKData, 
  PanggilanOrtuData, 
  SchoolProfile,
  TitiMangsaPosition
} from '../../types';

interface TemplateSuratViewProps {
  sppdData: SPPDData;
  undanganData: UndanganRapatGTKData;
  panggilanData: PanggilanOrtuData;
  profile: SchoolProfile;
  onSaveSPPD: (data: SPPDData) => void;
  onSaveUndangan: (data: UndanganRapatGTKData) => void;
  onSavePanggilan: (data: PanggilanOrtuData) => void;
  onPrintDocument: (type: 'sppd' | 'undangan' | 'panggilan') => void;
}

export const TemplateSuratView: React.FC<TemplateSuratViewProps> = ({
  sppdData,
  undanganData,
  panggilanData,
  profile,
  onSaveSPPD,
  onSaveUndangan,
  onSavePanggilan,
  onPrintDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'sppd' | 'undangan' | 'panggilan'>('sppd');
  
  // Local state for SPPD
  const [sppdForm, setSppdForm] = useState<SPPDData>(sppdData);
  // Local state for Undangan
  const [undanganForm, setUndanganForm] = useState<UndanganRapatGTKData>(undanganData);
  // Local state for Panggilan
  const [panggilanForm, setPanggilanForm] = useState<PanggilanOrtuData>(panggilanData);
  
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const showSaveSuccess = (msg: string) => {
    setSaveAlert(msg);
    setTimeout(() => setSaveAlert(null), 3000);
  };

  // SPPD Biaya Item Handlers
  const handleAddBiayaItem = () => {
    const newItem = {
      id: `b-${Date.now()}`,
      uraian: 'Biaya Pengeluaran Tambahan',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: 150000,
      total: 150000,
    };
    setSppdForm(prev => ({
      ...prev,
      rincianBiaya: [...prev.rincianBiaya, newItem]
    }));
  };

  const handleUpdateBiaya = (id: string, field: string, value: any) => {
    setSppdForm(prev => ({
      ...prev,
      rincianBiaya: prev.rincianBiaya.map(b => {
        if (b.id !== id) return b;
        const updated = { ...b, [field]: value };
        if (field === 'volume' || field === 'hargaSatuan') {
          updated.total = Number(updated.volume) * Number(updated.hargaSatuan);
        }
        return updated;
      })
    }));
  };

  const handleDeleteBiaya = (id: string) => {
    setSppdForm(prev => ({
      ...prev,
      rincianBiaya: prev.rincianBiaya.filter(b => b.id !== id)
    }));
  };

  // Undangan Agenda Handlers
  const handleAddAgenda = () => {
    setUndanganForm(prev => ({
      ...prev,
      agenda: [...prev.agenda, 'Agenda Pembahasan Baru']
    }));
  };

  const handleUpdateAgenda = (idx: number, val: string) => {
    setUndanganForm(prev => ({
      ...prev,
      agenda: prev.agenda.map((ag, i) => i === idx ? val : ag)
    }));
  };

  const handleDeleteAgenda = (idx: number) => {
    setUndanganForm(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== idx)
    }));
  };

  const totalBiayaSPPD = sppdForm.rincianBiaya.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Template Surat Resmi Baru (Standar Administrasi Kedinasan)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kop surat logo ganda terpisah dari titi mangsa, format baku A4, dan cetak langsung.
          </p>
        </div>

        {saveAlert && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveAlert}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-lg max-w-xl">
        <button
          onClick={() => setActiveTab('sppd')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'sppd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📄 1. SPPD &amp; Rincian Biaya
        </button>
        <button
          onClick={() => setActiveTab('undangan')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'undangan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ✉️ 2. Undangan Rapat GTK
        </button>
        <button
          onClick={() => setActiveTab('panggilan')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'panggilan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 3. Panggilan Orang Tua
        </button>
      </div>

      {/* TAB 1: SPPD */}
      {activeTab === 'sppd' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Surat Perintah Perjalanan Dinas (SPPD) &amp; Surat Tugas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mencakup 2 lembar: Lembar 1 Surat Tugas Kedinasan, Lembar 2 Rincian Biaya Riil Permendagri.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSaveSPPD(sppdForm);
                  showSaveSuccess('Perubahan SPPD tersimpan!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf</span>
              </button>
              <button
                onClick={() => onPrintDocument('sppd')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau &amp; Cetak SPPD (A4)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat Tugas</label>
              <input
                type="text"
                value={sppdForm.noSuratTugas}
                onChange={e => setSppdForm({ ...sppdForm, noSuratTugas: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor SPPD</label>
              <input
                type="text"
                value={sppdForm.noSPPD}
                onChange={e => setSppdForm({ ...sppdForm, noSPPD: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dasar Surat / Instruksi Tugas</label>
            <textarea
              rows={2}
              value={sppdForm.dasarTugas}
              onChange={e => setSppdForm({ ...sppdForm, dasarTugas: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pegawai Ditugaskan</label>
              <input
                type="text"
                value={sppdForm.namaPegawai}
                onChange={e => setSppdForm({ ...sppdForm, namaPegawai: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Pegawai</label>
              <input
                type="text"
                value={sppdForm.nip}
                onChange={e => setSppdForm({ ...sppdForm, nip: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
              <input
                type="text"
                value={sppdForm.pangkatGol}
                onChange={e => setSppdForm({ ...sppdForm, pangkatGol: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan</label>
              <input
                type="text"
                value={sppdForm.jabatan}
                onChange={e => setSppdForm({ ...sppdForm, jabatan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maksud Perjalanan Dinas</label>
              <input
                type="text"
                value={sppdForm.maksudPerjalanan}
                onChange={e => setSppdForm({ ...sppdForm, maksudPerjalanan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Berangkat</label>
              <input
                type="text"
                value={sppdForm.tempatBerangkat}
                onChange={e => setSppdForm({ ...sppdForm, tempatBerangkat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Tujuan</label>
              <input
                type="text"
                value={sppdForm.tempatTujuan}
                onChange={e => setSppdForm({ ...sppdForm, tempatTujuan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lama Perjalanan (Hari)</label>
              <input
                type="number"
                value={sppdForm.lamaHari}
                onChange={e => setSppdForm({ ...sppdForm, lamaHari: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Berangkat</label>
              <input
                type="date"
                value={sppdForm.tglBerangkat}
                onChange={e => setSppdForm({ ...sppdForm, tglBerangkat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kembali</label>
              <input
                type="date"
                value={sppdForm.tglKembali}
                onChange={e => setSppdForm({ ...sppdForm, tglKembali: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Rincian Biaya Riil Table */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tabel Rincian Biaya Perjalanan Dinas Riil (Lembar 2)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Uang harian, biaya transport, akomodasi penginapan, dan uang representasi.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBiayaItem}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris Biaya</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="py-2 text-left">Uraian Pengeluaran</th>
                    <th className="py-2 w-20 text-center">Vol</th>
                    <th className="py-2 w-24 text-center">Satuan</th>
                    <th className="py-2 w-32 text-right">Harga Satuan (Rp)</th>
                    <th className="py-2 w-32 text-right">Total (Rp)</th>
                    <th className="py-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sppdForm.rincianBiaya.map(item => (
                    <tr key={item.id}>
                      <td className="py-2 pr-2">
                        <input
                          type="text"
                          value={item.uraian}
                          onChange={e => handleUpdateBiaya(item.id, 'uraian', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <input
                          type="number"
                          value={item.volume}
                          onChange={e => handleUpdateBiaya(item.id, 'volume', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center bg-white"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          value={item.satuan}
                          onChange={e => handleUpdateBiaya(item.id, 'satuan', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center bg-white"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <input
                          type="number"
                          value={item.hargaSatuan}
                          onChange={e => handleUpdateBiaya(item.id, 'hargaSatuan', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-right bg-white font-mono"
                        />
                      </td>
                      <td className="py-2 pl-2 text-right font-mono font-bold text-slate-800">
                        {item.total.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteBiaya(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={4} className="py-2 text-right uppercase">
                      Total Anggaran SPPD:
                    </td>
                    <td className="py-2 text-right font-mono text-emerald-700">
                      Rp {totalBiayaSPPD.toLocaleString('id-ID')}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNDANGAN RAPAT DINAS GTK */}
      {activeTab === 'undangan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Surat Undangan Rapat Dinas GTK (Guru &amp; Tenaga Kependidikan)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Format resmi kedinasan lengkap dengan susunan agenda, tempat rapat, dan aturan pakaian.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSaveUndangan(undanganForm);
                  showSaveSuccess('Draf Undangan Rapat tersimpan!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf</span>
              </button>
              <button
                onClick={() => onPrintDocument('undangan')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau &amp; Cetak Undangan (A4)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat Undangan</label>
              <input
                type="text"
                value={undanganForm.noSurat}
                onChange={e => setUndanganForm({ ...undanganForm, noSurat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sifat Surat</label>
              <select
                value={undanganForm.sifat}
                onChange={e => setUndanganForm({ ...undanganForm, sifat: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="Penting">Penting</option>
                <option value="Biasa">Biasa</option>
                <option value="Segera">Segera</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lampiran</label>
              <input
                type="text"
                value={undanganForm.lampiran}
                onChange={e => setUndanganForm({ ...undanganForm, lampiran: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Perihal Undangan</label>
            <input
              type="text"
              value={undanganForm.perihal}
              onChange={e => setUndanganForm({ ...undanganForm, perihal: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hari &amp; Tanggal Pelaksanaan</label>
              <input
                type="text"
                value={undanganForm.tanggalRapat}
                onChange={e => setUndanganForm({ ...undanganForm, tanggalRapat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu / Pukul</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={undanganForm.waktuMulai}
                  onChange={e => setUndanganForm({ ...undanganForm, waktuMulai: e.target.value })}
                  placeholder="08.00 WIB"
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-slate-400">s.d.</span>
                <input
                  type="text"
                  value={undanganForm.waktuSelesai}
                  onChange={e => setUndanganForm({ ...undanganForm, waktuSelesai: e.target.value })}
                  placeholder="Selesai"
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat / Ruang Pertemuan</label>
              <input
                type="text"
                value={undanganForm.tempatRapat}
                onChange={e => setUndanganForm({ ...undanganForm, tempatRapat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pakaian / Seragam Dinas</label>
              <input
                type="text"
                value={undanganForm.dressCode}
                onChange={e => setUndanganForm({ ...undanganForm, dressCode: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peserta Undangan Dituju</label>
              <input
                type="text"
                value={undanganForm.peserta}
                onChange={e => setUndanganForm({ ...undanganForm, peserta: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Agenda List */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Susunan Agenda Rapat
              </h4>
              <button
                type="button"
                onClick={handleAddAgenda}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda</span>
              </button>
            </div>

            <div className="space-y-2">
              {undanganForm.agenda.map((ag, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 w-5 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ag}
                    onChange={e => handleUpdateAgenda(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAgenda(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PANGGILAN ORANG TUA / WALI */}
      {activeTab === 'panggilan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Surat Panggilan Orang Tua / Wali Murid
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Format surat pemanggilan resmi menghadap Guru BK / Wali Kelas / Kepala Sekolah.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSavePanggilan(panggilanForm);
                  showSaveSuccess('Draf Surat Panggilan tersimpan!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf</span>
              </button>
              <button
                onClick={() => onPrintDocument('panggilan')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau &amp; Cetak Surat (A4)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat Panggilan</label>
              <input
                type="text"
                value={panggilanForm.noSurat}
                onChange={e => setPanggilanForm({ ...panggilanForm, noSurat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={panggilanForm.namaOrtu}
                onChange={e => setPanggilanForm({ ...panggilanForm, namaOrtu: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Orang Tua / Wali</label>
              <input
                type="text"
                value={panggilanForm.alamatOrtu}
                onChange={e => setPanggilanForm({ ...panggilanForm, alamatOrtu: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Peserta Didik</label>
              <input
                type="text"
                value={panggilanForm.namaSiswa}
                onChange={e => setPanggilanForm({ ...panggilanForm, namaSiswa: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NISN Siswa</label>
              <input
                type="text"
                value={panggilanForm.nisn}
                onChange={e => setPanggilanForm({ ...panggilanForm, nisn: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
              <input
                type="text"
                value={panggilanForm.kelas}
                onChange={e => setPanggilanForm({ ...panggilanForm, kelas: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hari &amp; Tanggal Menghadap</label>
              <input
                type="text"
                value={panggilanForm.hariTanggal}
                onChange={e => setPanggilanForm({ ...panggilanForm, hariTanggal: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu / Jam Pertemuan</label>
              <input
                type="text"
                value={panggilanForm.waktu}
                onChange={e => setPanggilanForm({ ...panggilanForm, waktu: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Menghadap</label>
              <input
                type="text"
                value={panggilanForm.tempat}
                onChange={e => setPanggilanForm({ ...panggilanForm, tempat: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Menghadap Kepada</label>
              <input
                type="text"
                value={panggilanForm.menghadapKepada}
                onChange={e => setPanggilanForm({ ...panggilanForm, menghadapKepada: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan Wali Kelas</label>
              <input
                type="text"
                value={panggilanForm.catatanWaliKelas}
                onChange={e => setPanggilanForm({ ...panggilanForm, catatanWaliKelas: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Keperluan / Pokok Pembahasan Pemanggilan</label>
            <textarea
              rows={3}
              value={panggilanForm.keperluan}
              onChange={e => setPanggilanForm({ ...panggilanForm, keperluan: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
