"use client";

import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckoutContent } from "@/components/checkout-content";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const handleNavigateCart = () => {
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header onNavigateCart={handleNavigateCart} />

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8 flex-grow">
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>

      <Footer />
    </main>
  );
}
