"use client";

import { Suspense } from "react";
import Header from "@/components/header";
import { CheckoutContent } from "@/components/checkout-content";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const handleNavigateCart = () => {
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-background islamic-pattern">
      <Header onNavigateCart={handleNavigateCart} />

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card to-card/95 text-foreground py-16 mt-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    Hijab
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Paradise
                    </span>
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Toko online pakaian muslim terpercaya sejak 2023, menyediakan
                koleksi pakaian muslim berkualitas dengan harga terjangkau.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Kategori</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Hijab
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Gamis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Tunik
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Pashmina
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Abaya
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Layanan</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Pengiriman Gratis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Garansi Kualitas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Tukar Balik
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Customer Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Hubungi Kami</h4>
              <p className="text-muted-foreground text-sm mb-2">
                <span className="font-semibold text-foreground">WhatsApp:</span>{" "}
                +62 812 3456 7890
              </p>
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                info@hijabparadise.com
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Hijab Paradise. Semua hak
              dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
