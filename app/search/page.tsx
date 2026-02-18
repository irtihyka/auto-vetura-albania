"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getModelsForBrand } from "@/lib/brand-models";

const carBrands = [
  "Të gjitha", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda",
  "Hyundai", "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel",
  "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo",
];
const fuelTypes = ["Të gjitha", "Benzinë", "Diesel", "Hibrid", "Elektrik", "Gaz/TNG", "Benzinë+Gaz", "Tjetër"];
const yearOptions = ["Të gjitha", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "Më e vjetër"];
const vehicleTypes = ["Të gjitha", "Makinë", "Motocikletë", "Kamion", "Furgon"];
const bodyTypeOptions = ["Të gjitha", "Sedan", "SUV", "Hatchback", "Coupe", "Karavan", "Furgon", "Kombi", "Van", "Kabriolet"];
const colorOptions = [
  "Të gjitha", "E bardhë", "E zezë", "Gri", "Argjendi", "Blu", "E kuqe",
  "Jeshile", "E verdhë", "Portokalli", "Kafe", "Bezhë", "E artë",
];

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  km: number;
  price: number;
  premium: boolean;
  images: { url: string }[];
  user?: { name: string; phone: string };
}

/* ── tiny active-filter count helper ── */
function useActiveFilterCount(brand: string, fuel: string, year: string, query: string, vehicleType: string, bodyType: string, color: string, model: string) {
  let c = 0;
  if (brand !== "Të gjitha") c++;
  if (model !== "Të gjitha") c++;
  if (fuel !== "Të gjitha") c++;
  if (year !== "Të gjitha") c++;
  if (vehicleType !== "Të gjitha") c++;
  if (bodyType !== "Të gjitha") c++;
  if (color !== "Të gjitha") c++;
  if (query.trim()) c++;
  return c;
}

function SearchPageContent() {
  const searchParams = useSearchParams();

  /* ── Initialize state directly from URL params to avoid race conditions ── */
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "Të gjitha");
  const [selectedModel, setSelectedModel] = useState(searchParams.get("model") || "Të gjitha");
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "Të gjitha");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("yearFrom") || searchParams.get("yearTo") || "Të gjitha");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [priceFrom, setPriceFrom] = useState(searchParams.get("priceFrom") || "");
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");
  const [selectedVehicleType, setSelectedVehicleType] = useState(searchParams.get("vehicleType") || "Të gjitha");
  const [selectedBodyType, setSelectedBodyType] = useState(searchParams.get("bodyType") || "Të gjitha");
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "Të gjitha");

  /* ── Sync state when URL params change (e.g. back/forward navigation) ── */
  useEffect(() => {
    setSelectedBrand(searchParams.get("brand") || "Të gjitha");
    setSelectedModel(searchParams.get("model") || "Të gjitha");
    setSelectedFuel(searchParams.get("fuel") || "Të gjitha");
    setSelectedYear(searchParams.get("yearFrom") || searchParams.get("yearTo") || "Të gjitha");
    setSearchQuery(searchParams.get("search") || "");
    setSortBy(searchParams.get("sort") || "newest");
    setPriceFrom(searchParams.get("priceFrom") || "");
    setPriceTo(searchParams.get("priceTo") || "");
    setSelectedVehicleType(searchParams.get("vehicleType") || "Të gjitha");
    setSelectedBodyType(searchParams.get("bodyType") || "Të gjitha");
    setSelectedColor(searchParams.get("color") || "Të gjitha");
  }, [searchParams]);

  const activeFilters = useActiveFilterCount(selectedBrand, selectedFuel, selectedYear, searchQuery, selectedVehicleType, selectedBodyType, selectedColor, selectedModel);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBrand !== "Të gjitha") params.set("brand", selectedBrand);
      if (selectedModel !== "Të gjitha") params.set("model", selectedModel);
      if (selectedFuel !== "Të gjitha") params.set("fuel", selectedFuel);
      if (selectedYear !== "Të gjitha" && selectedYear !== "Më e vjetër") {
        params.set("yearFrom", selectedYear);
        params.set("yearTo", selectedYear);
      }
      if (selectedYear === "Më e vjetër") params.set("yearTo", "2017");
      if (searchQuery) params.set("search", searchQuery);
      if (priceFrom) params.set("priceFrom", priceFrom);
      if (priceTo) params.set("priceTo", priceTo);
      if (selectedVehicleType !== "Të gjitha") params.set("vehicleType", selectedVehicleType);
      if (selectedBodyType !== "Të gjitha") params.set("bodyType", selectedBodyType);
      if (selectedColor !== "Të gjitha") params.set("color", selectedColor);
      const sortMap: Record<string, string> = {
        newest: "newest", "price-low": "price-asc",
        "price-high": "price-desc", "km-low": "km-asc",
      };
      params.set("sort", sortMap[sortBy] || "newest");
      params.set("limit", "100");
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setCars(data.listings || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedModel, selectedFuel, selectedYear, searchQuery, sortBy, priceFrom, priceTo, selectedVehicleType, selectedBodyType, selectedColor]);

  useEffect(() => {
    // Only debounce if there's a search query (user typing), otherwise fetch immediately
    if (searchQuery) {
      const t = setTimeout(fetchCars, 300);
      return () => clearTimeout(t);
    }
    fetchCars();
  }, [fetchCars]);

  function clearFilters() {
    setSelectedBrand("Të gjitha");
    setSelectedModel("Të gjitha");
    setSelectedFuel("Të gjitha");
    setSelectedYear("Të gjitha");
    setSearchQuery("");
    setSortBy("newest");
    setSelectedVehicleType("Të gjitha");
    setSelectedBodyType("Të gjitha");
    setSelectedColor("Të gjitha");
    setPriceFrom("");
    setPriceTo("");
  }

  /* ── filter chip data for the horizontal quick-filter bar ── */
  const chips: { label: string; active: boolean; clear: () => void }[] = [];
  if (selectedBrand !== "Të gjitha") chips.push({ label: selectedBrand, active: true, clear: () => setSelectedBrand("Të gjitha") });
  if (selectedModel !== "Të gjitha") chips.push({ label: `Model: ${selectedModel}`, active: true, clear: () => setSelectedModel("Të gjitha") });
  if (selectedFuel !== "Të gjitha") chips.push({ label: selectedFuel, active: true, clear: () => setSelectedFuel("Të gjitha") });
  if (selectedYear !== "Të gjitha") chips.push({ label: `Viti: ${selectedYear}`, active: true, clear: () => setSelectedYear("Të gjitha") });
  if (selectedVehicleType !== "Të gjitha") chips.push({ label: selectedVehicleType, active: true, clear: () => setSelectedVehicleType("Të gjitha") });
  if (selectedBodyType !== "Të gjitha") chips.push({ label: `Tipi: ${selectedBodyType}`, active: true, clear: () => setSelectedBodyType("Të gjitha") });
  if (selectedColor !== "Të gjitha") chips.push({ label: `Ngjyra: ${selectedColor}`, active: true, clear: () => setSelectedColor("Të gjitha") });

  return (
    <main className="bg-gray-50 w-full text-gray-900 flex-grow flex flex-col items-center min-h-screen">

      {/* ═══════════════════════════════════════════════════════════
          HERO SEARCH HEADER  –  dark, animated, immersive
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden bg-[#070b14] pt-28 pb-16">
        {/* Ambient bg */}
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-500/[0.05] blur-[100px]" />
        </div>

        {/* Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/images/logo.jpg"
            alt=""
            aria-hidden="true"
            className="w-[400px] md:w-[500px] lg:w-[600px] max-w-none opacity-[0.10] object-contain"
            draggable={false}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6"
            style={{ animation: "heroFadeUp 0.5s ease-out both" }}
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs text-gray-300 font-medium tracking-wide">Kërkim i avancuar</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
            style={{ animation: "heroFadeUp 0.6s ease-out 0.1s both" }}
          >
            Gjeni Makinën <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">Perfekte</span>
          </h1>

          <p
            className="text-gray-400 mb-10 text-lg max-w-xl mx-auto"
            style={{ animation: "heroFadeUp 0.5s ease-out 0.25s both" }}
          >
            Filtro, kërko dhe gjej makinën që i përshtatet stilit dhe buxhetit tuaj.
          </p>

          {/* ── glowing search bar ── */}
          <div
            className="relative max-w-2xl mx-auto"
            style={{ animation: "heroFadeUp 0.6s ease-out 0.35s both" }}
          >
            {/* outer glow ring */}
            <div className={`absolute -inset-1 rounded-2xl transition-opacity duration-500 bg-gradient-to-r from-amber-500/40 to-yellow-500/40 ${searchFocused ? "opacity-100" : "opacity-0"}`} style={{ filter: 'blur(8px)' }} />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Kërko sipas emrit, markës ose modelit..."
                className="w-full bg-[#1a1a2e]/80 text-white placeholder-gray-400 border border-white/15 rounded-2xl py-4 pl-14 pr-5 text-lg focus:outline-none focus:border-amber-400/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <svg
                className={`absolute left-5 w-5 h-5 transition-all duration-200 ${searchFocused ? "text-amber-400 scale-110" : "text-gray-400"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── quick brand pills ── */}
          <div
            className="flex flex-wrap justify-center gap-2 mt-6"
            style={{ animation: "heroFadeUp 0.4s ease-out 0.55s both" }}
          >
            {["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota"].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(selectedBrand === b ? "Të gjitha" : b)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedBrand === b
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FILTERS + RESULTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-8 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">

          {/* ── results bar (count + active chips + mobile filter toggle) ── */}
          <div
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {/* Mobile filter toggle */}
            <button
              className="lg:hidden inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              Filtrat
              {activeFilters > 0 && (
                <span className="ml-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <p className="text-gray-500 text-sm mr-1">
                <span className="font-bold text-gray-900">{total}</span> makina u gjetën
              </p>
              <AnimatePresence>
                {chips.map((chip) => (
                  <motion.button
                    key={chip.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                  >
                    {chip.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                ))}
              </AnimatePresence>
              {chips.length > 0 && (
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1 underline underline-offset-2">
                  Pastro të gjitha
                </button>
              )}
            </div>

            {/* sort on right */}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-gray-400 hidden sm:block">Rendit:</label>
              <select
                className="bg-white border border-gray-200 rounded-lg text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Më të rejat</option>
                <option value="price-low">Çmimi ↑</option>
                <option value="price-high">Çmimi ↓</option>
                <option value="km-low">Km ↑</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── FILTER SIDEBAR ── */}
              {(filtersOpen || typeof window !== "undefined") && (
                <div
                  className={`lg:w-80 xl:w-96 flex-shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}
                >
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 sticky top-24 space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                          </svg>
                        </div>
                        Filtrat
                      </h3>
                      {activeFilters > 0 && (
                        <span className="bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1 rounded-full">{activeFilters} aktive</span>
                      )}
                    </div>

                    {/* Brand */}
                    <FilterSelect label="Marka" value={selectedBrand} onChange={(v) => { setSelectedBrand(v); setSelectedModel("Të gjitha"); }} options={carBrands}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    {/* Model */}
                    <FilterSelect label="Modeli" value={selectedModel} onChange={setSelectedModel}
                      options={selectedBrand !== "Të gjitha" ? ["Të gjitha", ...getModelsForBrand(selectedBrand)] : ["Të gjitha"]}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                    />
                    {/* Vehicle Type */}
                    <FilterSelect label="Lloji i mjetit" value={selectedVehicleType} onChange={setSelectedVehicleType} options={vehicleTypes}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" /></svg>}
                    />
                    {/* Fuel */}
                    <FilterSelect label="Karburanti" value={selectedFuel} onChange={setSelectedFuel} options={fuelTypes}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    />
                    {/* Year */}
                    <FilterSelect label="Viti" value={selectedYear} onChange={setSelectedYear} options={yearOptions}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    />
                    {/* Body Type */}
                    <FilterSelect label="Tipi i trupit" value={selectedBodyType} onChange={setSelectedBodyType} options={bodyTypeOptions}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
                    />
                    {/* Color */}
                    <FilterSelect label="Ngjyra" value={selectedColor} onChange={setSelectedColor} options={colorOptions}
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
                    />

                    {/* Price Range */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Çmimi (€)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="Nga"
                          value={priceFrom}
                          onChange={(e) => setPriceFrom(e.target.value)}
                          className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-300 transition-all placeholder-gray-400"
                        />
                        <span className="text-gray-400 font-medium">—</span>
                        <input
                          type="number"
                          placeholder="Deri"
                          value={priceTo}
                          onChange={(e) => setPriceTo(e.target.value)}
                          className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-300 transition-all placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Reset */}
                    <button
                      onClick={clearFilters}
                      className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Pastro filtrat
                    </button>
                  </div>
                </div>
              )}

            {/* ── RESULTS GRID ── */}
            <div className="flex-grow">
              {/* mobile count */}
              <p className="lg:hidden text-gray-500 text-sm mb-4">
                <span className="font-bold text-gray-900">{total}</span> makina u gjetën
              </p>

              {loading ? (
                <div
                  className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
                >
                  <div
                    className="w-14 h-14 mx-auto mb-5 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"
                  />
                  <p className="text-gray-400 font-medium">Duke kërkuar makina...</p>
                </div>
              ) : cars.length === 0 ? (
                <div
                  className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
                >
                  <div
                    className="mb-6 inline-block"
                    style={{ animation: "gsapFloat 3s ease-in-out infinite", ["--float-y" as string]: "6px" }}
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Asnjë makinë nuk u gjet</h3>
                  <p className="text-gray-400 mb-6 max-w-sm mx-auto">Provoni të ndryshoni filtrat ose kërkimin për rezultate më të mira.</p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-shadow"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Pastro filtrat
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {cars.map((car, i) => (
                      <motion.div
                        key={car.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link
                          href={`/listing/${car.id}`}
                          className={`group block bg-white rounded-2xl overflow-hidden border ${car.premium ? 'border-amber-300 ring-2 ring-amber-200/50 shadow-amber-100 shadow-lg' : 'border-gray-100 hover:border-amber-200'} transition-[border-color,transform] duration-300 hover:-translate-y-1`}
                        >
                          {/* image */}
                          <div className="relative h-56 sm:h-64 bg-gray-100 overflow-hidden">
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0].url}
                                alt={car.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1V6a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16l-2-1m-2-5h3" />
                                </svg>
                              </div>
                            )}
                            {/* premium badge */}
                            {car.premium && (
                              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                PREMIUM
                              </div>
                            )}
                            {/* fuel badge */}
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200/60 flex items-center gap-1">
                              <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {car.fuel}
                            </span>
                            {/* price badge */}
                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg">
                              <span className="text-xl font-extrabold text-amber-500">€{car.price.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* content */}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-amber-500 transition-colors truncate">
                              {car.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-5">
                              <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 text-sm font-medium px-3 py-1.5 rounded-lg">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {car.year}
                              </span>
                              <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 text-sm font-medium px-3 py-1.5 rounded-lg">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {car.km.toLocaleString()} km
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-base font-semibold text-amber-500 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                                Shiko Detajet
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

/* ── reusable filter select component ── */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
        {icon && <span className="text-amber-500">{icon}</span>}
        {label}
      </label>
      <select
        className={`w-full py-3 px-4 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer appearance-none bg-[length:20px] bg-[right_12px_center] bg-no-repeat ${
          value !== "Të gjitha"
            ? "border-amber-300 bg-amber-50 text-amber-700 shadow-sm shadow-amber-100"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
        }`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
