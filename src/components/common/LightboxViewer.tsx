import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileText, 
  Maximize2 
} from 'lucide-react';
import { ScanFileInfo } from '../../types';

interface LightboxViewerProps {
  scanFile: ScanFileInfo | null;
  onClose: () => void;
}

export const LightboxViewer: React.FC<LightboxViewerProps> = ({ scanFile, onClose }) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!scanFile) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = scanFile.dataUrl;
    a.download = scanFile.namaFile;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top bar control */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/70 text-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-sky-400 shrink-0" />
            <div className="truncate">
              <h3 className="text-sm font-semibold text-white truncate">{scanFile.namaFile}</h3>
              <p className="text-xs text-slate-400">
                Ukuran: {scanFile.ukuran} · Diupload: {scanFile.uploadedAt}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleZoomOut}
              title="Perkecil (-)"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1 text-slate-400 tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Perbesar (+)"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              title="Putar 90°"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset Tampilan"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Unduh Berkas Scan"
              className="flex items-center gap-1.5 px-3 py-1.5 ml-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
            <button
              onClick={onClose}
              title="Tutup (Esc)"
              className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas / Image Viewport */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/40 select-none">
          <div 
            className="transition-transform duration-200 ease-out origin-center max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`
            }}
          >
            <img
              src={scanFile.dataUrl}
              alt={scanFile.namaFile}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full rounded shadow-xl bg-white object-contain"
            />
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2 bg-slate-950/80 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Pratinjau Arsip Digital Fisik Tata Usaha</span>
          <span>Gunakan tombol zoom dan putar untuk membaca detail cap kedinasan & tanda tangan</span>
        </div>
      </div>
    </div>
  );
};
