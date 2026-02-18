"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { listings: number; favorites: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    fetchUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm("Jeni i sigurt që doni ta fshini këtë përdorues? Të gjitha njoftimet e tij do të fshihen.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    fetchUsers();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("sq-AL", { year: "numeric", month: "short", day: "numeric" });
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <input
          type="text"
          placeholder="Kërko përdoruesit sipas emrit ose emailit..."
          className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Asnjë përdorues nuk u gjet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Përdoruesi</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Telefoni</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Njoftimet</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Regjistruar</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Roli</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {user._count.listings} njoftimet
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-500 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        className="text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none"
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                      >
                        <option value="user">Përdorues</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteUser(user.id)}
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
            <p className="text-sm text-gray-500">{pagination.total} përdorues gjithsej</p>
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
