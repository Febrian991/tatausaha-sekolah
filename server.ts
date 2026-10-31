import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to generate formal Indonesian official school letters (Surat Dinas / Tata Usaha)
app.post('/api/generate-surat', async (req, res) => {
  try {
    const { jenisSurat, dataDetail, schoolName, tone } = req.body;

    if (!ai) {
      // Graceful offline fallback template generator
      return res.json({
        content: generateFallbackSurat(jenisSurat, dataDetail, schoolName),
        source: 'fallback',
      });
    }

    const systemInstruction = `Anda adalah Staf Ahli Tata Usaha dan Administrasi Sekolah Indonesia berpengalaman. Tugas Anda adalah membuat draf naskah surat dinas resmi sekolah yang rapi, formal, sesuai kaidah Tata Naskah Dinas Kementerian Pendidikan Republik Indonesia, Bahasa Indonesia yang baku (EYD), dan siap ditandatangani oleh Kepala Sekolah atau Kepala Tata Usaha.

Ketentuan:
1. Format harus terstruktur:
   - KOP SURAT (hanya sebutkan placeholder atau ikuti nama sekolah)
   - NOMOR SURAT, LAMPIRAN, PERIHAL
   - KEPADA YTH (Tujuan)
   - SALAM PEMBUKA
   - ISI SURAT (Dasar pemikiran, detail acara/keterangan yang jelas dan runtut)
   - SALAM PENUTUP
   - TITIMANGSA (Tempat, Tanggal), JABATAN PENGESAH, NAMA & NIP
   - TEMBUSAN (jika relevan)
2. Gunakan gaya bahasa resmi, lugas, santun, dan profesional.
3. Berikan output langsung naskah surat yang siap digunakan (boleh gunakan markdown rapi).`;

    const prompt = `Buatkan draf surat dinas resmi sekolah untuk:
Jenis Surat: ${jenisSurat}
Nama Sekolah: ${schoolName || 'SMA Negeri 1 Teladan'}
Detail Informasi:
${JSON.stringify(dataDetail, null, 2)}
Karakter Nada: ${tone || 'Formal dan Lugas'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const generatedText = response.text || '';
    return res.json({
      content: generatedText,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error generating official letter with Gemini:', error);
    // Fall back to template on error so user is never blocked
    const { jenisSurat, dataDetail, schoolName } = req.body;
    return res.json({
      content: generateFallbackSurat(jenisSurat, dataDetail, schoolName),
      source: 'fallback_on_error',
      errorMessage: error.message,
    });
  }
});

// Helper fallback template generator
function generateFallbackSurat(jenisSurat: string, dataDetail: any = {}, schoolName: string = 'SMA Negeri 1 Teladan'): string {
  const tanggalHariIni = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

  if (jenisSurat.toLowerCase().includes('keterangan aktif')) {
    return `SURAT KETERANGAN SISWA AKTIF
Nomor: 421.3 / 184 / ${schoolName.replace(/\s+/g, '')} / X / 2026

Yang bertanda tangan di bawah ini, Kepala ${schoolName}, menerangkan dengan sesungguhnya bahwa:

Nama Lengkap          : ${dataDetail.nama || 'Ahmad Rifqi Pratama'}
NISN / NIS            : ${dataDetail.nisn || '0071829301'} / ${dataDetail.nis || '24250101'}
Kelas / Jurusan       : ${dataDetail.kelas || 'XI RPL 1'}
Tempat, Tanggal Lahir : ${dataDetail.tempatTanggalLahir || 'Bandung, 14 Mei 2008'}
Nama Orang Tua / Wali : ${dataDetail.namaWali || 'Budi Santoso'}
Alamat Tinggal        : ${dataDetail.alamat || 'Jl. Raya Pendidikan No. 42'}

Adalah benar-benar siswa/siswi yang tercatat AKTIF mengikuti kegiatan proses belajar mengajar pada ${schoolName} Tahun Ajaran 2026/2027 dan memiliki kelakuan baik.

Surat keterangan ini diterbitkan atas permohonan yang bersangkutan untuk keperluan: ${dataDetail.keperluan || 'Pengurusan Beasiswa / Kelengkapan Administrasi'}.

Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.

Ditetapkan di : Bandung
Pada tanggal  : ${tanggalHariIni}

Kepala Sekolah,



Drs. H. Mulyadi, M.Pd.
NIP. 19740512 199903 1 004`;
  }

  if (jenisSurat.toLowerCase().includes('panggilan') || jenisSurat.toLowerCase().includes('undangan orang tua')) {
    return `SURAT PANGGILAN ORANG TUA / WALI MURID
Nomor: 421.4 / 092 / TU-BK / X / 2026

Lampiran : -
Perihal  : Undangan Konsultasi Perkembangan Siswa

Kepada Yth.
Bapak/Ibu Orang Tua / Wali dari:
Nama Siswa : ${dataDetail.nama || 'Ahmad Rifqi Pratama'}
Kelas      : ${dataDetail.kelas || 'XI RPL 1'}
di Tempat

Dengan hormat,
Sehubungan dengan adanya beberapa hal penting terkait perkembangan akademik dan ketertiban siswa di sekolah yang memerlukan koordinasi bersama, maka melalui surat ini kami mengharapkan kehadiran Bapak/Ibu pada:

Hari / Tanggal : ${dataDetail.hariTanggal || 'Senin, 02 November 2026'}
Waktu          : ${dataDetail.waktu || '09.00 WIB s.d. selesai'}
Tempat         : Ruang Bimbingan Konseling (BK) / Ruang Tata Usaha ${schoolName}
Keperluan      : ${dataDetail.keperluan || 'Konsultasi kehadiran dan koordinasi pembinaan belajar siswa'}
Menemui        : Koordinator BK dan Wali Kelas

Mengingat pentingnya agenda tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya tanpa diwakilkan.

Demikian undangan ini kami sampaikan, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.

${tanggalHariIni}
Mengetahui,
Kepala Sekolah,



Drs. H. Mulyadi, M.Pd.
NIP. 19740512 199903 1 004`;
  }

  return `SURAT DINAS RESMI
Nomor: 421.1 / 045 / ${schoolName.replace(/\s+/g, '')} / 2026

Perihal : ${jenisSurat}

Kepada Yth.
${dataDetail.tujuan || 'Pihak Terkait'}
di Tempat

Dengan hormat,
Sehubungan dengan program kerja tata usaha dan operasional ${schoolName}, bersama surat ini kami sampaikan bahwa:

${dataDetail.catatan || 'Segala ketentuan dan instruksi operasional agar dapat dilaksanakan dengan penuh tanggung jawab sesuai prosedur tata kelola dinas pendidikan.'}

Demikian surat ini disampaikan untuk menjadi perhatian dan dilaksanakan sebagaimana mestinya.

${tanggalHariIni}
Kepala Tata Usaha,



Siti Aminah, S.Sos.
NIP. 19820315 200604 2 007`;
}

// Dev vs Production server handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Tata Usaha Sekolah is running on port ${PORT}`);
  });
}

startServer();
