"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalMessages: number;
  unreadMessages: number;
  featuredListings: number;
  premiumListings: number;
  totalReviews: number;
  totalReports: number;
  pendingReports: number;
  totalFavorites: number;
  totalViews: number;
  totalClicks: number;
  conversionRate: number;
  newUsersThisWeek: number;
  newListingsThisWeek: number;
  reportsThisWeek: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { listings: number };
}

interface RecentListing {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  premium: boolean;
  featured: boolean;
  createdAt: string;
  user: { name: string };
  _count: { reports: number };
}

interface DailyData {
  date: string;
  views: number;
  clicks: number;
}

interface BrandStat {
  brand: string;
  count: number;
}

interface FuelStat {
  fuel: string;
  count: number;
}

interface PriceRange {
  label: string;
  count: number;
}

interface PendingReport {
  id: string;
  reason: string;
  details: string | null;
  createdAt: string;
  status: string;
  user: { name: string };
  listing: { id: string; title: string };
}

interface Alerts {
  pendingReports: number;
  unreadMessages: number;
  newUsersThisWeek: number;
  newListingsThisWeek: number;
  reportsThisWeek: number;
}

interface DashboardData {
  stats: Stats;
  recentUsers: RecentUser[];
  recentListings: RecentListing[];
  dailyChartData: DailyData[];
  popularBrands: BrandStat[];
  fuelDistribution: FuelStat[];
  priceRanges: PriceRange[];
  pendingReportsList: PendingReport[];
  alerts: Alerts;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "alerts">("overview");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || !data.stats) return <p className="text-red-500">Gabim në ngarkimin e statistikave.</p>;

  const { stats, recentUsers, recentListings, dailyChartData, popularBrands, fuelDistribution, priceRanges, pendingReportsList, alerts } = data;

  const maxDailyViews = Math.max(...(dailyChartData.map((d) => d.views) || [1]), 1);
  const maxBrandCount = Math.max(...(popularBrands.map((b) => b.count) || [1]), 1);
  const maxFuelCount = Math.max(...(fuelDistribution.map((f) => f.count) || [1]), 1);
  const maxPriceCount = Math.max(...(priceRanges.map((p) => p.count) || [1]), 1);

  const totalAlerts = alerts.pendingReports + alerts.unreadMessages;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border p-1">
        {[
          { key: "overview" as const, label: "Përmbledhje", icon: "📊" },
          { key: "analytics" as const, label: "Analitika", icon: "📈" },
          { key: "alerts" as const, label: `Njoftimet${totalAlerts > 0 ? ` (${totalAlerts})` : ""}`, icon: "🔔" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
      {activeTab === "overview" && (
        <>
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Përdorues", value: stats.totalUsers, sub: `+${stats.newUsersThisWeek} këtë javë`, color: "text-blue-600", bg: "bg-blue-50", icon: "👥", link: "/admin/users" },
              { label: "Njoftime Aktive", value: stats.activeListings, sub: `${stats.totalListings} gjithsej`, color: "text-green-600", bg: "bg-green-50", icon: "🚗", link: "/admin/listings" },
              { label: "Të Shitura", value: stats.soldListings, sub: `${stats.totalListings > 0 ? Math.round((stats.soldListings / stats.totalListings) * 100) : 0}% e totalit`, color: "text-purple-600", bg: "bg-purple-50", icon: "✅", link: "/admin/listings" },
              { label: "Premium", value: stats.premiumListings, sub: `${stats.featuredListings} featured`, color: "text-amber-600", bg: "bg-amber-50", icon: "⭐", link: "/admin/listings" },
              { label: "Shikime Totale", value: stats.totalViews.toLocaleString(), sub: `${stats.totalClicks.toLocaleString()} klikime`, color: "text-indigo-600", bg: "bg-indigo-50", icon: "👁" },
              { label: "Konvertimi", value: `${stats.conversionRate}%`, sub: "klikime / shikime", color: "text-teal-600", bg: "bg-teal-50", icon: "📊" },
              { label: "Mesazhe", value: stats.totalMessages, sub: `${stats.unreadMessages} të palexuara`, color: "text-red-600", bg: "bg-red-50", icon: "✉️", link: "/admin/messages" },
              { label: "Raporte", value: stats.totalReports, sub: `${stats.pendingReports} në pritje`, color: "text-blue-600", bg: "bg-blue-50", icon: "⚠️", link: "/admin/reports" },
            ].map((card) => {
              const content = (
                <div className={`${card.bg} rounded-xl p-4 border border-transparent hover:border-gray-200 transition-colors h-full`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{card.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
              );
              return card.link ? (
                <Link key={card.label} href={card.link}>{content}</Link>
              ) : (
                <div key={card.label}>{content}</div>
              );
            })}
          </div>

          {/* Quick Alert Banners */}
          {(alerts.pendingReports > 0 || alerts.unreadMessages > 0) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {alerts.pendingReports > 0 && (
                <Link href="/admin/reports" className="flex-1 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 hover:bg-red-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                    {alerts.pendingReports}
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Raporte në pritje</p>
                    <p className="text-xs text-red-600">{alerts.reportsThisWeek} raporte këtë javë</p>
                  </div>
                </Link>
              )}
              {alerts.unreadMessages > 0 && (
                <Link href="/admin/messages" className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    {alerts.unreadMessages}
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Mesazhe të palexuara</p>
                    <p className="text-xs text-blue-600">Duhet t&apos;i shikoni sa më parë</p>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Views Chart (30 days) */}
          {dailyChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Vizitorë (30 ditë)</h2>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Shikime</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Klikime</span>
                </div>
              </div>
              <div className="flex items-end gap-[2px] h-36">
                {dailyChartData.slice(-30).map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center group relative gap-[1px]">
                    <div
                      className="w-full bg-blue-400 rounded-t-sm min-h-[1px] transition-all hover:bg-blue-500"
                      style={{ height: `${(day.views / maxDailyViews) * 70}%` }}
                    />
                    <div
                      className="w-full bg-blue-400 rounded-t-sm min-h-[1px]"
                      style={{ height: `${maxDailyViews > 0 ? (day.clicks / maxDailyViews) * 70 : 0}%` }}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.date.slice(5)}: {day.views} shikime, {day.clicks} klikime
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{dailyChartData[0]?.date.slice(5)}</span>
                <span>{dailyChartData[dailyChartData.length - 1]?.date.slice(5)}</span>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Listings */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Njoftimet e Fundit</h2>
                <Link href="/admin/listings" className="text-sm text-blue-500 hover:text-blue-600">
                  Shiko të gjitha →
                </Link>
              </div>
              <div className="divide-y">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="p-4 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                        {listing.premium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold flex-shrink-0">PREMIUM</span>}
                        {listing._count.reports > 0 && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold flex-shrink-0">⚠ {listing._count.reports}</span>}
                      </div>
                      <p className="text-sm text-gray-500">{listing.user.name} · {listing.views} shikime</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-blue-500">€{listing.price.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        listing.status === "active" ? "bg-green-100 text-green-700" :
                        listing.status === "sold" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {listing.status === "active" ? "Aktiv" : listing.status === "sold" ? "Shitur" : listing.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentListings.length === 0 && <p className="p-4 text-sm text-gray-500">Asnjë njoftim.</p>}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Përdoruesit e Fundit</h2>
                <Link href="/admin/users" className="text-sm text-blue-500 hover:text-blue-600">
                  Shiko të gjithë →
                </Link>
              </div>
              <div className="divide-y">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.role === "admin" ? "Admin" : "Përdorues"}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{user._count.listings} njoftime</p>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && <p className="p-4 text-sm text-gray-500">Asnjë përdorues.</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
      {activeTab === "analytics" && (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Shikime Totale</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Klikime Totale</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Norma e Konvertimit</p>
              <p className="text-2xl font-bold text-teal-600">{stats.conversionRate}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Të Preferuara</p>
              <p className="text-2xl font-bold text-red-500">{stats.totalFavorites}</p>
            </div>
          </div>

          {/* Popular Brands Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-bold text-gray-900 mb-4">Markat Populare</h2>
            <div className="space-y-3">
              {popularBrands.map((b) => (
                <div key={b.brand} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-medium text-gray-700 text-right flex-shrink-0 truncate">{b.brand}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-end px-2 transition-all"
                      style={{ width: `${Math.max((b.count / maxBrandCount) * 100, 8)}%` }}
                    >
                      <span className="text-[10px] font-bold text-white">{b.count}</span>
                    </div>
                  </div>
                </div>
              ))}
              {popularBrands.length === 0 && <p className="text-sm text-gray-400">Asnjë e dhënë.</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fuel Distribution */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-bold text-gray-900 mb-4">Shpërndarja e Karburantit</h2>
              <div className="space-y-3">
                {fuelDistribution.map((f) => {
                  const colors: Record<string, string> = {
                    "Benzinë": "from-green-400 to-green-500",
                    "Diesel": "from-gray-500 to-gray-600",
                    "Hibrid": "from-blue-400 to-blue-500",
                    "Elektrik": "from-cyan-400 to-cyan-500",
                    "Gas": "from-amber-400 to-amber-500",
                  };
                  return (
                    <div key={f.fuel} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium text-gray-700 text-right flex-shrink-0">{f.fuel}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[f.fuel] || "from-gray-400 to-gray-500"} rounded-full flex items-center justify-end px-2`}
                          style={{ width: `${Math.max((f.count / maxFuelCount) * 100, 10)}%` }}
                        >
                          <span className="text-[10px] font-bold text-white">{f.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Range Distribution */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-bold text-gray-900 mb-4">Gama e Çmimeve (Aktive)</h2>
              <div className="space-y-3">
                {priceRanges.map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="w-28 text-xs font-medium text-gray-700 text-right flex-shrink-0">{r.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-end px-2"
                        style={{ width: `${maxPriceCount > 0 ? Math.max((r.count / maxPriceCount) * 100, 8) : 0}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">{r.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity This Week */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-bold text-gray-900 mb-4">Aktiviteti Javor</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">{stats.newUsersThisWeek}</p>
                <p className="text-xs text-gray-600 mt-1">Përdorues të Rinj</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{stats.newListingsThisWeek}</p>
                <p className="text-xs text-gray-600 mt-1">Njoftime të Reja</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-red-600">{stats.reportsThisWeek}</p>
                <p className="text-xs text-gray-600 mt-1">Raporte të Reja</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ ALERTS TAB ═══════════════ */}
      {activeTab === "alerts" && (
        <>
          {/* Alert Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`rounded-xl border p-4 ${alerts.pendingReports > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{alerts.pendingReports > 0 ? "🔴" : "✅"}</span>
                <span className="text-sm font-semibold text-gray-800">Raporte</span>
              </div>
              <p className={`text-xl font-bold ${alerts.pendingReports > 0 ? "text-red-600" : "text-green-600"}`}>
                {alerts.pendingReports > 0 ? `${alerts.pendingReports} në pritje` : "Asnjë"}
              </p>
            </div>
            <div className={`rounded-xl border p-4 ${alerts.unreadMessages > 0 ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{alerts.unreadMessages > 0 ? "🔵" : "✅"}</span>
                <span className="text-sm font-semibold text-gray-800">Mesazhe</span>
              </div>
              <p className={`text-xl font-bold ${alerts.unreadMessages > 0 ? "text-blue-600" : "text-green-600"}`}>
                {alerts.unreadMessages > 0 ? `${alerts.unreadMessages} të palexuara` : "Asnjë"}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">👤</span>
                <span className="text-sm font-semibold text-gray-800">Regjistrime</span>
              </div>
              <p className="text-xl font-bold text-indigo-600">+{alerts.newUsersThisWeek} këtë javë</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🚗</span>
                <span className="text-sm font-semibold text-gray-800">Njoftime</span>
              </div>
              <p className="text-xl font-bold text-emerald-600">+{alerts.newListingsThisWeek} këtë javë</p>
            </div>
          </div>

          {/* Pending Reports List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                Raporte në Pritje
              </h2>
              <Link href="/admin/reports" className="text-sm text-blue-500 hover:text-blue-600">
                Shiko të gjitha →
              </Link>
            </div>
            {pendingReportsList.length === 0 ? (
              <div className="p-8 text-center">
                <span className="text-4xl mb-2 block">✅</span>
                <p className="text-gray-500">Nuk ka raporte në pritje. Gjithçka duket mirë!</p>
              </div>
            ) : (
              <div className="divide-y">
                {pendingReportsList.map((report) => {
                  const reasonLabels: Record<string, string> = {
                    spam: "Spam",
                    fraud: "Mashtrim / Fake",
                    duplicate: "I dyfishuar",
                    inappropriate: "Papërshtatshëm",
                    other: "Tjetër",
                  };
                  return (
                    <div key={report.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              report.reason === "fraud" ? "bg-red-100 text-red-700" :
                              report.reason === "spam" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {reasonLabels[report.reason] || report.reason}
                            </span>
                            <span className="text-xs text-gray-400">
                              nga {report.user.name} · {new Date(report.createdAt).toLocaleDateString("sq-AL")}
                            </span>
                          </div>
                          <Link href={`/listing/${report.listing.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-500">
                            {report.listing.title}
                          </Link>
                          {report.details && (
                            <p className="text-xs text-gray-500 mt-1">{report.details}</p>
                          )}
                        </div>
                        <Link
                          href="/admin/reports"
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-200 flex-shrink-0"
                        >
                          Shqyrto
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🖥️</span>
              Statusi i Sistemit
            </h2>
            <div className="space-y-3">
              {[
                { label: "Serveri", status: "online", detail: "Ngarkesa normale" },
                { label: "Databaza", status: "online", detail: "SQLite — funksional" },
                { label: "Ruajtja e Imazheve", status: "online", detail: "Lokale — funksional" },
                { label: "Autentifikimi", status: "online", detail: "JWT — funksional" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      item.status === "online" ? "bg-green-500" : item.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              Performanca
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Përdorues Regjistruar</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                <p className="text-xs text-gray-500">Njoftime Gjithsej</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                <p className="text-xs text-gray-500">Vlerësime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
                <p className="text-xs text-gray-500">Favorit</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
