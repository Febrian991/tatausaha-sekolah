import { 
  Building2, 
  User, 
  LogOut, 
  Printer, 
  ShieldCheck,
  Download,
  Code
} from 'lucide-react';
import { UserSession, SchoolProfile } from '../../types';

interface HeaderProps {
  currentView: string;
  user: UserSession | null;
  profile: SchoolProfile;
  onLogout: () => void;
  onOpenQuickPrint?: () => void;
  onOpenCodeViewer?: () => void;
  onDownloadZip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  user,
  profile,
  onLogout,
  onOpenQuickPrint,
  onOpenCodeViewer,
  onDownloadZip,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Administrasi & Statistik TU';
      case 'surat-masuk': return 'Buku Agenda Surat Masuk & Disposisi';
      case 'surat-keluar': return 'Buku Agenda Surat Keluar & Pengiriman';
      case 'mutasi': return 'Manajemen Mutasi Siswa (Alur Dapodik)';
      case 'template': return 'Generator Template Surat Kedinasan (SPPD, Undangan, Panggilan)';
      case 'settings': return 'Pengaturan Identitas Sekolah & Kop Dinas';
      default: return 'Sistem Informasi Tata Usaha';
    }
  };

  return (
    <header className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 shrink-0 shadow-xs z-20">
      {/* Zone 1: Breadcrumb and Context Title */}
      <div className="flex items-center gap-3 truncate">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="truncate">{profile.namaSekolah}</span>
          <span>/</span>
        </div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
          {getViewTitle()}
        </h1>
      </div>

      {/* Zone 2: Fast Quick Action & Trust Badge & Direct Download */}
      <div className="hidden md:flex items-center gap-2 text-xs">
        {onOpenCodeViewer && (
          <button
            onClick={onOpenCodeViewer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-lg text-xs font-semibold transition-all shadow-xs shrink-0"
            title="Buka penjelajah dan salin kode sumber aplikasi"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Lihat Kode Sumber</span>
          </button>
        )}

        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          title="Unduh langsung file SI-TATAUSAHA-LENGKAP.zip untuk komputer lokal"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh ZIP Lengkap</span>
        </button>

        {onOpenQuickPrint && (
          <button
            onClick={onOpenQuickPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Cepat</span>
          </button>
        )}
      </div>

      {/* Zone 3: Account Profile & Logout */}
      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{user.roleLabel}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <button
              onClick={onLogout}
              title="Keluar dari Akun"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Masuk
          </button>
        )}
      </div>
    </header>
  );
};
