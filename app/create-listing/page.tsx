"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const carBrands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo",
];

const fuelTypes = ["Benzinë", "Diesel", "Hibrid", "Elektrik", "Gas"];
const transmissionTypes = ["Automatik", "Manual"];
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Kombi", "Van", "Kabriolet"];
const vehicleTypeOptions = ["Makinë", "Motocikletë", "Kamion", "Furgon"];
const colorOptions = [
  "E bardhë", "E zezë", "Gri", "Argjendi", "Blu", "E kuqe",
  "Jeshile", "E verdhë", "Portokalli", "Kafe", "Bezhë", "E artë",
];
const albanianCities = [
  "Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Korçë", "Fier", "Berat",
  "Lushnjë", "Pogradec", "Kavajë", "Gjirokastër", "Sarandë", "Lezhë", "Kukës",
  "Peshkopi", "Burrel", "Gramsh", "Bulqizë", "Përmet", "Tepelenë", "Librazhd",
];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    model: "",
    year: new Date().getFullYear().toString(),
    fuel: "Benzinë",
    transmission: "Manual",
    km: "",
    price: "",
    color: "",
    bodyType: "",
    location: "",
    phone: "",
    vehicleType: "Makinë",
  });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
        } else {
          router.push("/login?redirect=/create-listing");
        }
      })
      .catch(() => router.push("/login?redirect=/create-listing"));
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) {
      setError("Maksimumi është 10 foto.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadForm = new FormData();
        imageFiles.forEach((file) => uploadForm.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Gabim gjatë ngarkimit të fotove.");
        imageUrls = uploadData.urls;
      }

      // Create listing
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim gjatë krijimit.");

      router.push(`/listing/${data.listing.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ndodhi një gabim.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated ) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 pt-28 pb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shto Një Njoftim</h1>
          <p className="text-gray-600 mb-8">Plotësoni formularin për të publikuar mjetin tuaj.</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Informacioni Bazë</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Lloji i mjetit *</label>
                  <div className="flex flex-wrap gap-3">
                    {vehicleTypeOptions.map((vt) => (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => setFormData({ ...formData, vehicleType: vt })}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                          formData.vehicleType === vt
                            ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {vt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Marka *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  >
                    <option value="">Zgjidh markën</option>
                    {carBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Modeli *</label>
                  <input
                    type="text"
                    placeholder="p.sh. C-Class"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Ngjyra</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  >
                    <option value="">Zgjidh ngjyrën</option>
                    {colorOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Viti *</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Çmimi (€) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="p.sh. 15000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Detajet e Mjetit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Karburanti *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                  >
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Transmisioni *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  >
                    {transmissionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Kilometra *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="p.sh. 50000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                    value={formData.km}
                    onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tipi i mjetit</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    value={formData.bodyType}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  >
                    <option value="">Zgjidh tipin</option>
                    {bodyTypes.map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Vendndodhja (Qyteti) *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Zgjidh qytetin</option>
                    {albanianCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Titulli & Përshkrimi</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Titulli i njoftimit *</label>
                <input
                  type="text"
                  placeholder="p.sh. Mercedes-Benz C-Class 2020"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <textarea
                rows={5}
                placeholder="Përshkruani makinën tuaj... (opsionale)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Kontakti</h2>
              <div>
                <label className="block text-sm font-bold mb-2">Numri i telefonit</label>
                <input
                  type="tel"
                  placeholder="p.sh. +355 69 123 4567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Foto (max 10)</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-500">Klikoni ose tërhiqni foto këtu</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG deri 5MB secila</p>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img src={preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition text-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Duke publikuar..." : "Publiko Njoftimin"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
