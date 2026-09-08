"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCart } from "@/app/context/cart-context";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Shield,
  Truck,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string | null;
  category: string;
  stock: number;
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateItem, removeItem, clearCart, getTotalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch-on-mount: ambil katalog sekali saat halaman dibuka.
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigateCart = () => {
    router.push("/cart");
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find((p) => p.id === String(item.productId));
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const totalItems = getTotalItems();
  const subtotal = calculateTotal();
  const shipping = subtotal >= 100000 ? 0 : 15000;
  const total = subtotal + shipping;

  const getProduct = (productId: number) => {
    return products.find((p) => p.id === String(productId));
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header onNavigateCart={handleNavigateCart} />

      <div className="container mx-auto px-4 py-6 md:py-8 flex-grow">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
          <Link
            href="/"
            className="hover:text-emerald-600 transition-colors font-medium"
          >
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Keranjang</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Keranjang Belanja
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems > 0
                ? `${totalItems} item dalam keranjang`
                : "Keranjang Anda kosong"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-semibold text-sm border border-red-200/60 dark:border-red-800/40 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16 md:py-20">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-5 md:mb-6 border border-emerald-100 dark:border-emerald-800/50">
              <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Keranjang Anda Kosong
            </h2>
            <p className="text-muted-foreground mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base px-4">
              Belum ada produk yang ditambahkan ke keranjang. Yuk, mulai belanja
              sekarang!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-200/60 dark:shadow-emerald-900/40 hover:shadow-2xl transition-all duration-200 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left - Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item, index) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-card border border-border/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-3 md:gap-5">
                      {/* Product Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-black/5 dark:ring-white/5">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] rounded-full font-bold mb-1.5">
                              {product.category}
                            </span>
                            <h3 className="text-sm md:text-base font-bold text-foreground mb-0.5 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                              {product.description}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0 border border-transparent hover:border-red-200/60 dark:hover:border-red-800/40"
                            title="Hapus item"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                          {/* Price */}
                          <p className="text-base md:text-lg font-bold text-emerald-700 dark:text-emerald-400">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="flex items-center border border-border/60 rounded-xl bg-muted/30">
                              <button
                                onClick={() => {
                                  if (item.quantity <= 1) {
                                    removeItem(index);
                                  } else {
                                    updateItem(
                                      index,
                                      item.quantity - 1,
                                      item.size,
                                    );
                                  }
                                }}
                                className="p-2 hover:bg-muted transition-colors rounded-l-xl active:scale-95"
                              >
                                <Minus className="w-3.5 h-3.5 text-foreground" />
                              </button>
                              <span className="px-3 md:px-4 py-2 font-bold text-foreground min-w-[2.5rem] text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateItem(
                                    index,
                                    item.quantity + 1,
                                    item.size,
                                  )
                                }
                                className="p-2 hover:bg-muted transition-colors rounded-r-xl active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5 text-foreground" />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Subtotal
                            </p>
                            <p className="font-bold text-foreground text-sm">
                              Rp{" "}
                              {(product.price * item.quantity).toLocaleString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-card border border-border/60 rounded-3xl p-5 md:p-6 shadow-sm sticky top-24">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-5 md:mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Ringkasan Belanja
                </h2>

                {/* Product List Summary */}
                <div className="space-y-3 mb-5 md:mb-6 max-h-64 overflow-y-auto no-scrollbar">
                  {items.map((item, index) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 pb-3 border-b border-border/40 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/30 flex-shrink-0 ring-1 ring-black/5 dark:ring-white/5">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity}x Rp{" "}
                            {product.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          Rp{" "}
                          {(product.price * item.quantity).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Details */}
                <div className="space-y-3 mb-5 md:mb-6">
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground text-sm">
                      Subtotal ({totalItems} item)
                    </span>
                    <span className="font-semibold text-sm">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground text-sm">
                      Ongkos Kirim
                    </span>
                    <span
                      className={`font-semibold text-sm ${
                        shipping === 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      }`}
                    >
                      {shipping === 0
                        ? "Gratis"
                        : `Rp ${shipping.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/60 dark:border-amber-800/40">
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        Gratis ongkir untuk belanja minimal Rp100.000 (kurang Rp{" "}
                        {(100000 - subtotal).toLocaleString("id-ID")} lagi)
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-border/60 pt-4 mb-5 md:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-foreground">
                      Total Belanja
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-emerald-200/60 dark:shadow-emerald-900/40 hover:shadow-2xl active:scale-[0.98] text-sm md:text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Lanjut ke Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3 text-emerald-600 hover:text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Lanjutkan Belanja
                </Link>

                {/* Trust badges */}
                <div className="mt-5 pt-5 border-t border-border/60">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      Pembayaran Aman
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      Pengiriman Cepat
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      Kualitas Premium
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-emerald-500" />
                      Garansi Halal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
