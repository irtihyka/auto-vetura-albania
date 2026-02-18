"use client";

import { useEffect, useState } from "react";

export function PWARegister() {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
        })
        .catch((err) => {
          console.log("SW registration failed:", err);
        });
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show if not previously dismissed this session
      const wasDismissed = sessionStorage.getItem("pwa-dismissed");
      if (!wasDismissed) {
        setShowInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      console.log("PWA installed");
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  }

  function handleDismiss() {
    setShowInstall(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "true");
  }

  if (!showInstall || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[380px] z-[100] animate-slide-up">
      <div className="bg-[#0f0f23] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-5 text-white">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1V6a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16l-2-1m-2-5h3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1">Instalo AutoVetura</h3>
            <p className="text-sm text-white/60 leading-snug">
              Shto aplikacionin në telefonin tënd për përdorim më të shpejtë!
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Instalo Tani
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Më vonë
          </button>
        </div>
      </div>
    </div>
  );
}

// Type declaration for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
