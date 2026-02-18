"use client";

import { useEffect, useState } from "react";

interface Settings {
  id: string;
  siteName: string;
  siteDesc: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  youtube: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => setError("Gabim në ngarkimin e cilësimeve."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSettings(data.settings);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Gabim në ruajtjen e cilësimeve.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof Settings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) return <p className="text-red-500">{error || "Gabim."}</p>;

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      {/* General */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cilësimet e Përgjithshme</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Faqes</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Përshkrimi</label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows={3}
              value={settings.siteDesc}
              onChange={(e) => updateField("siteDesc", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rrjetet Sociale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input
              type="url"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://instagram.com/..."
              value={settings.instagram}
              onChange={(e) => updateField("instagram", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input
              type="url"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://facebook.com/..."
              value={settings.facebook}
              onChange={(e) => updateField("facebook", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
            <input
              type="url"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://tiktok.com/@..."
              value={settings.tiktok}
              onChange={(e) => updateField("tiktok", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://wa.me/355..."
              value={settings.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input
              type="url"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://youtube.com/..."
              value={settings.youtube}
              onChange={(e) => updateField("youtube", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informacionet e Kontaktit</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={settings.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefoni</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={settings.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={settings.contactAddress}
              onChange={(e) => updateField("contactAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Duke ruajtur..." : "Ruaj Cilësimet"}
        </button>
        {success && (
          <span className="text-green-600 font-medium">Cilësimet u ruajtën me sukses!</span>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </form>
  );
}
