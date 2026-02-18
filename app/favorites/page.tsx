"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FavoriteCar {
  id: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    fuel: string;
    km: number;
    price: number;
    status: string;
    premium: boolean;
    images: { url: string }[];
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/favorites", { credentials: "include" });
      if (res.status === 401) {
        router.push("/login?redirect=/favorites");
        return;
      }
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch {
      router.push("/login?redirect=/favorites");
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(listingId: string) {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ listingId }),
    });
    setFavorites((prev) => prev.filter((f) => f.listing.id !== listingId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Makinat e Preferuara</h1>
        <p className="text-gray-500 mt-1">
          {favorites.length} {favorites.length === 1 ? "makinë e ruajtur" : "makina të ruajtura"}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nuk keni makina të preferuara</h2>
          <p className="text-gray-500 mb-6">Shtypni ikonën e zemrës në çdo makinë për ta ruajtur këtu.</p>
          <Link
            href="/search"
            className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Kërko Makina
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFavorite(fav.listing.id)}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/fav"
                title="Hiq nga të preferuarat"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              {/* Premium badge */}
              {fav.listing.premium && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  PREMIUM
                </div>
              )}

              {/* Sold overlay */}
              {fav.listing.status === "sold" && (
                <div className="absolute inset-0 bg-black/40 z-[5] flex items-center justify-center rounded-2xl">
                  <span className="bg-purple-600 text-white text-sm font-bold px-6 py-2 rounded-full">E SHITUR</span>
                </div>
              )}

              <Link href={`/listing/${fav.listing.id}`}>
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {fav.listing.images[0] ? (
                    <img
                      src={fav.listing.images[0].url}
                      alt={fav.listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg">
                    <span className="text-lg font-bold text-amber-500">€{fav.listing.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
              <div className="p-5">
                <Link href={`/listing/${fav.listing.id}`}>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-3 group-hover:text-amber-500 transition-colors truncate">
                    {fav.listing.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {fav.listing.year}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {fav.listing.fuel}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {fav.listing.km.toLocaleString()} km
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Ruajtur më {new Date(fav.createdAt).toLocaleDateString("sq-AL")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
