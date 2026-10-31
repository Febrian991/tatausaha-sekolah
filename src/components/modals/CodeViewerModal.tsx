import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Folder, 
  ExternalLink 
} from 'lucide-react';
import { SOURCE_CODE_MANIFEST } from '../../lib/sourceCodeManifest';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({
  isOpen,
  onClose,
  onDownloadZip,
}) => {
  const fileList = Object.keys(SOURCE_CODE_MANIFEST);
  const [selectedFile, setSelectedFile] = useState<string>(fileList[0] || 'src/App.tsx');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const currentCode = SOURCE_CODE_MANIFEST[selectedFile] || '// File not found';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.split('/').pop() || 'code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFiles = fileList.filter(f => f.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Penjelajah Kode Sumber (Source Code Explorer)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 font-mono">
                  {fileList.length} Berkas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lihat, salin, atau unduh seluruh berkas kode aplikasi secara langsung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              title="Unduh seluruh source code dalam format .zip"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh ZIP Lengkap</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Left sidebar (file tree) + Right pane (code display) */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-64 sm:w-72 border-r border-slate-800 bg-slate-950/60 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800">
              <input
                type="text"
                placeholder="Cari nama berkas..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs font-mono">
              {filteredFiles.map(file => {
                const isSelected = selectedFile === file;
                const fileName = file.split('/').pop();
                const folderName = file.includes('/') ? file.substring(0, file.lastIndexOf('/')) : '';
                return (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-sky-600/30 text-sky-200 font-semibold border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <span className="block truncate">{fileName}</span>
                      {folderName && (
                        <span className="text-[10px] text-slate-600 block truncate">{folderName}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
            {/* File info and toolbar */}
            <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-sky-400 truncate">
                <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{selectedFile}</span>
                <span className="text-[11px] text-slate-500 font-sans">
                  ({(currentCode.length / 1024).toFixed(1)} KB)
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode'}</span>
                </button>
                <button
                  onClick={handleDownloadSingleFile}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas Ini</span>
                </button>
              </div>
            </div>

            {/* Code lines container */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-slate-950 text-slate-300 select-text">
              <pre className="overflow-x-auto whitespace-pre">
                {currentCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer with direct URL link info */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>Link unduh langsung:</span>
            <a
              href="/SI-TATAUSAHA-LENGKAP.zip"
              download="SI-TATAUSAHA-LENGKAP.zip"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>/SI-TATAUSAHA-LENGKAP.zip</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span>Bisa diekstrak dan langsung dijalankan dengan: npm install &amp;&amp; npm run dev</span>
        </div>
      </div>
    </div>
  );
};
