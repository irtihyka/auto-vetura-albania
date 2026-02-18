"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  km: number;
  price: number;
  color: string | null;
  bodyType: string | null;
  location: string | null;
  phone: string | null;
  views: number;
  premium: boolean;
  premiumUntil: string | null;
  createdAt: string;
  images: { id: string; url: string }[];
  user: { id: string; name: string; phone: string | null; email: string; createdAt: string };
  reviews: Review[];
  _count: { favorites: number; reviews: number };
}

export default function ListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Favorite / Report / Review state
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [sellerRating, setSellerRating] = useState({ average: 0, total: 0 });

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchListing = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setListing(data.listing);
        setIsFavorited(data.isFavorited || false);
        setIsReported(data.isReported || false);
        setUserReview(data.userReview || null);
        setSellerRating(data.sellerRating || { average: 0, total: 0 });
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchListing();
    // Track click for analytics
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: params.id }),
    }).catch(() => {});
  }, [fetchListing, params.id]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen || !listing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setSelectedImage((p) => (p + 1) % listing.images.length);
      if (e.key === "ArrowLeft") setSelectedImage((p) => (p - 1 + listing.images.length) % listing.images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, listing]);

  async function toggleFavorite() {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ listingId: listing?.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsFavorited(data.favorited);
    }
  }

  async function submitReport() {
    setReportSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId: listing?.id, reason: reportReason, details: reportDetails }),
      });
      if (res.ok) {
        setIsReported(true);
        setReportOpen(false);
        setReportDetails("");
      } else {
        const data = await res.json();
        alert(data.error || "Gabim");
      }
    } finally {
      setReportSubmitting(false);
    }
  }

  async function submitReview() {
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId: listing?.id, rating: reviewRating, comment: reviewComment }),
      });
      if (res.ok) {
        setReviewComment("");
        fetchListing(); // refresh reviews
      } else {
        const data = await res.json();
        alert(data.error || "Gabim");
      }
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Njoftimi nuk u gjet</h1>
        <Link href="/search" className="text-blue-500 hover:underline">
          ← Kthehu te kërkimi
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* ═══ FULLSCREEN LIGHTBOX ═══ */}
      {lightboxOpen && listing && listing.images.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
            {selectedImage + 1} / {listing.images.length}
          </div>

          {/* Prev */}
          {listing.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + listing.images.length) % listing.images.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 bg-white/10 rounded-full backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <img
            src={listing.images[selectedImage]?.url}
            alt={listing.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {listing.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % listing.images.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 bg-white/10 rounded-full backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Thumbnails strip */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
              {listing.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                  className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === i ? "border-blue-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ REPORT MODAL ═══ */}
      {reportOpen && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={() => setReportOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Raporto Njoftimin
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Arsyeja</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="spam">Spam</option>
                  <option value="fraud">Mashtrues / Fake</option>
                  <option value="duplicate">Njoftim i dyfishuar</option>
                  <option value="inappropriate">Përmbajtje e papërshtatshme</option>
                  <option value="other">Tjetër</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detaje (opsionale)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Shkruani detaje shtesë..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setReportOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Anulo
                </button>
                <button
                  onClick={submitReport}
                  disabled={reportSubmitting}
                  className="px-6 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {reportSubmitting ? "Duke dërguar..." : "Dërgo Raportin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-28 pb-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-500">Ballina</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-blue-500">Kërko</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ IMAGES with lightbox trigger ═══ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">
              {/* Premium badge */}
              {listing.premium && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  PREMIUM
                </div>
              )}

              <button
                onClick={() => listing.images.length > 0 && setLightboxOpen(true)}
                className="w-full h-80 md:h-[500px] bg-gray-200 flex items-center justify-center cursor-zoom-in relative group"
              >
                {listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[selectedImage]?.url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9m-6-6h15m-6 0V6" />
                  </svg>
                )}
              </button>
              {listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === i ? "border-blue-500" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Detajet</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Marka</span>
                  <span className="font-semibold">{listing.brand}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Modeli</span>
                  <span className="font-semibold">{listing.model}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Viti</span>
                  <span className="font-semibold">{listing.year}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Karburanti</span>
                  <span className="font-semibold">{listing.fuel}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Transmisioni</span>
                  <span className="font-semibold">{listing.transmission}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-500 block">Kilometra</span>
                  <span className="font-semibold">{listing.km.toLocaleString()} km</span>
                </div>
                {listing.color && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500 block">Ngjyra</span>
                    <span className="font-semibold">{listing.color}</span>
                  </div>
                )}
                {listing.bodyType && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500 block">Tipi</span>
                    <span className="font-semibold">{listing.bodyType}</span>
                  </div>
                )}
                {listing.location && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500 block">Vendndodhja</span>
                    <span className="font-semibold">{listing.location}</span>
                  </div>
                )}
              </div>

              {listing.description && (
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-2">Përshkrimi</h3>
                  <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
                </div>
              )}
            </div>

            {/* ═══ REVIEWS SECTION ═══ */}
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Vlerësimet ({listing._count.reviews})
                </h2>
                {listing.reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => {
                      const avg = listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length;
                      return (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= Math.round(avg) ? "text-amber-400" : "text-gray-200"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      );
                    })}
                    <span className="text-sm font-semibold text-gray-600 ml-1">
                      {(listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Write review form */}
              {!userReview && (
                <div className="border border-gray-100 rounded-xl p-4 mb-6 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Lini një vlerësim</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-7 h-7 transition-colors ${star <= reviewRating ? "text-amber-400" : "text-gray-300 hover:text-amber-200"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                    placeholder="Shkruani koment (opsionale)..."
                  />
                  <button
                    onClick={submitReview}
                    disabled={reviewSubmitting}
                    className="bg-blue-500 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {reviewSubmitting ? "Duke dërguar..." : "Dërgo Vlerësimin"}
                  </button>
                </div>
              )}

              {/* Reviews list */}
              {listing.reviews.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Asnjë vlerësim ende. Jini i pari!</p>
              ) : (
                <div className="space-y-4">
                  {listing.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-400" : "text-gray-200"}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(review.createdAt).toLocaleDateString("sq-AL")}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 ml-11">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              {/* Premium badge in sidebar */}
              {listing.premium && (
                <div className="bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
                  <span className="text-xs font-semibold text-amber-700 flex items-center justify-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Njoftim Premium
                  </span>
                </div>
              )}

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="text-3xl font-bold text-blue-500 mb-6">
                €{listing.price.toLocaleString()}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{listing.year}</span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{listing.fuel}</span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{listing.km.toLocaleString()} km</span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{listing.transmission}</span>
              </div>

              {/* Favorite + Report buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                    isFavorited
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                  }`}
                >
                  <svg className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorited ? "E preferuar" : "Ruaj"}
                </button>
                <button
                  onClick={() => !isReported && setReportOpen(true)}
                  disabled={isReported}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors border ${
                    isReported
                      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-default"
                      : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                  </svg>
                  {isReported ? "Raportuar" : "Raporto"}
                </button>
              </div>

              {/* Seller info */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-bold text-lg mb-3">Shitësi</h3>
                <p className="text-gray-700 font-semibold">{listing.user.name}</p>
                <p className="text-sm text-gray-500">
                  Anëtar që nga {new Date(listing.user.createdAt).toLocaleDateString("sq-AL")}
                </p>
                {sellerRating.total > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(sellerRating.average) ? "text-amber-400" : "text-gray-200"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {sellerRating.average} ({sellerRating.total} vlerësime)
                    </span>
                  </div>
                )}
              </div>

              {/* Contact buttons */}
              {(listing.phone || listing.user.phone) && (
                <a
                  href={`tel:${listing.phone || listing.user.phone}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Telefono: {listing.phone || listing.user.phone}
                </a>
              )}

              <a
                href={`mailto:${listing.user.email}`}
                className="w-full bg-custom-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 mb-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Dërgo Email
              </a>

              <div className="text-center text-sm text-gray-400 mt-4 space-y-1">
                <p>{listing.views} shikime · {listing._count.favorites} ❤️</p>
                <p>Publikuar {new Date(listing.createdAt).toLocaleDateString("sq-AL")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
