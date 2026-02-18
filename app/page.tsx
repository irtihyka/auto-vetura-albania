"use client";

import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
  ShimmerText,
} from "@/components/animations";
import SocialSection from "@/components/SocialSection";
import { allBrandsList, BrandCard } from "@/components/BrandLogos";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

/* ── Data ── */
const allBrands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo",
];
const fuelTypes = ["Benzinë", "Diesel", "Hybrid", "Elektrike", "Gas"];
const yearOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
const priceRanges = [
  { label: "0 - 5,000 €", value: "0-5000" },
  { label: "5,000 - 10,000 €", value: "5000-10000" },
  { label: "10,000 - 20,000 €", value: "10000-20000" },
  { label: "20,000 - 40,000 €", value: "20000-40000" },
  { label: "40,000+ €", value: "40000-999999" },
];
const kmRanges = [
  { label: "0 - 10,000 km", value: "0-10000" },
  { label: "10,000 - 50,000 km", value: "10000-50000" },
  { label: "50,000 - 100,000 km", value: "50000-100000" },
  { label: "100,000 - 200,000 km", value: "100000-200000" },
  { label: "200,000+ km", value: "200000-999999" },
];

const carTypes = [
  { name: "Të gjitha", value: "" },
  { name: "Sedan", value: "Sedan" },
  { name: "SUV", value: "SUV" },
  { name: "Hatchback", value: "Hatchback" },
  { name: "Coupe", value: "Coupe" },
  { name: "Karavan", value: "Karavan" },
  { name: "Furgon", value: "Furgon" },
];

const cityNames = ["Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Korçë", "Fier", "Berat", "Lushnjë", "Pogradec", "Kavajë", "Gjirokastër", "Sarandë", "Lezhë", "Kukës"];

/* ── Time-ago helper ── */
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Tani";
  if (diffMin < 60) return `${diffMin} min më parë`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} orë më parë`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Dje";
  if (diffDays < 7) return `${diffDays} ditë më parë`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} javë më parë`;
  return `${Math.floor(diffDays / 30)} muaj më parë`;
}

interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  km: number;
  price: number;
  premium: boolean;
  bodyType?: string;
  images: { url: string }[];
  createdAt?: string;
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const router = useRouter();

  /* ── Filter state ── */
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  /* ── Listings state ── */
  const [latestListings, setLatestListings] = useState<Listing[]>([]);
  const [premiumListings, setPremiumListings] = useState<Listing[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [activeTypeFilter, setActiveTypeFilter] = useState("");
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/listings?limit=18&sort=newest")
      .then((res) => res.json())
      .then((data) => setLatestListings(data.listings || []))
      .catch(() => {})
      .finally(() => setLoadingLatest(false));

    fetch("/api/listings?limit=6&sort=newest&premium=true")
      .then((res) => res.json())
      .then((data) => setPremiumListings(data.listings || []))
      .catch(() => {})
      .finally(() => setLoadingPremium(false));

    fetch("/api/listings/city-counts")
      .then((res) => res.json())
      .then((data) => setCityCounts(data.cityCounts || {}))
      .catch(() => {});
  }, []);

  /* ── GSAP hero animation ── */
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-content > *", { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, delay: 0.2 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Search handler ── */
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("model", selectedModel);
    if (selectedFuel) params.set("fuel", selectedFuel);
    if (selectedYear) {
      params.set("yearFrom", selectedYear);
      params.set("yearTo", selectedYear);
    }
    if (selectedKm) {
      const [min, max] = selectedKm.split("-");
      if (min) params.set("kmFrom", min);
      if (max) params.set("kmTo", max);
    }
    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-");
      if (min) params.set("priceFrom", min);
      if (max) params.set("priceTo", max);
    }
    router.push(`/search?${params.toString()}`);
  }, [selectedBrand, selectedModel, selectedFuel, selectedYear, selectedKm, selectedPrice, router]);

  /* ── Filter latest listings by type ── */
  const filteredListings = activeTypeFilter
    ? latestListings.filter((c) => c.bodyType === activeTypeFilter)
    : latestListings;

  /* ── Reusable car card ── */
  const CarCard = ({ car, featured = false }: { car: Listing; featured?: boolean }) => (
    <Link href={`/listing/${car.id}`} className="group block h-full">
      <div className={`bg-white rounded-2xl overflow-hidden border h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        car.premium
          ? "border-amber-200 ring-1 ring-amber-200/60 shadow-lg shadow-amber-50"
          : "border-gray-100 hover:border-blue-200 shadow-sm"
      }`}>
        <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[16/10]"} bg-gray-100 overflow-hidden`}>
          {car.images[0] ? (
            <img src={car.images[0].url} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1V6a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16l-2-1m-2-5h3" />
              </svg>
            </div>
          )}
          {car.premium && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              PREMIUM
            </div>
          )}
          {car.createdAt && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {timeAgo(car.createdAt)}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-500 transition-colors line-clamp-1 flex-1">
              {car.title}
            </h3>
            <span className="text-base font-black text-blue-500 whitespace-nowrap">
              €{car.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {car.year}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {car.fuel}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {car.km.toLocaleString()} km
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — Compact with search, gets you to cars fast
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#070b14] pt-24 pb-14">
        {/* Ambient bg */}
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[100px]" />
        </div>

        {/* Mercedes image behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/images/mercedes-hero.png"
            alt=""
            aria-hidden="true"
            className="w-[900px] md:w-[1100px] lg:w-[1300px] max-w-none opacity-[0.12] object-contain translate-y-4"
            draggable={false}
          />
        </div>

        <div className="hero-content relative z-10 w-full max-w-6xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
              Makina për shitje <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">në Shqipëri</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Gjeni makinën perfekte nga mijëra njoftime të verifikuara
            </p>
          </div>

          {/* ── Search Bar ── */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/[0.06] backdrop-blur-2xl rounded-2xl border border-white/10 p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3">
                {/* Brand */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Marka</label>
                  <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.12] transition-colors">
                    <option value="" className="bg-[#111827]">Çdo markë</option>
                    {allBrands.map((b) => <option key={b} value={b} className="bg-[#111827]">{b}</option>)}
                  </select>
                </div>
                {/* Model */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Modeli</label>
                  <input type="text" placeholder="p.sh. A4, Golf..." value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none placeholder-gray-500 hover:bg-white/[0.12] transition-colors" />
                </div>
                {/* Year */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Viti</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.12] transition-colors">
                    <option value="" className="bg-[#111827]">Të gjitha</option>
                    {yearOptions.map((y) => <option key={y} value={y} className="bg-[#111827]">{y}</option>)}
                  </select>
                </div>
                {/* Km */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Kilometrazhi</label>
                  <select value={selectedKm} onChange={(e) => setSelectedKm(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.12] transition-colors">
                    <option value="" className="bg-[#111827]">Të gjitha</option>
                    {kmRanges.map((k) => <option key={k.value} value={k.value} className="bg-[#111827]">{k.label}</option>)}
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Çmimi</label>
                  <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.12] transition-colors">
                    <option value="" className="bg-[#111827]">Të gjitha</option>
                    {priceRanges.map((p) => <option key={p.value} value={p.value} className="bg-[#111827]">{p.label}</option>)}
                  </select>
                </div>
                {/* Fuel */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Karburanti</label>
                  <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}
                    className="w-full bg-white/[0.08] border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.12] transition-colors">
                    <option value="" className="bg-[#111827]">Çdo lloj</option>
                    {fuelTypes.map((f) => <option key={f} value={f} className="bg-[#111827]">{f}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 active:scale-[0.99]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Kërko Makina
              </button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota"].map((b) => (
                <Link key={b} href={`/search?brand=${b}`}
                  className="text-xs text-gray-400 hover:text-cyan-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full hover:border-cyan-500/30 transition-colors">
                  {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRUST BAR — Quick stats
      ═══════════════════════════════════════════════════════ */}
      <section className="py-4 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
          {[
            { icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: "Njoftime të verifikuara" },
            { icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, text: "8,400+ përdorues" },
            { icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, text: "2,500+ makina" },
            { icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, text: "Publiko në 2 minuta" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PREMIUM LISTINGS — Featured cars (highlighted row)
      ═══════════════════════════════════════════════════════ */}
      {!loadingPremium && premiumListings.length > 0 && (
        <section className="py-10 px-4 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                PREMIUM
              </div>
              <h2 className="text-lg font-bold text-gray-900">Njoftime të zgjedhura</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {premiumListings.map((car) => (
                <CarCard key={car.id} car={car} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          MAIN LISTINGS — Big grid of all cars
      ═══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Makina për <ShimmerText>shitje</ShimmerText>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {latestListings.length} njoftime të reja
              </p>
            </div>
            <Link href="/search" className="group inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0">
              Shiko të gjitha
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Type filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {carTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setActiveTypeFilter(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTypeFilter === type.value
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {loadingLatest ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Car grid — 4 columns on desktop, 3 on tablet, 2 on mobile */}
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5" staggerDelay={0.04}>
                {filteredListings.map((car) => (
                  <StaggerItem key={car.id}>
                    <CarCard car={car} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Load more / View all button */}
              <div className="text-center mt-10">
                <Link href="/search"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-10 py-3.5 rounded-xl text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02]">
                  Shiko Të Gjitha Makinat
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BRANDS — Compact strip
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Markat popullore</h2>
            <Link href="/brands" className="group inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors">
              Të gjitha markat
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 md:gap-5">
            {allBrandsList.map((brand) => (
              <BrandCard key={brand} brand={brand} size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BROWSE BY CITY — Regional quick links
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Kërko sipas qytetit</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {cityNames
              .map((name) => ({ name, count: cityCounts[name] || 0 }))
              .filter((city) => city.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((city) => (
              <Link
                key={city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{city.name}</span>
                <span className="text-[11px] text-gray-400 mt-0.5">{city.count} makina</span>
              </Link>
            ))}
            {Object.keys(cityCounts).length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-400 py-4">Nuk ka njoftime ende. Shto njoftimin e parë!</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SELL + DEALER — Compact dual CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
          {/* Sell */}
          <div className="bg-gradient-to-br from-[#070b14] to-[#0f172a] rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Shisni makinën tuaj</h3>
              <p className="text-gray-400 text-sm mb-5">Publikoni njoftimin falas dhe arrini mijëra blerës.</p>
              <Link href="/create-listing"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all">
                Krijo njoftim falas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {/* Dealer */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-50 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jeni tregëtar makinash?</h3>
              <p className="text-gray-500 text-sm mb-5">Regjistrohuni dhe shfaqni inventarin tuaj.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 border-2 border-blue-500 text-blue-500 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-500 hover:text-white transition-all">
                Na kontaktoni
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP
      ═══════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 bg-gradient-to-br from-[#070b14] to-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/[0.06] blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="text-xs text-gray-300 font-medium">Njoftohu për makina të reja</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Mos humbisni asnjë ofertë</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            Regjistrohuni për të marrë njoftime kur shtohen makina që përputhen me kërkimin tuaj.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email-i juaj..."
              className="flex-1 bg-white/[0.08] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none placeholder-gray-500 hover:bg-white/[0.12] transition-colors"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 whitespace-nowrap"
            >
              Regjistrohu
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4">Asnjë spam. Çabonohuni kur të dëshironi.</p>
        </div>
      </section>

      {/* Social links */}
      <SocialSection />
    </>
  );
}
