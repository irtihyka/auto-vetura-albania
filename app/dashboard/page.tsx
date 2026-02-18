"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AnalyticsData {
  stats: {
    totalListings: number;
    activeListings: number;
    soldListings: number;
    totalViews: number;
    totalClicks: number;
    totalFavorites: number;
    totalReviews: number;
    avgRating: number;
  };
  listings: {
    id: string;
    title: string;
    brand: string;
    model: string;
    price: number;
    views: number;
    clicks: number;
    status: string;
    featured: boolean;
    premium: boolean;
    createdAt: string;
    images: { url: string }[];
    _count: { favorites: number; reviews: number };
    analytics: { date: string; views: number; clicks: number }[];
  }[];
  dailyAnalytics: { date: string; views: number; clicks: number }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminContact, setAdminContact] = useState<{ contactPhone: string; whatsapp: string; contactEmail: string } | null>(null);
  const [premiumExpandId, setPremiumExpandId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((d) => setAdminContact(d))
      .catch(() => {});
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/analytics", { credentials: "include" });
      if (res.status === 401) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      router.push("/login?redirect=/dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, listings, dailyAnalytics } = data;

  // Simple sparkline as a bar chart
  const maxDailyViews = Math.max(...dailyAnalytics.map((d) => d.views), 1);

  return (
    <main className="max-w-7xl mx-auto px-4 pt-28 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paneli i Analitikës</h1>
          <p className="text-gray-500 mt-1">Shikoni statistikat e njoftimeve tuaja</p>
        </div>
        <Link
          href="/my-listings"
          className="text-amber-500 font-semibold hover:text-amber-600 transition-colors"
        >
          ← Njoftimet e Mia
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Gjithsej Njoftimet", value: stats.totalListings, icon: "📋", color: "text-gray-900" },
          { label: "Aktive", value: stats.activeListings, icon: "✅", color: "text-green-600" },
          { label: "Të Shitura", value: stats.soldListings, icon: "🎉", color: "text-purple-600" },
          { label: "Shikime Totale", value: stats.totalViews.toLocaleString(), icon: "👁", color: "text-amber-600" },
          { label: "Klikime Totale", value: stats.totalClicks.toLocaleString(), icon: "🖱️", color: "text-indigo-600" },
          { label: "Të Preferuara", value: stats.totalFavorites, icon: "❤️", color: "text-red-500" },
          { label: "Vlerësime", value: stats.totalReviews, icon: "⭐", color: "text-amber-500" },
          { label: "Vlerësimi Mesatar", value: stats.avgRating > 0 ? `${stats.avgRating}/5` : "—", icon: "📊", color: "text-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Views Chart (last 30 days) */}
      {dailyAnalytics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shikime (30 ditët e fundit)</h2>
          <div className="flex items-end gap-1 h-32">
            {dailyAnalytics.slice(-30).map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-yellow-300 rounded-t-sm min-h-[2px] transition-all hover:from-amber-600 hover:to-yellow-400"
                  style={{ height: `${(day.views / maxDailyViews) * 100}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {day.date.slice(5)}: {day.views} shikime, {day.clicks} klikime
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>{dailyAnalytics[0]?.date.slice(5)}</span>
            <span>{dailyAnalytics[dailyAnalytics.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}

      {/* Per-listing breakdown */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Detaje për njoftim</h2>
      <div className="space-y-4">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <Link href={`/listing/${listing.id}`} className="sm:w-32 h-28 sm:h-auto flex-shrink-0 bg-gray-200 relative">
                {listing.images[0] ? (
                  <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
                {listing.premium && (
                  <div className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    PREMIUM
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <Link href={`/listing/${listing.id}`} className="font-semibold text-gray-900 hover:text-amber-500 transition-colors">
                      {listing.title}
                    </Link>
                    <p className="text-sm text-gray-500">€{listing.price.toLocaleString()} · {listing.brand} {listing.model}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    listing.status === "active" ? "bg-green-100 text-green-700" :
                    listing.status === "sold" ? "bg-purple-100 text-purple-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {listing.status === "active" ? "Aktiv" : listing.status === "sold" ? "Shitur" : "Pauzë"}
                  </span>
                </div>

                {/* Metrics row */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{listing.views.toLocaleString()}</span> shikime
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{listing.clicks.toLocaleString()}</span> klikime
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{listing._count.favorites}</span> ❤️
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{listing._count.reviews}</span> vlerësime
                  </span>
                  {listing.views > 0 && (
                    <span className="text-gray-600">
                      CTR: <span className="font-semibold text-gray-900">
                        {((listing.clicks / listing.views) * 100).toFixed(1)}%
                      </span>
                    </span>
                  )}
                </div>

                {/* Premium CTA */}
                {!listing.premium && listing.status === "active" && (
                  <div className="mt-3 pt-3 border-t">
                    {premiumExpandId !== listing.id ? (
                      <button
                        onClick={() => setPremiumExpandId(listing.id)}
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Promovo në Premium
                      </button>
                    ) : (
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Kalo në Premium
                          </h4>
                          <button onClick={() => setPremiumExpandId(null)} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "7 ditë", price: "€5" },
                            { label: "14 ditë", price: "€8" },
                            { label: "30 ditë", price: "€12" },
                          ].map((opt) => (
                            <div key={opt.label} className="bg-white rounded-lg border border-amber-200 p-2 text-center">
                              <p className="text-xs font-bold text-amber-700">{opt.label}</p>
                              <p className="text-sm font-bold text-gray-900">{opt.price}</p>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-amber-700 mb-3">
                          Kontaktoni administratorin për të aktivizuar Premium:
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {adminContact?.contactPhone && (
                            <a
                              href={`tel:${adminContact.contactPhone}`}
                              className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {adminContact.contactPhone}
                            </a>
                          )}
                          {adminContact?.whatsapp && (
                            <a
                              href={`https://wa.me/${adminContact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Përshëndetje! Dua të aktivizoj Premium për njoftimin: ${listing.title} (ID: ${listing.id})`)}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.153-2.734.813.813-2.734-.153-.252A8 8 0 1112 20z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                        </div>

                        {!adminContact?.contactPhone && !adminContact?.whatsapp && (
                          <p className="text-xs text-gray-500 italic">Numri i kontaktit nuk është vendosur ende nga administratori.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {listing.premium && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Premium aktiv
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nuk keni njoftime</h2>
          <p className="text-gray-500 mb-6">Shtoni njoftimin tuaj të parë për të parë statistikat.</p>
          <Link
            href="/create-listing"
            className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            + Shto Njoftim
          </Link>
        </div>
      )}
    </main>
  );
}
