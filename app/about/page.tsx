import Link from "next/link";
import SocialSection from "@/components/SocialSection";

export const metadata = {
  title: "Rreth Nesh - Auto Vetura Albania",
  description: "Zbuloni më shumë rreth shërbimeve tona dhe si mund t'ju ndihmojmë të gjeni makinën perfekte.",
};

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-r from-gray-100 to-gray-200 w-full text-gray-900 flex-grow flex flex-col items-center">
      {/* Hero */}
      <section className="relative text-white pt-28 pb-20 bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg w-full">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold mb-6">Rreth Nesh</h2>
          <p className="text-base text-gray-50 max-w-2xl mx-auto mb-8">
            Zbuloni më shumë rreth shërbimeve tona dhe si mund t&apos;ju
            ndihmojmë të gjeni makinën perfekte për nevojat tuaja.
          </p>
          <a
            className="inline-block bg-white text-amber-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            href="#more-info"
          >
            Mëso më shumë
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 w-full">
        <div className="container mx-auto text-center px-4">
          <h2
            className="text-2xl font-extrabold text-gray-900 mb-12"
            id="more-info"
          >
            Si funksionon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Link
              href="/search"
              className="flex flex-col items-center group bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">
                Kërkoni
              </h4>
              <p className="text-gray-600">
                Gjeni atë që ju nevojitet shpejt dhe lehtë.
              </p>
            </Link>

            <Link
              href="/search"
              className="flex flex-col items-center group bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">
                Gjeni makinën që ju pëlqen
              </h4>
              <p className="text-gray-600">
                Zgjidhni nga një gamë e gjerë makinash të garantuara.
              </p>
            </Link>

            <Link
              href="/contact"
              className="flex flex-col items-center group bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">
                Kontaktoni me ne
              </h4>
              <p className="text-gray-600">
                Lidhuni me ekipin tonë për më shumë informacion.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16 w-full bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Misioni ynë
              </h2>
              <p className="text-gray-600 mb-4">
                Ne synojmë të krijojmë platformën më të besueshme dhe të lehtë
                për shitblerjen e makinave në Shqipëri. Me teknologjinë më të
                fundit dhe një ekip të përkushtuar, ne ofrojmë një eksperiencë
                të paprecedentë.
              </p>
              <p className="text-gray-600 mb-4">
                Çdo ditë punojmë për të siguruar që përdoruesit tanë të gjejnë
                makinën e tyre të ëndrrave me çmimin më të mirë.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 mt-4"
              >
                Na kontaktoni
              </Link>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg p-12 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                viewBox="0 0 24 24"
                opacity="0.5"
              >
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9m-6-6h15m-6 0V6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <SocialSection />
    </main>
  );
}
