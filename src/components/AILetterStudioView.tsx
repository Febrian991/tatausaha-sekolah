import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface TemplatePreset {
  id: string;
  name: string;
  jenis: string;
  description: string;
  defaultData: {
    tujuan: string;
    keperluan: string;
    hariTanggal: string;
    waktu: string;
    catatan: string;
  };
}

export const AILetterStudioView: React.FC = () => {
  const { schoolProfile, students, staff, openPrintModal } = useApp();

  const presets: TemplatePreset[] = [
    {
      id: 'panggilan-ortu',
      name: 'Surat Panggilan Orang Tua / Wali',
      jenis: 'Surat Panggilan Wali Murid',
      description: 'Undangan tatap muka koordinasi bimbingan belajar dan kehadiran siswa.',
      defaultData: {
        tujuan: 'Orang Tua / Wali Siswa',
        keperluan: 'Konsultasi perkembangan belajar dan ketertiban kehadiran peserta didik',
        hariTanggal: 'Senin, 02 November 2026',
        waktu: '09.00 WIB s.d. selesai',
        catatan: 'Diharapkan hadir tepat waktu tanpa diwakilkan menemui Wali Kelas dan Guru BK.',
      },
    },
    {
      id: 'keterangan-aktif',
      name: 'Surat Keterangan Siswa Aktif',
      jenis: 'Surat Keterangan Aktif Belajar',
      description: 'Menerangkan status aktif siswa untuk beasiswa, tunjangan gaji orang tua, atau visa.',
      defaultData: {
        tujuan: 'Instansi / Lembaga Terkait',
        keperluan: 'Pengajuan Beasiswa Pendidikan dan Pembaruan Berkas Tunjangan Kerja Orang Tua',
        hariTanggal: 'Tahun Pelajaran 2026/2027',
        waktu: 'Hari Kerja',
        catatan: 'Peserta didik tercatat aktif, berkelakuan baik, dan tidak melanggar tata tertib sekolah.',
      },
    },
    {
      id: 'surat-tugas',
      name: 'Surat Perintah Tugas Guru / PTK',
      jenis: 'Surat Perintah Tugas Kedinasan',
      description: 'Penugasan dinas luar, pelatihan kurikulum merdeka, atau lomba siswa.',
      defaultData: {
        tujuan: 'Guru / Tenaga Kependidikan',
        keperluan: 'Mengikuti Bimbingan Teknis Standarisasi Administrasi Kejuruan Tingkat Provinsi',
        hariTanggal: 'Kamis s.d. Jumat, 05-06 November 2026',
        waktu: '08.00 - 16.00 WIB',
        catatan: 'Biaya akomodasi dibebankan pada anggaran BOS dan wajib menyerahkan laporan pelaksanaan tugas.',
      },
    },
    {
      id: 'undangan-rapat',
      name: 'Surat Undangan Rapat Pleno Komite',
      jenis: 'Surat Undangan Rapat Sekolah',
      description: 'Rapat koordinasi komite sekolah, program tahunan, dan sosialisasi asesmen.',
      defaultData: {
        tujuan: 'Seluruh Pengurus Komite Sekolah & Perwakilan Wali Murid',
        keperluan: 'Rapat Pleno Sosialisasi Program Kerja Semester Ganjil dan Rencana Anggaran BOS',
        hariTanggal: 'Sabtu, 07 November 2026',
        waktu: '08.30 WIB - Selesai',
        catatan: 'Bertempat di Aula Utama SMKN 1 Teladan Bangsa.',
      },
    },
  ];

  const [activePreset, setActivePreset] = useState<TemplatePreset>(presets[0]);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [targetStaffId, setTargetStaffId] = useState(staff[0]?.id || '');
  const [jenisSurat, setJenisSurat] = useState(presets[0].jenis);
  const [tujuan, setTujuan] = useState(presets[0].defaultData.tujuan);
  const [keperluan, setKeperluan] = useState(presets[0].defaultData.keperluan);
  const [hariTanggal, setHariTanggal] = useState(presets[0].defaultData.hariTanggal);
  const [waktu, setWaktu] = useState(presets[0].defaultData.waktu);
  const [catatan, setCatatan] = useState(presets[0].defaultData.catatan);
  const [tone, setTone] = useState('Formal Kedinasan');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: TemplatePreset) => {
    setActivePreset(preset);
    setJenisSurat(preset.jenis);
    setTujuan(preset.defaultData.tujuan);
    setKeperluan(preset.defaultData.keperluan);
    setHariTanggal(preset.defaultData.hariTanggal);
    setWaktu(preset.defaultData.waktu);
    setCatatan(preset.defaultData.catatan);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const selectedStudent = students.find((s) => s.id === targetStudentId);
    const selectedStaff = staff.find((s) => s.id === targetStaffId);

    const payload = {
      jenisSurat,
      schoolName: schoolProfile.namaSekolah,
      tone,
      dataDetail: {
        tujuan,
        keperluan,
        hariTanggal,
        waktu,
        catatan,
        namaSiswa: selectedStudent?.nama,
        nisn: selectedStudent?.nisn,
        kelas: selectedStudent?.kelas,
        wali: selectedStudent?.namaWali,
        alamatSiswa: selectedStudent?.alamat,
        namaGuru: selectedStaff?.nama,
        nipGuru: selectedStaff?.nip,
        jabatanGuru: selectedStaff?.jabatan,
        kepalaSekolah: schoolProfile.kepalaSekolah,
        nipKepalaSekolah: schoolProfile.nipKepalaSekolah,
        kepalaTU: schoolProfile.kepalaTU,
      },
    };

    try {
      const res = await fetch('/api/generate-surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setGeneratedDraft(data.content);
    } catch (err) {
      console.error('Error contacting AI server:', err);
      // Fallback generator in case endpoint is blocked
      const fallback = `SURAT DINAS RESMI
Nomor: 421.1 / ${Math.floor(100 + Math.random() * 899)} / ${schoolProfile.namaSekolah.replace(/\s+/g, '')} / X / 2026

Perihal : ${jenisSurat}

Kepada Yth.
${tujuan}
di Tempat

Dengan hormat,
Sehubungan dengan program kerja sekolah di ${schoolProfile.namaSekolah}, bersama ini kami sampaikan agenda:

Keperluan       : ${keperluan}
Hari / Tanggal  : ${hariTanggal}
Waktu           : ${waktu}
Catatan         : ${catatan}

Demikian surat ini kami sampaikan, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.

${schoolProfile.kotaKabupaten}, ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date())}

Kepala Sekolah,



${schoolProfile.kepalaSekolah}
NIP. ${schoolProfile.nipKepalaSekolah}`;
      setGeneratedDraft(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintDraft = () => {
    openPrintModal({
      type: 'kustom-ai',
      title: `Draf Resmi - ${jenisSurat}`,
      data: {},
      customBody: generatedDraft,
    });
  };

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Asisten Penyusun Naskah Dinas & Surat Resmi AI</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menyusun draf surat dinas otomatis berstandar Tata Naskah Dinas Kementerian Pendidikan RI dalam hitungan detik.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Didukung Model Cerdas Gemini 3.8 Flash</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={`p-3 rounded-lg border text-left transition-all ${
              activePreset.id === preset.id
                ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs text-slate-900">{preset.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{preset.description}</p>
          </button>
        ))}
      </div>

      {/* 2-Column Interface: Left Form Parameters, Right Generated Draft Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Parameters */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-bold text-slate-900">Parameter Dokumen Dinas</span>
            <span className="text-[11px] text-slate-400">Sesuaikan rincian</span>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Perihal / Jenis Surat*</label>
            <input
              type="text"
              value={jenisSurat}
              onChange={(e) => setJenisSurat(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          {jenisSurat.includes('Wali') || jenisSurat.includes('Aktif') ? (
            <div>
              <label className="block text-slate-700 font-medium mb-1">Pilih Siswa Terkait</label>
              <select
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas} - Wali: {s.namaWali})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-slate-700 font-medium mb-1">Pilih Guru / PTK Ditugaskan</label>
              <select
                value={targetStaffId}
                onChange={(e) => setTargetStaffId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.nama} ({st.jabatan})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-medium mb-1">Tujuan / Kepada Yth.*</label>
            <input
              type="text"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              placeholder="Contoh: Orang Tua / Wali Siswa"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Pokok Acara / Keperluan*</label>
            <textarea
              rows={2}
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Hari & Tanggal</label>
              <input
                type="text"
                value={hariTanggal}
                onChange={(e) => setHariTanggal(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Waktu Pelaksanaan</label>
              <input
                type="text"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Catatan Khusus / Instruksi Tambahan</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Instruksi khusus atau ketentuan membawa berkas..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Gaya Bahasa Naskah</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded"
            >
              <option value="Formal Kedinasan">Formal Kedinasan (Birokrasi Baku)</option>
              <option value="Santun & Persuasif">Santun & Persuasif (Komunikasi Wali Murid)</option>
              <option value="Tegas & Instruksional">Tegas & Instruksional (Surat Tugas / Peringatan)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Sedang Merumuskan Naskah Surat...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buat Draf Naskah Surat Sekarang</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Draft Editor */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div>
              <span className="font-bold text-slate-900 text-xs">Lembar Draf Surat Resmi</span>
              <p className="text-[11px] text-slate-500">Dapat disunting langsung sebelum dicetak</p>
            </div>
            {generatedDraft && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <button
                  onClick={handlePrintDraft}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs transition-colors"
                >
                  <Printer className="w-3 h-3" />
                  <span>Cetak Kop Resmi</span>
                </button>
              </div>
            )}
          </div>

          {generatedDraft ? (
            <textarea
              rows={18}
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              className="w-full flex-1 p-3 text-xs font-mono leading-relaxed bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none select-text"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
              <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
              <p className="font-medium text-xs text-slate-600">Draf Surat Belum Dibuat</p>
              <p className="text-[11px] max-w-xs mt-1">
                Pilih template preset di atas atau lengkapi parameter di sebelah kiri, lalu klik "Buat Draf Naskah Surat Sekarang".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
