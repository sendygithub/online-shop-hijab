"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <main className="min-h-screen bg-background flex flex-col islamic-pattern">
      <Header onNavigateCart={handleNavigateCart} />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold">Keranjang</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Keranjang Belanja
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalItems > 0
                ? `Ada ${totalItems} item di keranjang Anda`
                : "Keranjang Anda kosong"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-semibold text-sm"
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
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Keranjang Anda Kosong
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Belum ada produk yang ditambahkan ke keranjang. Yuk, mulai belanja
              sekarang!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      {/* Product Image */}
                      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/30">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] rounded-full font-semibold mb-2">
                              {product.category}
                            </span>
                            <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                              {product.description}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0"
                            title="Hapus item"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                          {/* Price */}
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-muted-foreground">
                              Jumlah:
                            </label>
                            <div className="flex items-center border border-border/60 rounded-xl">
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
                                className="p-2.5 hover:bg-muted transition-colors rounded-l-xl"
                              >
                                <Minus className="w-4 h-4 text-foreground" />
                              </button>
                              <span className="px-4 py-2 font-semibold text-foreground min-w-[3rem] text-center">
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
                                className="p-2.5 hover:bg-muted transition-colors rounded-r-xl"
                              >
                                <Plus className="w-4 h-4 text-foreground" />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Subtotal
                            </p>
                            <p className="font-bold text-foreground">
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
              <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Ringkasan Belanja
                </h2>

                {/* Product List Summary */}
                <div className="space-y-3 mb-6">
                  {items.map((item, index) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 pb-3 border-b border-border/30 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-50 dark:bg-emerald-950/30 flex-shrink-0">
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
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">
                      Subtotal ({totalItems} item)
                    </span>
                    <span className="font-semibold">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span
                      className={`font-semibold ${
                        shipping === 0 ? "text-emerald-600" : "text-foreground"
                      }`}
                    >
                      {shipping === 0
                        ? "Gratis"
                        : `Rp ${shipping.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3">
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Gratis ongkir untuk belanja minimal Rp100.000 (kurang Rp{" "}
                        {(100000 - subtotal).toLocaleString("id-ID")} lagi)
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-border/50 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">
                      Total Belanja
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Lanjut ke Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3 text-emerald-600 hover:text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Lanjutkan Belanja
                </Link>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      Pembayaran Aman
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="w-3 h-3 text-emerald-500" />
                      Pengiriman Cepat
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="w-3 h-3 text-emerald-500" />
                      Kualitas Premium
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-emerald-500" />
                      Garansi Halal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card to-card/95 text-foreground py-16 border-t border-border/50 mt-8">
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
