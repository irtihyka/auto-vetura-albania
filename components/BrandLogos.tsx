"use client";

import Link from "next/link";

/* ════════════════════════════════════════════════════════
   SVG brand logos — simplified recognizable icons for each brand
   Used on homepage + /brands page
════════════════════════════════════════════════════════ */

export const brandSvgs: Record<string, React.ReactNode> = {
  /* ── Audi — four rings ── */
  Audi: (
    <svg viewBox="0 0 80 40" fill="none" className="w-full h-full">
      <circle cx="16" cy="20" r="9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="30" cy="20" r="9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="44" cy="20" r="9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="58" cy="20" r="9" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),

  /* ── BMW — quartered circle ── */
  BMW: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="7" x2="24" y2="41" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="24" x2="41" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 7 A17 17 0 0 1 41 24 L24 24 Z" fill="currentColor" opacity="0.15" />
      <path d="M7 24 A17 17 0 0 1 24 41 L24 24 Z" fill="currentColor" opacity="0.15" />
      <text x="24" y="47" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="bold" fontFamily="Arial">BMW</text>
    </svg>
  ),

  /* ── Mercedes — three-pointed star ── */
  "Mercedes-Benz": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <line x1="24" y1="24" x2="24" y2="5" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="24" x2="7.5" y2="37" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="24" x2="40.5" y2="37" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  /* ── Volkswagen — V + W in circle ── */
  Volkswagen: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 14 L24 32 L34 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20 L24 37 L31 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  /* ── Toyota — overlapping ovals ── */
  Toyota: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <ellipse cx="28" cy="20" rx="25" ry="17" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="28" cy="20" rx="15" ry="10" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="28" cy="20" rx="7" ry="17" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  /* ── Ford — oval with text ── */
  Ford: (
    <svg viewBox="0 0 60 30" fill="none" className="w-full h-full">
      <rect x="2" y="2" width="56" height="26" rx="13" stroke="currentColor" strokeWidth="2.5" />
      <text x="30" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic">Ford</text>
    </svg>
  ),

  /* ── Opel — lightning bolt in circle ── */
  Opel: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      <path d="M10 24 H38 M30 18 L38 24 L30 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  /* ── Renault — diamond ── */
  Renault: (
    <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
      <path d="M20 3 L37 24 L20 45 L3 24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 10 L31 24 L20 38 L9 24 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  /* ── Peugeot — lion (simplified) ── */
  Peugeot: (
    <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
      <path d="M20 4 L20 20 M16 8 C12 4 8 8 12 14 M24 8 C28 4 32 8 28 14 M14 18 C10 22 10 34 14 40 L20 44 L26 40 C30 34 30 22 26 18 M14 18 L26 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="26" r="1.5" fill="currentColor" />
      <circle cx="23" cy="26" r="1.5" fill="currentColor" />
    </svg>
  ),

  /* ── Fiat — text badge ── */
  Fiat: (
    <svg viewBox="0 0 56 30" fill="none" className="w-full h-full">
      <rect x="2" y="2" width="52" height="26" rx="5" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="15" x2="54" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <text x="28" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="serif">FIAT</text>
    </svg>
  ),

  /* ── Hyundai — italic H ── */
  Hyundai: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <ellipse cx="24" cy="24" rx="21" ry="18" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 12 L16 36 M32 12 L32 36 M16 24 L32 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  /* ── Kia — text ── */
  Kia: (
    <svg viewBox="0 0 56 28" fill="none" className="w-full h-full">
      <text x="28" y="22" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold" fontFamily="Arial" letterSpacing="2">KIA</text>
      <line x1="4" y1="26" x2="52" y2="26" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  /* ── Skoda — winged arrow ── */
  Skoda: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 28 L24 14 L34 28 M18 24 L24 16 L30 24 M24 28 L24 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 20 C12 18 10 22 14 24 M32 20 C36 18 38 22 34 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  /* ── Honda — H in rectangle ── */
  Honda: (
    <svg viewBox="0 0 48 40" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 10 L16 30 M32 10 L32 30 M16 20 L32 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  /* ── Nissan — circle with bar ── */
  Nissan: (
    <svg viewBox="0 0 56 36" fill="none" className="w-full h-full">
      <circle cx="28" cy="18" r="15" stroke="currentColor" strokeWidth="2.5" />
      <rect x="4" y="14" width="48" height="8" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="28" y="22" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold" fontFamily="Arial" letterSpacing="1">NISSAN</text>
    </svg>
  ),

  /* ── Volvo — circle with arrow (male symbol) ── */
  Volvo: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="26" r="16" stroke="currentColor" strokeWidth="2.5" />
      <line x1="35" y1="11" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 4 L40 4 L40 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="40" y1="4" x2="34" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  /* ── Seat — S shape ── */
  Seat: (
    <svg viewBox="0 0 48 36" fill="none" className="w-full h-full">
      <path d="M12 12 C12 6 36 6 36 12 C36 18 12 18 12 24 C12 30 36 30 36 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <text x="24" y="35" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="bold" fontFamily="Arial">SEAT</text>
    </svg>
  ),

  /* ── Dacia — shield ── */
  Dacia: (
    <svg viewBox="0 0 44 48" fill="none" className="w-full h-full">
      <path d="M22 4 L40 12 L40 28 C40 36 32 44 22 46 C12 44 4 36 4 28 L4 12 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="22" y="30" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="bold" fontFamily="Arial">D</text>
    </svg>
  ),

  /* ── Mazda — winged M ── */
  Mazda: (
    <svg viewBox="0 0 56 36" fill="none" className="w-full h-full">
      <ellipse cx="28" cy="18" rx="25" ry="15" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 26 L22 10 L28 20 L34 10 L40 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  /* ── Citroën — double chevron ── */
  "Citroën": (
    <svg viewBox="0 0 48 40" fill="none" className="w-full h-full">
      <path d="M12 8 L24 20 L36 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20 L24 32 L36 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ── Brand colors for backgrounds ── */
export const brandColors: Record<string, { bg: string; text: string; hover: string }> = {
  "Audi": { bg: "bg-gray-900", text: "text-white", hover: "hover:bg-gray-800" },
  "BMW": { bg: "bg-amber-700", text: "text-white", hover: "hover:bg-amber-600" },
  "Mercedes-Benz": { bg: "bg-gray-800", text: "text-white", hover: "hover:bg-gray-700" },
  "Volkswagen": { bg: "bg-amber-600", text: "text-white", hover: "hover:bg-amber-500" },
  "Toyota": { bg: "bg-red-600", text: "text-white", hover: "hover:bg-red-500" },
  "Ford": { bg: "bg-amber-500", text: "text-white", hover: "hover:bg-amber-400" },
  "Opel": { bg: "bg-yellow-500", text: "text-gray-900", hover: "hover:bg-yellow-400" },
  "Renault": { bg: "bg-yellow-400", text: "text-gray-900", hover: "hover:bg-yellow-300" },
  "Peugeot": { bg: "bg-amber-800", text: "text-white", hover: "hover:bg-amber-700" },
  "Fiat": { bg: "bg-red-700", text: "text-white", hover: "hover:bg-red-600" },
  "Hyundai": { bg: "bg-amber-500", text: "text-white", hover: "hover:bg-amber-400" },
  "Kia": { bg: "bg-red-500", text: "text-white", hover: "hover:bg-red-400" },
  "Skoda": { bg: "bg-green-700", text: "text-white", hover: "hover:bg-green-600" },
  "Honda": { bg: "bg-red-600", text: "text-white", hover: "hover:bg-red-500" },
  "Nissan": { bg: "bg-gray-700", text: "text-white", hover: "hover:bg-gray-600" },
  "Volvo": { bg: "bg-blue-900", text: "text-white", hover: "hover:bg-amber-800" },
  "Seat": { bg: "bg-red-600", text: "text-white", hover: "hover:bg-red-500" },
  "Dacia": { bg: "bg-amber-600", text: "text-white", hover: "hover:bg-amber-500" },
  "Mazda": { bg: "bg-red-700", text: "text-white", hover: "hover:bg-red-600" },
  "Citroën": { bg: "bg-red-500", text: "text-white", hover: "hover:bg-red-400" },
};

export const topBrands = ["Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Toyota"];

export const allBrandsList = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo",
];

/* ── Brand logo filename mapping ── */
const brandLogoFile: Record<string, string> = {
  "Audi": "audi.png",
  "BMW": "bmw.png",
  "Citroën": "citroen.png",
  "Dacia": "dacia.png",
  "Fiat": "fiat.png",
  "Ford": "ford.png",
  "Honda": "honda.png",
  "Hyundai": "hyundai.png",
  "Kia": "kia.png",
  "Mazda": "mazda.png",
  "Mercedes-Benz": "mercedes-benz.png",
  "Nissan": "nissan.png",
  "Opel": "opel.png",
  "Peugeot": "peugeot.png",
  "Renault": "renault.png",
  "Seat": "seat.png",
  "Skoda": "skoda.png",
  "Toyota": "toyota.png",
  "Volkswagen": "volkswagen.png",
  "Volvo": "volvo.png",
};

/* ── Reusable brand card component ── */
export function BrandCard({
  brand,
  size = "lg",
}: {
  brand: string;
  size?: "md" | "lg";
}) {
  const logoFile = brandLogoFile[brand];
  const isLg = size === "lg";

  return (
    <Link
      href={`/search?brand=${encodeURIComponent(brand)}`}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" />
        <div
          className={`${isLg ? "w-28 h-28 md:w-32 md:h-32 rounded-3xl" : "w-20 h-20 md:w-24 md:h-24 rounded-2xl"} bg-white border border-gray-100 hover:border-amber-200 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl p-3 overflow-hidden`}
        >
          {logoFile ? (
            <img
              src={`/images/brand-logos/${logoFile}`}
              alt={`${brand} logo`}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className={`font-black text-gray-400 ${isLg ? "text-3xl" : "text-2xl"}`}>
              {brand.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <span className={`${isLg ? "text-sm md:text-base" : "text-xs md:text-sm"} font-bold text-gray-700 group-hover:text-amber-500 transition-colors text-center leading-tight`}>
        {brand === "Mercedes-Benz" ? "Mercedes" : brand}
      </span>
    </Link>
  );
}
