"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel: string;
  km: number;
  status: string;
  featured: boolean;
  premium: boolean;
  views: number;
  createdAt: string;
  images: { url: string }[];
  _count?: { favorites: number };
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const fetchMyListings = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login?redirect=/my-listings");
        return;
      }
      setUserName(meData.user.name);

      const res = await fetch(`/api/listings?userId=${meData.user.id}`, { credentials: "include" });
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      router.push("/login?redirect=/my-listings");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchMyListings();
    } else {
      const data = await res.json();
      alert(data.error || "Gabim");
    }
  }

  async function deleteListing(id: string) {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë njoftim? Ky veprim nuk mund të kthehet.")) return;
    const res = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      fetchMyListings();
    } else {
      const data = await res.json();
      alert(data.error || "Gabim");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("sq-AL", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Njoftimet e Mia</h1>
          <p className="text-gray-500 mt-1">Mirë se vini, {userName}</p>
        </div>
        <Link
          href="/create-listing"
          className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-center"
        >
          + Shto Njoftim të Ri
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nuk keni asnjë njoftim</h2>
          <p className="text-gray-500 mb-6">Shtoni njoftimin tuaj të parë për të shitur makinën tuaj.</p>
          <Link
            href="/create-listing"
            className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Shto Makinën Tënde
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
              <p className="text-sm text-gray-500">Gjithsej</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{listings.filter(l => l.status === "active").length}</p>
              <p className="text-sm text-gray-500">Aktive</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{listings.filter(l => l.status === "sold").length}</p>
              <p className="text-sm text-gray-500">Të Shitura</p>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{listings.reduce((a, l) => a + l.views, 0)}</p>
              <p className="text-sm text-gray-500">Shikime</p>
            </div>
          </div>

          {/* Listings */}
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <Link href={`/listing/${listing.id}`} className="sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-gray-200 relative">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {listing.status === "sold" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">SHITUR</span>
                    </div>
                  )}
                  {listing.status === "paused" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-gray-600 text-white text-sm font-bold px-4 py-1 rounded-full">PAUZE</span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/listing/${listing.id}`} className="hover:text-amber-500 transition-colors">
                        <h3 className="font-semibold text-lg text-gray-900">{listing.title}</h3>
                      </Link>
                      <span className="text-xl font-bold text-amber-500 whitespace-nowrap">€{listing.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.brand} {listing.model} · {listing.year} · {listing.fuel} · {listing.km.toLocaleString()} km
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>👁 {listing.views} shikime</span>
                      <span>📅 {formatDate(listing.createdAt)}</span>
                      {listing.premium && <span className="text-amber-600 font-semibold">★ Premium</span>}
                      {listing.featured && <span className="text-amber-500">⭐ E veçantë</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t">
                    {listing.status === "active" && (
                      <>
                        <button
                          onClick={() => updateStatus(listing.id, "sold")}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          ✓ Shëno si të Shitur
                        </button>
                        <button
                          onClick={() => updateStatus(listing.id, "paused")}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          ⏸ Pauzo
                        </button>
                      </>
                    )}
                    {listing.status === "paused" && (
                      <button
                        onClick={() => updateStatus(listing.id, "active")}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        ▶ Aktivizo
                      </button>
                    )}
                    {listing.status === "sold" && (
                      <button
                        onClick={() => updateStatus(listing.id, "active")}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        ↩️ Kthe si Aktiv
                      </button>
                    )}
                    <Link
                      href={`/listing/${listing.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      👁 Shiko
                    </Link>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="px-4 py-2 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors font-medium ml-auto"
                    >
                      🗑 Fshi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
