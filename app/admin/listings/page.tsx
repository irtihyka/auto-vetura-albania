"use client";

import { useEffect, useState, useCallback } from "react";

interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  featured: boolean;
  premium: boolean;
  premiumUntil: string | null;
  views: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
  images: { url: string }[];
  _count: { favorites: number; reports: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (featuredFilter) params.set("featured", featuredFilter);
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/admin/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, featuredFilter, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  async function toggleFeatured(id: string, current: boolean) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    fetchListings();
  }

  async function togglePremium(id: string, current: boolean) {
    const premiumUntil = !current
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    await fetch(`/api/admin/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premium: !current, premiumUntil }),
    });
    fetchListings();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchListings();
  }

  async function deleteListing(id: string) {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë njoftim?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    fetchListings();
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Kërko njoftimet..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Të gjitha statuset</option>
            <option value="active">Aktiv</option>
            <option value="paused">Pauze</option>
            <option value="sold">Shitur</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
          >
            <option value="">Të gjitha</option>
            <option value="true">Të veçanta</option>
            <option value="false">Jo të veçanta</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Asnjë njoftim nuk u gjet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Njoftimi</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Pronari</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Çmimi</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Shikime</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Statusi</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Veçantë</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Premium</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Raporte</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          {listing.images[0] && (
                            <img
                              src={listing.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                          <p className="text-xs text-gray-500">{listing.brand} {listing.model} · {listing.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-900">{listing.user.name}</p>
                      <p className="text-xs text-gray-500">{listing.user.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-500">€{listing.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-600">{listing.views}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        className="text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none"
                        value={listing.status}
                        onChange={(e) => updateStatus(listing.id, e.target.value)}
                      >
                        <option value="active">Aktiv</option>
                        <option value="paused">Pauze</option>
                        <option value="sold">Shitur</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(listing.id, listing.featured)}
                        className={`text-lg ${listing.featured ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
                        title={listing.featured ? "Hiq nga të veçantat" : "Bëje të veçantë"}
                      >
                        ⭐
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePremium(listing.id, listing.premium)}
                        className={`text-xs font-bold px-2 py-1 rounded-full transition-colors ${
                          listing.premium
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={listing.premium ? "Çaktivizo Premium" : "Aktivizo Premium (30 ditë)"}
                      >
                        {listing.premium ? "★ PO" : "☆ JO"}
                      </button>
                      {listing.premiumUntil && listing.premium && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          deri {new Date(listing.premiumUntil).toLocaleDateString("sq-AL")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {listing._count.reports > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                          {listing._count.reports}
                        </span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Fshi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              {pagination.total} njoftimet gjithsej
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50"
              >
                ← Para
              </button>
              <span className="px-3 py-1 text-sm">{page} / {pagination.totalPages}</span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50"
              >
                Pas →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
