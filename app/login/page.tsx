"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setSuccess("Hyri me sukses! Duke ju ridrejtuar...");
      setTimeout(() => window.location.href = redirectTo, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gabim gjatë hyrjes.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (registerData.password !== registerData.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setSuccess("Regjistrimi u krye me sukses! Duke ju ridrejtuar...");
      setTimeout(() => window.location.href = redirectTo, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gabim gjatë regjistrimit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex min-h-screen relative overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          FULL-PAGE CAR BACKGROUND
      ═══════════════════════════════════════════════════════ */}
      <img
        src="/images/login-car2.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay so form is readable */}
      <div className="absolute inset-0 bg-[#070b14]/75" />
      {/* Ambient glow effects */}
      <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.06] blur-[150px]" />
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />

      {/* ═══════════════════════════════════════════════════════
          CENTERED FORM CARD
      ═══════════════════════════════════════════════════════ */}
      <div className="w-full flex items-start sm:items-center justify-center pt-24 pb-6 px-4 sm:p-10 relative z-10 overflow-y-auto">

        <div className="w-full max-w-md bg-[#0a0f1a]/80 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-5 sm:mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
                </svg>
              </div>
              <span className="text-white font-black text-xl tracking-tight group-hover:text-cyan-400 transition-colors">
                Auto<span className="text-cyan-400 group-hover:text-white transition-colors">Vetura</span>
              </span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-white/[0.05] border border-white/[0.08] p-1 mb-8">
            <button
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
            >
              Hyr
            </button>
            <button
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); }}
            >
              Regjistrohu
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {activeTab === "login" ? (
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Mirë se u ktheve!</h3>
              <p className="text-gray-500 text-sm mb-8">Hyni në llogarinë tuaj për të vazhduar</p>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="login-email">
                    Email ose Emri i përdoruesit
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="login-email"
                      placeholder="email@shembull.com"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="login-password">
                    Fjalëkalimi
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      placeholder="Shkruani fjalëkalimin tuaj"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-5 h-5 rounded-md border border-white/[0.15] bg-white/[0.05] peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                        {rememberMe && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Më mbaj mend</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Keni harruar fjalëkalimin?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Kyçu
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-gray-600 font-medium">ose</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Switch to register */}
              <p className="text-center text-sm text-gray-500">
                Nuk keni llogari?{" "}
                <button
                  onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Regjistrohu tani
                </button>
              </p>
            </div>
          ) : (
            /* ── REGISTER FORM ── */
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Krijo llogarinë</h3>
              <p className="text-gray-500 text-sm mb-5 sm:mb-8">Filloni të kërkoni makinën tuaj të ëndrrave</p>

              <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="reg-name">
                    Emri i plotë
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="Emri juaj i plotë"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="reg-email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="reg-email"
                      placeholder="email@shembull.com"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="reg-phone">
                    Numri i telefonit
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="reg-phone"
                      placeholder="+355 6X XXX XXXX"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="reg-password">
                    Fjalëkalimi
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="reg-password"
                      placeholder="Krijoni një fjalëkalim"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="reg-confirm">
                    Konfirmo fjalëkalimin
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="reg-confirm"
                      placeholder="Përsëritni fjalëkalimin"
                      className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 placeholder-gray-600 hover:bg-white/[0.08] transition-all"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Regjistrohu
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-gray-600 font-medium">ose</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Switch to login */}
              <p className="text-center text-sm text-gray-500">
                Keni tashmë llogari?{" "}
                <button
                  onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Hyni këtu
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

