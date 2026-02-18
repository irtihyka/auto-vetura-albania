"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface ReportListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  status: string;
  premium: boolean;
  images: { url: string }[];
  user: { id: string; name: string; email: string };
}

interface Report {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  listing: ReportListing;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const reasonLabels: Record<string, { label: string; color: string }> = {
  spam: { label: "Spam", color: "bg-yellow-100 text-yellow-700" },
  fraud: { label: "Mashtrim / Fake", color: "bg-red-100 text-red-700" },
  duplicate: { label: "I Dyfishuar", color: "bg-amber-100 text-amber-700" },
  inappropriate: { label: "Papërshtatshëm", color: "bg-purple-100 text-purple-700" },
  other: { label: "Tjetër", color: "bg-gray-100 text-gray-700" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Në Pritje", color: "bg-amber-100 text-amber-700" },
  reviewed: { label: "Shqyrtuar", color: "bg-green-100 text-green-700" },
  dismissed: { label: "Refuzuar", color: "bg-gray-100 text-gray-700" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (reasonFilter) params.set("reason", reasonFilter);
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/admin/reports?${params}`);
      const data = await res.json();
      setReports(data.reports || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, reasonFilter, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function updateReportStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  async function deleteReport(id: string) {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë raport?")) return;
    try {
      await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">⚠️</div>
        <div>
          <h2 className="font-semibold text-gray-800">Menaxhimi i Raporteve</h2>
          <p className="text-sm text-gray-500">Shqyrtoni raportimet e përdoruesve për njoftimet e dyshimta</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none flex-1"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Të gjitha statuset</option>
            <option value="pending">Në Pritje</option>
            <option value="reviewed">Shqyrtuar</option>
            <option value="dismissed">Refuzuar</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none flex-1"
            value={reasonFilter}
            onChange={(e) => { setReasonFilter(e.target.value); setPage(1); }}
          >
            <option value="">Të gjitha arsyjet</option>
            <option value="spam">Spam</option>
            <option value="fraud">Mashtrim / Fake</option>
            <option value="duplicate">I Dyfishuar</option>
            <option value="inappropriate">Papërshtatshëm</option>
            <option value="other">Tjetër</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-4xl mb-3 block">✅</span>
            <p className="text-gray-500">Nuk ka raporte {statusFilter ? `me status "${statusLabels[statusFilter]?.label || statusFilter}"` : ""}.</p>
          </div>
        ) : (
          <div className="divide-y">
            {reports.map((report) => {
              const reasonInfo = reasonLabels[report.reason] || { label: report.reason, color: "bg-gray-100 text-gray-700" };
              const statusInfo = statusLabels[report.status] || { label: report.status, color: "bg-gray-100 text-gray-700" };

              return (
                <div key={report.id} className={`p-5 ${report.status === "pending" ? "bg-red-50/30" : ""}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Side - Report Info */}
                    <div className="flex-1 min-w-0">
                      {/* Badges Row */}
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${reasonInfo.color}`}>
                          {reasonInfo.label}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString("sq-AL", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Listing Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          {report.listing.images[0] && (
                            <img
                              src={report.listing.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/listing/${report.listing.id}`}
                            className="font-semibold text-gray-900 hover:text-amber-500 truncate block"
                            target="_blank"
                          >
                            {report.listing.title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {report.listing.brand} {report.listing.model} · €{report.listing.price.toLocaleString()}
                            {report.listing.premium && <span className="ml-1 text-amber-600 font-bold">★ Premium</span>}
                          </p>
                          <p className="text-xs text-gray-400">
                            Pronar: {report.listing.user.name} ({report.listing.user.email})
                          </p>
                        </div>
                      </div>

                      {/* Reporter Info */}
                      <p className="text-xs text-gray-500 mb-1">
                        <span className="font-medium text-gray-700">Raportuar nga:</span>{" "}
                        {report.user.name} ({report.user.email})
                      </p>

                      {/* Details */}
                      {report.details && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                          <p className="text-sm text-gray-700">{report.details}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateReportStatus(report.id, "reviewed")}
                            disabled={updating === report.id}
                            className="px-4 py-2 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                          >
                            ✓ Shqyrto
                          </button>
                          <button
                            onClick={() => updateReportStatus(report.id, "dismissed")}
                            disabled={updating === report.id}
                            className="px-4 py-2 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                          >
                            ✕ Refuzo
                          </button>
                        </>
                      )}
                      {report.status !== "pending" && (
                        <button
                          onClick={() => updateReportStatus(report.id, "pending")}
                          disabled={updating === report.id}
                          className="px-4 py-2 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 transition-colors"
                        >
                          ↩️ Rihap
                        </button>
                      )}
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="px-4 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🗑 Fshi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">{pagination.total} raporte gjithsej</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50"
              >
                ← Para
              </button>
              <span className="px-3 py-1 text-sm">
                {page} / {pagination.totalPages}
              </span>
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
