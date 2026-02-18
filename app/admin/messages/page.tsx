"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (unreadOnly) params.set("unread", "true");
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/admin/messages?${params}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function toggleRead(id: string, current: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !current }),
    });
    fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë mesazh?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    fetchMessages();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("sq-AL", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="text-sm text-gray-700">Shfaq vetëm mesazhet e palexuara</span>
        </label>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {unreadOnly ? "Nuk ka mesazhe të palexuara." : "Asnjë mesazh."}
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`transition-colors ${!msg.read ? "bg-amber-50/50" : ""}`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {!msg.read && (
                      <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-medium ${!msg.read ? "text-gray-900" : "text-gray-600"}`}>
                          {msg.name}
                        </p>
                        <span className="text-xs text-gray-400">{msg.email}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:inline">{formatDate(msg.createdAt)}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {expanded === msg.id && (
                  <div className="px-4 pb-4 bg-gray-50 border-t">
                    <div className="pt-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <div><span className="text-gray-500">Emri:</span> <span className="font-medium">{msg.name}</span></div>
                        <div><span className="text-gray-500">Email:</span> <span className="font-medium">{msg.email}</span></div>
                        <div><span className="text-gray-500">Tel:</span> <span className="font-medium">{msg.phone || "—"}</span></div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-sm text-gray-700 border">
                        {msg.message}
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.read); }}
                          className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                        >
                          {msg.read ? "Shëno si i palexuar" : "Shëno si i lexuar"}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                          Fshi
                        </button>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Përgjigju me Email
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">{pagination.total} mesazhe gjithsej</p>
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
