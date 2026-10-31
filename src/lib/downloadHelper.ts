import JSZip from 'jszip';
import { SOURCE_CODE_MANIFEST } from './sourceCodeManifest';

const README_TEXT = `# SI-TATAUSAHA LENGKAP - Sistem Informasi Tata Usaha Satuan Pendidikan

Aplikasi Administrasi Tata Usaha Sekolah & Persuratan Kedinasan Resmi lengkap dengan:
1. Kop Surat Resmi Logo Ganda (Tut Wuri Handayani & Lambang Pemda) dengan batas ganda 3px/1px
2. Posisi Titi Mangsa Kedinasan Terpisah (Kanan Atas sejajar nomor atau Di Atas Tanda Tangan)
3. Modul Mutasi Siswa (Masuk & Keluar) terhubung alur Operator Dapodik
4. Upload Berkas Scan Fisik Surat Masuk & Keluar dengan Lightbox Viewer interaktif
5. Template Surat Resmi Baru:
   - SPPD (Surat Perintah Perjalanan Dinas) 2 Lembar + Rincian Biaya Riil
   - Surat Undangan Rapat Dinas GTK (Guru & Tenaga Kependidikan)
   - Surat Panggilan Orang Tua / Wali Murid
6. Keamanan Login Akun Kedinasan

---

## 🚀 Panduan Menjalankan di Komputer Lokal (Laptop / PC):

1. **Pastikan Node.js sudah terinstal**:
   Cek dengan perintah:
   \`\`\`bash
   node -v
   \`\`\`
   Jika belum, unduh Node.js LTS di https://nodejs.org/

2. **Buka Terminal / Command Prompt**:
   Buka folder hasil ekstrak ini di VS Code (atau klik kanan -> Open Terminal).

3. **Instal Dependensi**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Jalankan Aplikasi**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Buka di Browser**:
   Buka browser Anda dan tuju ke:
   http://localhost:3000

Selamat menggunakan Sistem Informasi Tata Usaha Sekolah!
`;

export async function downloadProjectZip(): Promise<void> {
  try {
    const zip = new JSZip();

    // 1. Pack all source code files from the manifest into the zip
    for (const [filePath, fileContent] of Object.entries(SOURCE_CODE_MANIFEST)) {
      zip.file(filePath, fileContent);
    }

    // 2. Add documentation
    zip.file('README.md', README_TEXT);

    // 3. Generate blob client-side
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    // 4. Trigger browser download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SI-TATAUSAHA-LENGKAP.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);
  } catch (err) {
    console.error('Client-side zip bundling error, falling back to static zip file:', err);
    // Fallback: try fetching the static zip from public/
    try {
      const res = await fetch('/SI-TATAUSAHA-LENGKAP.zip');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SI-TATAUSAHA-LENGKAP.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      window.location.href = '/SI-TATAUSAHA-LENGKAP.zip';
    }
  }
}
