"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mainLinks = [
  {
    label: "Kryefaqja",
    href: "/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
      </svg>
    ),
  },
  {
    label: "Kërko",
    href: "/search",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

const categoryLinks = [
  {
    label: "Makina",
    href: "/search?vehicleType=Makin%C3%AB",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 01-2-2v-3a1 1 0 011-1h1l2-4h10l2 4h1a1 1 0 011 1v3a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    label: "Motocikleta",
    href: "/search?vehicleType=Motociklet%C3%AB",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6h3l2 5M9 17.5h6M5.5 14l3-8h4l3 8" />
        <path d="M12 6V3" />
      </svg>
    ),
  },
  {
    label: "Kamiona",
    href: "/search?vehicleType=Kamion",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="14" height="10" rx="1" />
        <path d="M15 10h4l3 3v3h-7V10z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="19" cy="18" r="2" />
      </svg>
    ),
  },
];

const userNavLinks = [
  { label: "Njoftimet e Mia", href: "/my-listings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Të Preferuarat", href: "/favorites", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { label: "Paneli", href: "/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch auth state
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 80);
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 will-change-transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          !isHome
            ? "bg-[#0f0f23] shadow-lg shadow-black/30"
            : scrolled
              ? "bg-[#0f0f23]/85 backdrop-blur-2xl shadow-xl shadow-black/25 border-b border-white/[0.06]"
              : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
      >
        {/* Decorative gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

        <nav className="flex justify-between items-center max-w-screen-xl h-[72px] mx-auto px-5 text-white">
          {/* Left side: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-9 h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${sidebarOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${sidebarOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${sidebarOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative group">
              <Image
                height={110}
                width={110}
                src="/images/Logo.png"
                alt="Logo"
                priority
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Nav links + Vehicle categories */}
          <div className="hidden md:flex items-center gap-6">
            {/* Main nav links */}
            <div className="flex items-center gap-1">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? "text-blue-400"
                        : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10" />

            {/* Vehicle category pills */}
            <div className="flex items-center gap-1 bg-white/[0.06] rounded-2xl p-1 border border-white/[0.06]">
              {categoryLinks.map((link) => {
                const currentUrl = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
                const isActive = currentUrl === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-3">
            {/* CTA Button - Desktop */}
            {user && (
              <Link
                href="/create-listing"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Shto Njoftim
              </Link>
            )}

            {/* Mobile search icon */}
            <Link
              href="/search"
              className="md:hidden w-9 h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* User menu / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-300 ${
                    dropdownOpen
                      ? "bg-white/[0.15] ring-1 ring-white/20"
                      : "hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-white/90">{user.name}</span>
                  <svg className={`hidden md:block w-4 h-4 text-white/50 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 mt-2 w-64 transition-all duration-300 origin-top-right ${
                  dropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}>
                  {dropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  )}
                  <div className="relative z-50 bg-[#1a1a2e] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-base font-bold shadow-lg shadow-blue-500/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      {[
                        { href: "/my-listings", label: "Njoftimet e Mia", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                        { href: "/favorites", label: "Të Preferuarat", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                        { href: "/dashboard", label: "Paneli im", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                        { href: "/create-listing", label: "Shto Njoftim", icon: "M12 4v16m8-8H4" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            pathname === item.href
                              ? "bg-blue-500/15 text-blue-400"
                              : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                          {item.label}
                        </Link>
                      ))}

                      {user.role === "admin" && (
                        <>
                          <div className="mx-3 my-1 h-px bg-white/[0.06]" />
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-400 hover:bg-blue-500/10 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="mx-3 my-1 h-px bg-white/[0.06]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Dilni
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Hyr
                </Link>
                <Link
                  href="/login"
                  className="md:hidden w-9 h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile sidebar - full screen overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`absolute top-0 left-0 h-full w-[280px] bg-[#0f0f23] border-r border-white/[0.06] transform transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-white/[0.06]">
            <Link href="/" className="flex-shrink-0" onClick={() => setSidebarOpen(false)}>
              <Image height={100} width={100} src="/images/Logo.png" alt="Logo" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User card (if logged in) */}
          {user && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-base font-bold shadow-lg shadow-blue-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">Navigimi</p>
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}

            <div className="h-px bg-white/[0.06] my-3" />
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">Kategoritë</p>
            {categoryLinks.map((link) => {
              const currentUrl = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
              const isActive = currentUrl === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <>
                <div className="h-px bg-white/[0.06] my-3" />
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">Llogaria ime</p>
                {[
                  ...userNavLinks,
                  { label: "Shto Njoftim", href: "/create-listing", icon: "M12 4v16m8-8H4" },
                ].map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                      </svg>
                      {link.label}
                    </Link>
                  );
                })}

                {user.role === "admin" && (
                  <>
                    <div className="h-px bg-white/[0.06] my-3" />
                    <Link
                      href="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Panel
                    </Link>
                  </>
                )}

                <div className="h-px bg-white/[0.06] my-3" />
                <button
                  onClick={() => { handleLogout(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Dilni
                </button>
              </>
            )}

            {!user && (
              <>
                <div className="h-px bg-white/[0.06] my-3" />
                <Link
                  href="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Hyr / Regjistrohu
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
