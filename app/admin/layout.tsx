"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const sidebarLinks = [
  { href: "/admin", label: "Paneli", icon: "📊" },
  { href: "/admin/listings", label: "Njoftimet", icon: "🚗" },
  { href: "/admin/users", label: "Përdoruesit", icon: "👥" },
  { href: "/admin/reports", label: "Raporte", icon: "⚠️" },
  { href: "/admin/messages", label: "Mesazhet", icon: "✉️" },
  { href: "/admin/settings", label: "Cilësimet", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === "admin") {
          setUser(data.user);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] text-white transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-bold text-amber-400">
            Auto Vetura Albania
          </Link>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <Link
            href="/"
            className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Kthehu në faqe
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {sidebarLinks.find((l) => l.href === pathname || (l.href !== "/admin" && pathname.startsWith(l.href)))?.label || "Admin"}
            </h1>
            <div className="text-sm text-gray-500">
              Admin: {user.name}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
