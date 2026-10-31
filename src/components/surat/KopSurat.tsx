import React from 'react';
import { SchoolProfile, TitiMangsaPosition } from '../../types';

interface KopSuratProps {
  profile: SchoolProfile;
  overrideTitiMangsaPos?: TitiMangsaPosition;
  titiMangsaDate?: string;
  nomorSurat?: string;
  lampiran?: string;
  perihal?: string;
  sifat?: string;
  tujuanPenerima?: string | string[];
}

// Tut Wuri Handayani vector logo
export const TutWuriHandayaniLogo: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Pentagon */}
    <polygon points="50,4 96,38 78,92 22,92 4,38" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
    <polygon points="50,8 91,40 75,88 25,88 9,40" fill="#0ea5e9" opacity="0.3" />
    
    {/* Inner golden shield */}
    <circle cx="50" cy="50" r="32" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
    
    {/* Flame/Torch */}
    <path d="M50 26 C47 34, 42 38, 42 45 C42 50, 45 54, 50 54 C55 54, 58 50, 58 45 C58 38, 53 34, 50 26 Z" fill="#dc2626" />
    <path d="M50 32 C48 37, 45 40, 45 45 C45 48, 47 51, 50 51 C53 51, 55 48, 55 45 C55 40, 52 37, 50 32 Z" fill="#f97316" />
    
    {/* Wings */}
    <path d="M30 45 C35 48, 42 52, 48 55 C42 56, 34 57, 28 54 C26 50, 28 47, 30 45 Z" fill="#ffffff" />
    <path d="M70 45 C65 48, 58 52, 52 55 C58 56, 66 57, 72 54 C74 50, 72 47, 70 45 Z" fill="#ffffff" />
    <path d="M26 53 C32 56, 40 59, 47 61 C40 63, 31 64, 25 61 C23 57, 24 55, 26 53 Z" fill="#ffffff" />
    <path d="M74 53 C68 56, 60 59, 53 61 C60 63, 69 64, 75 61 C77 57, 76 55, 74 53 Z" fill="#ffffff" />

    {/* Book at the bottom */}
    <path d="M36 67 C42 64, 48 66, 50 67 C52 66, 58 64, 64 67 L63 73 C58 70, 52 71, 50 72 C48 71, 42 70, 37 73 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
  </svg>
);

// Lambang Daerah Pemda vector logo
export const LambangPemdaLogo: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield outline */}
    <path d="M15 15 L85 15 C85 55, 75 80, 50 94 C25 80, 15 55, 15 15 Z" fill="#047857" stroke="#065f46" strokeWidth="2.5" />
    <path d="M20 20 L80 20 C80 52, 71 74, 50 86 C29 74, 20 52, 20 20 Z" fill="#10b981" opacity="0.3" />
    
    {/* Gold decorative border */}
    <path d="M25 24 L75 24 C75 50, 68 70, 50 80 C32 70, 25 50, 25 24 Z" fill="#064e3b" stroke="#eab308" strokeWidth="1.5" />

    {/* Mountain / Kujang / Monument silhouette */}
    <path d="M50 30 L60 55 L53 55 L56 70 L44 70 L47 55 L40 55 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
    
    {/* Star at the top */}
    <polygon points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27" fill="#ffffff" />
    
    {/* Ribbon base */}
    <path d="M30 76 Q50 82 70 76 L72 82 Q50 88 28 82 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
  </svg>
);

export const KopSurat: React.FC<KopSuratProps> = ({
  profile,
  overrideTitiMangsaPos,
  titiMangsaDate,
  nomorSurat,
  lampiran = '-',
  perihal,
  sifat = 'Biasa',
  tujuanPenerima,
}) => {
  const titiPos = overrideTitiMangsaPos || profile.titiMangsaPosition;
  const tanggalTampil = titiMangsaDate || `${profile.kotaKabupaten.replace(/^(Kota|Kabupaten)\s+/i, '')}, ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}`;

  return (
    <div className="font-surat text-black select-text">
      {/* 1. KOP SURAT RESMI PALING ATAS - LOGO GANDA & GARIS BATAS GANDA */}
      <div className="flex items-center justify-between pb-2">
        {/* Logo Kiri: Tut Wuri Handayani */}
        <div className="shrink-0 flex items-center justify-center w-24">
          <TutWuriHandayaniLogo className="w-20 h-20" />
        </div>

        {/* Teks Hierarki Kedinasan */}
        <div className="flex-1 text-center px-3 leading-snug">
          <h3 className="text-sm tracking-wide font-bold uppercase">{profile.namaPemda}</h3>
          <h2 className="text-base tracking-wide font-bold uppercase">{profile.namaDinas}</h2>
          {profile.cabangDinas && (
            <h4 className="text-xs font-semibold uppercase">{profile.cabangDinas}</h4>
          )}
          <h1 className="text-lg md:text-xl font-black tracking-tight uppercase my-0.5 text-black">
            {profile.namaSekolah}
          </h1>
          <p className="text-[10px] text-gray-800">
            NPSN: {profile.npsn} | NSS: {profile.nss} | Akreditasi: {profile.akreditasi}
          </p>
          <p className="text-[10px] text-gray-800 mt-0.5">
            {profile.alamat}, {profile.kotaKabupaten}, {profile.provinsi} {profile.kodePos}
          </p>
          <p className="text-[9.5px] text-gray-700">
            Telp: {profile.telepon} | Pos-el: {profile.email} | Laman: {profile.website}
          </p>
        </div>

        {/* Logo Kanan: Lambang Pemda */}
        <div className="shrink-0 flex items-center justify-center w-24">
          <LambangPemdaLogo className="w-20 h-20" />
        </div>
      </div>

      {/* Garis Pembatas Ganda Tebal-Tipis Resmi Kedinasan */}
      <div className="w-full mb-4">
        <div className="border-t-[3px] border-black w-full" />
        <div className="border-t-[1px] border-black w-full mt-[2px]" />
      </div>

      {/* 2. BAGIAN NOMOR SURAT & TITI MANGSA (POSISI FLEKSIBEL) */}
      {(nomorSurat || perihal || titiPos === 'header_right') && (
        <div className="flex justify-between items-start text-xs leading-relaxed mb-6">
          {/* Kolom Kiri: Nomor, Sifat, Lampiran, Hal */}
          <div className="w-7/12">
            {nomorSurat && (
              <div className="grid grid-cols-[70px_10px_1fr] items-start">
                <span>Nomor</span>
                <span>:</span>
                <span className="font-semibold">{nomorSurat}</span>
              </div>
            )}
            {sifat && (
              <div className="grid grid-cols-[70px_10px_1fr] items-start">
                <span>Sifat</span>
                <span>:</span>
                <span>{sifat}</span>
              </div>
            )}
            {lampiran && (
              <div className="grid grid-cols-[70px_10px_1fr] items-start">
                <span>Lampiran</span>
                <span>:</span>
                <span>{lampiran}</span>
              </div>
            )}
            {perihal && (
              <div className="grid grid-cols-[70px_10px_1fr] items-start">
                <span className="font-semibold">Hal / Perihal</span>
                <span>:</span>
                <span className="font-semibold underline">{perihal}</span>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Titi Mangsa (Jika titiPos === 'header_right') */}
          <div className="w-5/12 text-right">
            {titiPos === 'header_right' ? (
              <div className="inline-block text-left">
                <p className="font-medium">{tanggalTampil}</p>
                {tujuanPenerima && (
                  <div className="mt-4">
                    <p>Kepada Yth.</p>
                    {Array.isArray(tujuanPenerima) ? (
                      tujuanPenerima.map((t, idx) => (
                        <p key={idx} className="font-semibold">{t}</p>
                      ))
                    ) : (
                      <p className="font-semibold">{tujuanPenerima}</p>
                    )}
                    <p>di Tempat</p>
                  </div>
                )}
              </div>
            ) : (
              tujuanPenerima && (
                <div className="inline-block text-left">
                  <p>Kepada Yth.</p>
                  {Array.isArray(tujuanPenerima) ? (
                    tujuanPenerima.map((t, idx) => (
                      <p key={idx} className="font-semibold">{t}</p>
                    ))
                  ) : (
                    <p className="font-semibold">{tujuanPenerima}</p>
                  )}
                  <p>di Tempat</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
