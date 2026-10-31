import React from 'react';
import { SchoolProfile } from '../types/situ';

interface KopSuratResmiProps {
  profile: SchoolProfile;
  className?: string;
}

export const KopSuratResmi: React.FC<KopSuratResmiProps> = ({ profile, className = '' }) => {
  // Jika pengguna memilih mode Kop Gambar Lengkap (Full Banner Image Upload)
  if (profile.modeKop === 'GAMBAR_BANNER' && profile.kopBannerUrl) {
    return (
      <div className={`w-full font-surat text-black select-none ${className}`}>
        <img
          src={profile.kopBannerUrl}
          alt={`Kop Surat ${profile.namaSekolah}`}
          className="w-full object-contain max-h-36 sm:max-h-44 mx-auto"
        />
        {/* Garis pembatas opsional jika banner belum memuat garis */}
        <div className="w-full mt-1">
          <div className="h-[2.5px] bg-black w-full" />
          <div className="h-[0.75px] bg-black w-full mt-[1.5px]" />
        </div>
      </div>
    );
  }

  // Default: Mode Kop Standar Teks + Logo Ganda (dengan dukungan Logo Upload)
  return (
    <div className={`w-full font-surat text-black select-none ${className}`}>
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Logo Kiri: Pemda / Tut Wuri Handayani (Bisa Upload atau Vector Bawaan) */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          {profile.logoKiriUrl ? (
            <img
              src={profile.logoKiriUrl}
              alt="Logo Instansi Kiri"
              className="max-h-20 max-w-20 object-contain"
            />
          ) : (
            /* Official Tut Wuri Handayani Vector Emblem */
            <svg
              className="w-18 h-18 text-blue-900 fill-current"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="50,4 96,25 96,75 50,96 4,75 4,25" fill="#1e3a8a" />
              <polygon points="50,10 90,28 90,72 50,90 10,72 10,28" fill="#ffffff" />
              <polygon points="50,14 86,30 86,70 50,86 14,70 14,30" fill="#1e40af" />
              <circle cx="50" cy="46" r="16" fill="#fbbf24" />
              <path d="M50 32 L54 44 L66 44 L56 52 L60 64 L50 56 L40 64 L44 52 L34 44 L46 44 Z" fill="#b45309" />
              <text x="50" y="78" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#ffffff">TUT WURI</text>
            </svg>
          )}
        </div>

        {/* Identitas Instansi & Sekolah */}
        <div className="flex-1 text-center leading-tight space-y-0.5">
          <div className="text-sm font-semibold tracking-wider uppercase">
            {profile.provinsi}
          </div>
          <div className="text-base font-bold tracking-wide uppercase">
            {profile.dinas}
          </div>
          {profile.cabangDinas && (
            <div className="text-xs font-medium uppercase tracking-normal">
              {profile.cabangDinas}
            </div>
          )}
          <div className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase py-0.5 text-black">
            {profile.namaSekolah}
          </div>
          <div className="text-xs italic text-slate-800">
            NPSN: {profile.npsn} · NSS: {profile.nss} · Terakreditasi: {profile.akreditasi}
          </div>
          <div className="text-[11px] text-slate-900">
            {profile.alamat}, {profile.kota} {profile.kodePos}
          </div>
          <div className="text-[10px] text-slate-800">
            Telp: {profile.telepon} · Laman: {profile.website} · Pos-el: {profile.email}
          </div>
        </div>

        {/* Logo Kanan: Lambang Sekolah (Bisa Upload atau Vector Bawaan) */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          {profile.logoKananUrl ? (
            <img
              src={profile.logoKananUrl}
              alt="Logo Sekolah Kanan"
              className="max-h-20 max-w-20 object-contain"
            />
          ) : (
            /* Custom School Shield Emblem */
            <svg
              className="w-18 h-18 text-emerald-800 fill-current"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M50 5 L88 20 L88 55 C88 78 50 95 50 95 C50 95 12 78 12 55 L12 20 Z" fill="#047857" />
              <path d="M50 11 L82 23 L82 53 C82 72 50 87 50 87 C50 87 18 72 18 53 L18 23 Z" fill="#ffffff" />
              <path d="M50 35 L50 68 C45 64 35 62 25 64 L25 36 C35 34 45 36 50 38 C55 36 65 34 75 36 L75 64 C65 62 55 64 50 68" stroke="#047857" strokeWidth="3" fill="none" />
              <circle cx="50" cy="28" r="6" fill="#f59e0b" />
              <path d="M47 22 Q50 16 53 22 Z" fill="#ef4444" />
              <text x="50" y="80" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#047857">SMAN 1</text>
            </svg>
          )}
        </div>
      </div>

      {/* Garis Pembatas Ganda Khas Surat Resmi Dinas */}
      <div className="w-full">
        <div className="h-[2.5px] bg-black w-full" />
        <div className="h-[0.75px] bg-black w-full mt-[1.5px]" />
      </div>
    </div>
  );
};
