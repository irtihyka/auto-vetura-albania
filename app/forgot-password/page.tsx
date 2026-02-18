"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to password reset backend
    console.log("Password reset requested for:", email);
    setSubmitted(true);
  };

  return (
    <main className="flex-grow flex flex-col items-center bg-gray-100">
      <div className="mt-20 mb-20 w-full max-w-md flex flex-col bg-white rounded shadow-md items-center justify-center mx-4">
        <div className="w-full bg-custom-dark text-white text-center py-4 rounded-t">
          <h2 className="text-xl font-bold">Rivendos fjalëkalimin</h2>
        </div>

        <div className="p-8 w-full">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Email u dërgua!</h3>
              <p className="text-gray-600 mb-6">
                Nëse ekziston një llogari me email-in{" "}
                <strong>{email}</strong>, do të pranoni një link për
                rivendosjen e fjalëkalimit.
              </p>
              <Link
                href="/login"
                className="inline-block bg-custom-dark text-white font-bold py-2 px-6 rounded hover:opacity-90 transition"
              >
                Kthehu te hyrja
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Shkruani email-in tuaj dhe ne do t&apos;ju dërgojmë një link
                për të rivendosur fjalëkalimin.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="reset-email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    placeholder="Shkruani email-in tuaj"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full bg-custom-dark text-white font-bold py-2 px-4 rounded cursor-pointer hover:opacity-90 transition"
                  >
                    Dërgo linkun
                  </button>
                  <Link
                    href="/login"
                    className="text-center text-amber-500 hover:text-amber-700 underline text-sm"
                  >
                    Kthehu te hyrja
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
