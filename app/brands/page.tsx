"use client";

import Link from "next/link";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
  ShimmerText,
} from "@/components/animations";
import { allBrandsList, BrandCard } from "@/components/BrandLogos";

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <section className="bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] pt-28 pb-20 px-4 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Të gjitha markat
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Eksploro sipas <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Markës</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Zgjidhni markën e preferuar dhe zbuloni të gjitha makinat në dispozicion. Nga Audi tek Volvo, kemi gjithçka.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Brands Grid ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{allBrandsList.length} Marka</h2>
                <p className="text-sm text-gray-500 mt-1">Kliko mbi një markë për të parë makinat</p>
              </div>
              <Link
                href="/search"
                className="text-sm font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                Shiko të gjitha makinat
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10" staggerDelay={0.05}>
            {allBrandsList.map((brand) => (
              <StaggerItem key={brand}>
                <div className="flex justify-center">
                  <BrandCard brand={brand} size="lg" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 text-center shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Nuk gjeni markën që kërkoni?
              </h3>
              <p className="text-gray-500 mb-6">
                Përdorni kërkimin e avancuar për të gjetur çdo markë dhe model makine.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                Kërkim i Avancuar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
