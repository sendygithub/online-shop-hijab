import Link from "next/link";
import { Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-card to-card/95 text-foreground border-t border-border/50">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 group-hover:shadow-xl transition-shadow">
                <Star className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-foreground leading-tight">
                Hijab
                <span className="text-emerald-600 dark:text-emerald-400">
                  Paradise
                </span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Toko online pakaian muslim terpercaya sejak 2023. Menyediakan
              koleksi hijab, gamis, tunik, dan pashmina berkualitas.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-muted hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-muted hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 100 12.68 6.34 6.34 0 006.34-6.34V9.56a8.28 8.28 0 004.85 1.55V7.1a4.85 4.85 0 01-1-.01z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-muted hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Kategori
            </h4>
            <ul className="space-y-3 text-sm">
              {["Hijab", "Gamis", "Tunik", "Pashmina", "Abaya", "Jilbab"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Layanan
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Pengiriman Gratis",
                "Garansi Kualitas",
                "Tukar Balik",
                "Customer Service",
                "Kebijakan Privasi",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5">
                  WhatsApp
                </span>
                +62 812 3456 7890
              </li>
              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5">
                  Email
                </span>
                info@hijabparadise.com
              </li>
              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5">
                  Jam Operasional
                </span>
                08.00 - 21.00 WIB
              </li>
            </ul>

            <div className="mt-5">
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-3 py-2 rounded-xl border border-border text-sm text-foreground bg-white dark:bg-input focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                />
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200 dark:shadow-emerald-900/30">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Hijab Paradise. Semua hak
            dilindungi.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
