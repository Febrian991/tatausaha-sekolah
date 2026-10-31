import React, { useState, useRef } from 'react';
import { SchoolProfile, SuratKedinasan, JenisSurat, CustomTemplateSurat } from '../../types/situ';
import { KopSuratResmi } from '../KopSuratResmi';
import { 
  FileText, 
  Send, 
  Printer, 
  Sparkles, 
  Calendar, 
  Upload, 
  Plus, 
  FileCheck, 
  Trash2, 
  X,
  Code,
  Tag
} from 'lucide-react';
import { formatTanggalIndonesia, INITIAL_CUSTOM_TEMPLATES } from '../../utils/mockSituData';

interface GeneratorSuratViewProps {
  profile: SchoolProfile;
  onPreviewSurat: (surat: SuratKedinasan) => void;
  onSimpanArsip: (surat: SuratKedinasan) => void;
}

export const GeneratorSuratView: React.FC<GeneratorSuratViewProps> = ({
  profile,
  onPreviewSurat,
  onSimpanArsip
}) => {
  const [selectedJenis, setSelectedJenis] = useState<JenisSurat>('UNDANGAN_GTK');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplateSurat[]>(() => {
    const saved = localStorage.getItem('situ_custom_templates');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_TEMPLATES;
  });
  const [selectedCustomTemplateId, setSelectedCustomTemplateId] = useState<string>('');

  // General fields
  const [nomorSurat, setNomorSurat] = useState('005/098/SMAN1-TU/X/2026');
  const [lampiran, setLampiran] = useState('- (Satu Lembar)');
  const [perihal, setPerihal] = useState('Undangan Rapat Koordinasi Penilaian Akhir Semester (PAS)');
  const [titiKota, setTitiKota] = useState(profile.titiMangsaKota);
  const [titiTanggal, setTitiTanggal] = useState(new Date().toISOString().split('T')[0]);

  // Standard fields
  const [tujuanNama, setTujuanNama] = useState('Seluruh Pendidik dan Tenaga Kependidikan (GTK)');
  const [tujuanJabatan, setTujuanJabatan] = useState('SMA Negeri 1 Teladan Bangsa');
  const [hariTanggalAcara, setHariTanggalAcara] = useState('Senin, 02 November 2026');
  const [waktuAcara, setWaktuAcara] = useState('08.30 WIB s.d. Selesai');
  const [tempatAcara, setTempatAcara] = useState('Ruang Rapat Utama Lt. 2 / Graha Kencana');
  const [agenda, setAgenda] = useState('Koordinasi Persiapan Penilaian Akhir Semester (PAS) Ganjil & Pelaporan Kinerja');

  // SPPD fields
  const [namaPetugas, setNamaPetugas] = useState('Hendra Lesmana, M.Pd.');
  const [nipPetugas, setNipPetugas] = useState('19790615 200501 1 008');
  const [pangkatPetugas, setPangkatPetugas] = useState('Penata Tk. I / III-d');
  const [jabatanPetugas, setJabatanPetugas] = useState('Guru Fisika / Pembina OSN');
  const [maksudPerjalanan, setMaksudPerjalanan] = useState('Mengikuti Pelatihan Teknis Pembina Olimpiade Sains Tingkat Provinsi Jawa Barat');
  const [tempatBerangkat, setTempatBerangkat] = useState(profile.kota);
  const [tempatTujuan, setTempatTujuan] = useState('Balai Besar Guru Penggerak (BBGP), Bandung Barat');
  const [lamaPerjalanan, setLamaPerjalanan] = useState('3 (Tiga) Hari');
  const [tglBerangkat, setTglBerangkat] = useState('2026-11-03');
  const [tglKembali, setTglKembali] = useState('2026-11-05');
  const [alatAngkut, setAlatAngkut] = useState('Kendaraan Dinas / Angkutan Umum');

  // Custom Template Form State
  const [customPembuka, setCustomPembuka] = useState('');
  const [customIsi, setCustomIsi] = useState('');
  const [customPenutup, setCustomPenutup] = useState('');
  const [customTembusanText, setCustomTembusanText] = useState('Ketua Komite Sekolah\nArsip Kearsipan TU');

  // Modal Upload Template Baru
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [tplNama, setTplNama] = useState('');
  const [tplKode, setTplKode] = useState('421.2');
  const [tplPerihal, setTplPerihal] = useState('');
  const [tplPembuka, setTplPembuka] = useState('Dengan hormat, sehubungan dengan pelaksanaan program kerja di {{nama_sekolah}}, bersama ini kami sampaikan hal-hal sebagai berikut:');
  const [tplFormatIsi, setTplFormatIsi] = useState('');
  const [tplPenutup, setTplPenutup] = useState('Demikian surat ini kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.');
  const [tplTembusan, setTplTembusan] = useState('Ketua Komite Sekolah\nArsip Urusan TU');
  const [tplFileName, setTplFileName] = useState('');

  const templateFileInputRef = useRef<HTMLInputElement>(null);

  // Change default presets
  const handleJenisChange = (jenis: JenisSurat) => {
    setSelectedJenis(jenis);
    setSelectedCustomTemplateId('');
    if (jenis === 'UNDANGAN_GTK') {
      setNomorSurat('005/102/SMAN1-TU/X/2026');
      setPerihal('Undangan Rapat Evaluasi Pembelajaran & Kurikulum');
      setTujuanNama('Bapak/Ibu Dewan Guru & Tenaga Kependidikan');
      setAgenda('Evaluasi Pelaksanaan Kurikulum Merdeka & Pendataan Portofolio Siswa');
    } else if (jenis === 'SPPD') {
      setNomorSurat('090/104/SMAN1-TU/X/2026');
      setPerihal('Surat Perintah Perjalanan Dinas (SPPD)');
    } else if (jenis === 'PANGGILAN_ORTU') {
      setNomorSurat('421.3/106/SMAN1-TU/X/2026');
      setPerihal('Undangan / Panggilan Orang Tua Siswa');
      setTujuanNama('Orang Tua / Wali dari Siswa: Muhammad Rizky (Kelas XI-2)');
      setAgenda('Konsultasi Bimbingan Belajar dan Pembinaan Disiplin Kehadiran Siswa');
    } else if (jenis === 'KET_AKTIF') {
      setNomorSurat('421.1/108/SMAN1-TU/X/2026');
      setPerihal('Surat Keterangan Siswa Aktif Bersekolah');
      setTujuanNama('Pihak Pengelola Program Indonesia Pintar (PIP) / Beasiswa Prestasi');
    }
  };

  // Pilih Custom Template
  const handleSelectCustomTemplate = (template: CustomTemplateSurat) => {
    setSelectedJenis('TEMPLATE_CUSTOM');
    setSelectedCustomTemplateId(template.id);
    setNomorSurat(`${template.kodeKlasifikasi}/${Math.floor(110 + Math.random() * 80)}/SMAN1-TU/X/2026`);
    setPerihal(template.perihalDefault);
    setCustomPembuka(template.pembuka.replace('{{nama_sekolah}}', profile.namaSekolah));
    setCustomIsi(template.formatIsi.replace('{{nama_sekolah}}', profile.namaSekolah));
    setCustomPenutup(template.penutup);
    setCustomTembusanText(template.tembusanDefault.join('\n'));
    setTujuanNama('Bapak/Ibu / Pihak Terkait');
  };

  // Handle Upload Berkas Dokumen Template (.txt, .docx, .doc)
  const handleTemplateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTplFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        // Ambil potongan teks untuk isi template
        setTplFormatIsi(text.slice(0, 1500));
        if (!tplNama) {
          setTplNama(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
        }
        if (!tplPerihal) {
          setTplPerihal(`Surat ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSimpanCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplNama || !tplFormatIsi) return;

    const newTpl: CustomTemplateSurat = {
      id: `TPL-${Date.now()}`,
      namaTemplate: tplNama,
      kodeKlasifikasi: tplKode || '421.2',
      perihalDefault: tplPerihal || tplNama,
      pembuka: tplPembuka,
      formatIsi: tplFormatIsi,
      penutup: tplPenutup,
      tembusanDefault: tplTembusan.split('\n').filter(Boolean),
      fileReferensiNama: tplFileName || 'Template_Upload.txt',
      diuploadPada: new Date().toISOString().split('T')[0]
    };

    const updated = [newTpl, ...customTemplates];
    setCustomTemplates(updated);
    localStorage.setItem('situ_custom_templates', JSON.stringify(updated));
    setIsUploadModalOpen(false);

    // Langsung aktifkan template baru ini
    handleSelectCustomTemplate(newTpl);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('situ_custom_templates', JSON.stringify(updated));
    if (selectedCustomTemplateId === id) {
      handleJenisChange('UNDANGAN_GTK');
    }
  };

  // Quick insert placeholder into customIsi
  const insertTag = (tag: string) => {
    setCustomIsi((prev) => prev + ` {{${tag}}}`);
  };

  const currentSuratObject: SuratKedinasan = {
    id: `SRT-${Date.now()}`,
    jenis: selectedJenis,
    templateId: selectedCustomTemplateId,
    nomorSurat,
    lampiran,
    perihal,
    titiMangsa: {
      kota: titiKota,
      tanggal: titiTanggal
    },
    konten: {
      tujuanNama,
      tujuanJabatan,
      hariTanggalAcara,
      waktuAcara,
      tempatAcara,
      agenda,
      pegawaiBertugas: [
        {
          nama: namaPetugas,
          nip: nipPetugas,
          pangkat: pangkatPetugas,
          jabatan: jabatanPetugas
        }
      ],
      maksudPerjalanan,
      tempatBerangkat,
      tempatTujuan,
      lamaPerjalanan,
      tanggalBerangkat: tglBerangkat,
      tanggalKembali: tglKembali,
      alatAngkut,
      pembebananAnggaran: 'DPA Biaya Operasional Sekolah (BOS) Tahun Anggaran 2026',
      // Jika template custom
      customPembuka,
      customIsi,
      customPenutup,
      customTembusan: customTembusanText.split('\n').filter(Boolean)
    },
    dibuatOleh: 'Staf Administrasi TU',
    createdAt: new Date().toISOString()
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Generator Persuratan & Upload Template Dinas</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pilih template baku atau upload template naskah dinas baru agar bentuk dan struktur surat menyesuaikan secara fleksibel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Upload Template Baru</span>
          </button>
          <button
            onClick={() => onPreviewSurat(currentSuratObject)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau & Cetak Resmi</span>
          </button>
          <button
            onClick={() => onSimpanArsip(currentSuratObject)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Simpan ke Arsip</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Controls & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          {/* 1. Pemilihan Template Surat (Standar & Custom Uploaded) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Format / Template Naskah Dinas
              </label>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Format Surat Baru</span>
              </button>
            </div>

            {/* Template Bawaan Sistem */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleJenisChange('UNDANGAN_GTK')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                  selectedJenis === 'UNDANGAN_GTK'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Undangan GTK
              </button>
              <button
                type="button"
                onClick={() => handleJenisChange('SPPD')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                  selectedJenis === 'SPPD'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                SPPD & Tugas
              </button>
              <button
                type="button"
                onClick={() => handleJenisChange('PANGGILAN_ORTU')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                  selectedJenis === 'PANGGILAN_ORTU'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Panggilan Ortu
              </button>
              <button
                type="button"
                onClick={() => handleJenisChange('KET_AKTIF')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                  selectedJenis === 'KET_AKTIF'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Ket. Siswa Aktif
              </button>
            </div>

            {/* Template Kustom Hasil Upload Pengguna */}
            {customTemplates.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Template Kustom Hasil Upload ({customTemplates.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customTemplates.map((tpl) => {
                    const isSelected = selectedJenis === 'TEMPLATE_CUSTOM' && selectedCustomTemplateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectCustomTemplate(tpl)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div className="text-xs truncate">{tpl.namaTemplate}</div>
                          <div className="text-[10px] text-slate-500 font-mono-data">
                            Klasifikasi: {tpl.kodeKlasifikasi}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          title="Hapus template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Pengaturan Nomor & Titi Mangsa Fleksibel */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Penomoran Surat & Titi Mangsa Fleksibel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nomor Surat Dinas</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono-data text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Lampiran</label>
                <input
                  type="text"
                  value={lampiran}
                  onChange={(e) => setLampiran(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Titi Mangsa: Kota Pembuatan</label>
                <input
                  type="text"
                  value={titiKota}
                  onChange={(e) => setTitiKota(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Titi Mangsa: Tanggal Surat</label>
                <input
                  type="date"
                  value={titiTanggal}
                  onChange={(e) => setTitiTanggal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Form Input Menyesuaikan Jenis Template */}
          {selectedJenis === 'TEMPLATE_CUSTOM' ? (
            /* Formulir Khusus Template Kustom Hasil Upload */
            <div className="space-y-3 text-xs bg-emerald-50/30 p-4 rounded-lg border border-emerald-200/80">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                <span className="font-bold text-emerald-900 uppercase">
                  Bentuk Surat Menyesuaikan Template Upload
                </span>
                <span className="text-[10px] text-emerald-700 font-mono-data">
                  Format Bebas / Fleksibel
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Perihal / Judul Surat</label>
                <input
                  type="text"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kepada Yth. (Tujuan Surat)</label>
                <input
                  type="text"
                  value={tujuanNama}
                  onChange={(e) => setTujuanNama(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Paragraf Pembuka Surat</label>
                <textarea
                  rows={2}
                  value={customPembuka}
                  onChange={(e) => setCustomPembuka(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-surat"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Isi & Rincian Format Surat (Sesuai Template)</label>
                  <div className="flex items-center gap-1 text-[10px] text-blue-600">
                    <span>Sisipkan tag:</span>
                    <button
                      type="button"
                      onClick={() => insertTag('nama_siswa')}
                      className="px-1.5 py-0.5 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      + Siswa
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('hari_tanggal')}
                      className="px-1.5 py-0.5 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      + Tanggal
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('tempat')}
                      className="px-1.5 py-0.5 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      + Tempat
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={customIsi}
                  onChange={(e) => setCustomIsi(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-surat leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Paragraf Penutup Surat</label>
                <textarea
                  rows={2}
                  value={customPenutup}
                  onChange={(e) => setCustomPenutup(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-surat"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Daftar Tembusan (Satu baris per tembusan)
                </label>
                <textarea
                  rows={2}
                  value={customTembusanText}
                  onChange={(e) => setCustomTembusanText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-[11px]"
                />
              </div>
            </div>
          ) : selectedJenis === 'SPPD' ? (
            /* Formulir Khusus SPPD */
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wide">
                Rincian Perjalanan Dinas (SPPD)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Pegawai yang Ditugaskan</label>
                  <input
                    type="text"
                    value={namaPetugas}
                    onChange={(e) => setNamaPetugas(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    value={nipPetugas}
                    onChange={(e) => setNipPetugas(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono-data text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={pangkatPetugas}
                    onChange={(e) => setPangkatPetugas(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={jabatanPetugas}
                    onChange={(e) => setJabatanPetugas(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Maksud Perjalanan Dinas</label>
                <textarea
                  rows={2}
                  value={maksudPerjalanan}
                  onChange={(e) => setMaksudPerjalanan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tempat Tujuan</label>
                  <input
                    type="text"
                    value={tempatTujuan}
                    onChange={(e) => setTempatTujuan(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lama Perjalanan</label>
                  <input
                    type="text"
                    value={lamaPerjalanan}
                    onChange={(e) => setLamaPerjalanan(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Alat Angkutan</label>
                  <input
                    type="text"
                    value={alatAngkut}
                    onChange={(e) => setAlatAngkut(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Formulir Standar (Undangan / Panggilan Ortu / Ket Aktif) */
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Perihal / Hal Surat</label>
                <input
                  type="text"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Kepada Yth. (Tujuan Surat)</label>
                <input
                  type="text"
                  value={tujuanNama}
                  onChange={(e) => setTujuanNama(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Hari, Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    value={hariTanggalAcara}
                    onChange={(e) => setHariTanggalAcara(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    value={waktuAcara}
                    onChange={(e) => setWaktuAcara(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Tempat Kegiatan / Ruangan</label>
                <input
                  type="text"
                  value={tempatAcara}
                  onChange={(e) => setTempatAcara(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Agenda / Uraian Kegiatan</label>
                <textarea
                  rows={2}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mini Live Preview Sheet (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Live Dokumen Menyesuaikan Template</span>
              </span>
              <span className="text-[10px] font-mono-data text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                STANDAR A4/F4
              </span>
            </div>

            {/* Paper Replica Mini */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-surat text-[11px] leading-relaxed shadow-inner">
              <KopSuratResmi profile={profile} className="scale-85 origin-top -mb-2" />

              <div className="mt-2 text-right text-[10px]">
                {titiKota}, {formatTanggalIndonesia(titiTanggal)}
              </div>

              <div className="mt-2 space-y-0.5 text-[10px]">
                <div>Nomor : {nomorSurat}</div>
                <div>Hal : <span className="font-bold">{perihal}</span></div>
                <div className="pt-1">Kepada Yth. <span className="font-semibold">{tujuanNama}</span></div>
              </div>

              {selectedJenis === 'TEMPLATE_CUSTOM' ? (
                <div className="mt-2 space-y-1 text-[10px]">
                  <p className="text-justify indent-4 leading-tight">{customPembuka}</p>
                  <div className="p-2 bg-white border border-slate-200 rounded whitespace-pre-wrap leading-tight text-[9.5px]">
                    {customIsi}
                  </div>
                  <p className="text-justify indent-4 leading-tight">{customPenutup}</p>
                </div>
              ) : (
                <p className="mt-2 text-[10px] text-justify leading-tight">
                  Dengan hormat, sehubungan dengan agenda {perihal}, bersama ini kami mengundang kehadiran Bapak/Ibu pada {hariTanggalAcara} bertempat di {tempatAcara}.
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <div className="text-center text-[9px] w-36">
                  <div>{profile.kepalaSekolah.gelar},</div>
                  <div className="h-7 flex items-center justify-center text-purple-900 font-bold opacity-70">
                    [STEMPEL & TTD]
                  </div>
                  <div className="font-bold underline">{profile.kepalaSekolah.nama}</div>
                  <div>NIP. {profile.kepalaSekolah.nip}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => onPreviewSurat(currentSuratObject)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Buka Pratinjau Penuh & Cetak A4/F4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Upload / Impor Template Surat Baru */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>Upload & Sesuaikan Format Template Surat Baru</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanCustomTemplate} className="p-5 space-y-4 text-xs">
              {/* Upload Berkas Dokumen */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
                <span className="font-bold text-blue-900 block mb-1">
                  1. Upload File Referensi Template (.txt, .docx, .doc teks)
                </span>
                <p className="text-[11px] text-slate-600 mb-2">
                  Pilih file dokumen template dari komputer Anda. Sistem akan membaca teks dan menyesuaikan struktur surat.
                </p>

                <input
                  ref={templateFileInputRef}
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleTemplateFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => templateFileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Dokumen Template</span>
                  </button>
                  {tplFileName && (
                    <span className="text-[11px] text-slate-700 font-mono-data font-medium">
                      Berkas: {tplFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Detail Identitas Template */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Template Surat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Surat Izin Observasi Penelitian"
                    value={tplNama}
                    onChange={(e) => setTplNama(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kode Klasifikasi Surat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 421.2 / 005 / 800"
                    value={tplKode}
                    onChange={(e) => setTplKode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono-data"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Perihal Bawaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Permohonan Izin Tempat dan Penelitian Mahasiswa"
                  value={tplPerihal}
                  onChange={(e) => setTplPerihal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teks Pembuka Surat</label>
                <textarea
                  rows={2}
                  value={tplPembuka}
                  onChange={(e) => setTplPembuka(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-surat"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">
                    Format Rincian / Isi Surat (Dapat menggunakan tag variabel)
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono-data">
                    Tag: {`{{nama_sekolah}}, {{nama_siswa}}, {{hari_tanggal}}`}
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder={`Contoh rincian:
Nama Lengkap    : {{nama_siswa}}
NISN / NIS      : {{nisn}}
Kelas / Rombel  : {{kelas}}
Keperluan       : {{keperluan}}`}
                  value={tplFormatIsi}
                  onChange={(e) => setTplFormatIsi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-surat leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teks Penutup Surat</label>
                <textarea
                  rows={2}
                  value={tplPenutup}
                  onChange={(e) => setTplPenutup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-surat"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Daftar Tembusan (Satu baris per tujuan)
                </label>
                <textarea
                  rows={2}
                  value={tplTembusan}
                  onChange={(e) => setTplTembusan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Simpan & Terapkan Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
