"use client";

import { useState } from "react";
import SocialSection from "@/components/SocialSection";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ndodhi një gabim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-r from-gray-100 to-gray-200 w-full text-gray-900 flex-grow flex flex-col items-center">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white pt-28 pb-20 shadow-lg w-full">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Na kontaktoni</h2>
          <p className="text-base max-w-2xl mx-auto mb-8">
            Jemi këtu për t&apos;ju ndihmuar për çdo pyetje apo nevojë.
          </p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-16 w-full">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
          <div>
            <h3 className="text-lg text-gray-600 mb-2">
              Si mund të ju ndihmojmë?
            </h3>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Na Kontaktoni
            </h2>
            <p className="text-gray-600 mb-6">
              Ne synojmë t&apos;ju lehtësojmë punën dhe t&apos;ju kursejë kohë.
              Jeni vetëm një telefonatë larg nga zgjidhja e problemit tuaj.
              <br />
              <strong>You call – We Solve!</strong>
            </p>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Dërgo një mesazh</h3>
            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Mesazhi u dërgua me sukses!
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Emri *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Shkruani emrin tuaj"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Shkruani email-in tuaj"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="phone">
                  Numri
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Shkruani numrin tuaj"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Mesazhi *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Shkruani mesazhin tuaj"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer"
              >
                {loading ? "Duke dërguar..." : "Dërgo"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16 w-full">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
          <div className="flex flex-col items-center transition transform hover:scale-105">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 384 512"
              className="w-14 h-14 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
            </svg>
            <h3 className="text-base font-bold mb-2">Na vizitoni</h3>
            <p className="text-gray-600">Tiranë, Shqipëri</p>
          </div>

          <div className="flex flex-col items-center transition transform hover:scale-105">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-16 h-16 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Na kontaktoni</h3>
            <a
              href="tel:+355694444491"
              className="text-blue-500 hover:text-blue-700 transition"
            >
              +355 69 444 4491
            </a>
          </div>

          <div className="flex flex-col items-center transition transform hover:scale-105">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-16 h-16 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Na shkruani</h3>
            <a
              href="mailto:info@your-domain.al"
              className="text-blue-500 hover:text-blue-700 transition"
            >
              info@your-domain.al
            </a>
          </div>
        </div>
      </section>

      {/* Social */}
      <SocialSection />
    </main>
  );
}
