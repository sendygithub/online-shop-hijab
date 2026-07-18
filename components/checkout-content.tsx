"use client";

import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  ArrowLeft,
  ShoppingCart,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string | null;
  rating: number;
  stock: number;
  sold: number;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function CheckoutContent() {
  const { items, updateItem, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const item = items[index];
    updateItem(index, quantity, item.size);
  };

  const handleSizeChange = (index: number, size: string) => {
    const item = items[index];
    updateItem(index, item.quantity, size);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find((p) => p.id === String(item.productId));
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const allItemsHaveSize =
    items.length > 0 && items.every((item) => item.size !== "");

  const handleSubmitOrder = async () => {
    if (!allItemsHaveSize) return;

    // Validate shipping form
    if (
      !shippingForm.name ||
      !shippingForm.email ||
      !shippingForm.phone ||
      !shippingForm.address ||
      !shippingForm.city ||
      !shippingForm.postalCode
    ) {
      alert("Harap isi semua data pengiriman");
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === String(item.productId));
        return {
          productId: String(item.productId),
          quantity: item.quantity,
          size: item.size,
          price: product?.price || 0,
        };
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shippingForm,
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal membuat pesanan");
      }

      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pesanan Berhasil! 🎉
          </h2>
          <p className="text-muted-foreground mb-8">
            Terima kasih! Pesanan Anda telah diterima dan akan segera diproses.
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all duration-200"
          >
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 w-fit font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Toko</span>
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
        Checkout
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            Keranjang Anda kosong
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            Lanjutkan Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Items & Shipping */}
          <div className="lg:col-span-2 space-y-8">
            {/* Checkout Items */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                Pilihan Ukuran & Jumlah Pesanan
              </h2>
              {items.map((item, index) => {
                const product = products.find(
                  (p) => p.id === String(item.productId),
                );
                if (!product) return null;

                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {product.description}
                        </p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Pilih Ukuran:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(index, size)}
                                className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-semibold text-sm ${
                                  item.size === size
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                                    : "bg-white dark:bg-card text-foreground border-border/60 hover:border-emerald-400 hover:text-emerald-600"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          {item.size === "" && (
                            <p className="text-xs text-amber-600 mt-2">
                              Ukuran harus dipilih
                            </p>
                          )}
                        </div>

                        {/* Quantity Selection */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-semibold text-foreground">
                            Jumlah:
                          </label>
                          <div className="flex items-center border border-border/60 rounded-xl">
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                              className="p-2.5 hover:bg-muted transition-colors rounded-l-xl"
                            >
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-foreground min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                              className="p-2.5 hover:bg-muted transition-colors rounded-r-xl"
                            >
                              <Plus className="w-4 h-4 text-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-colors h-fit"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping Form */}
            <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-500" />
                Data Pengiriman
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingForm.name}
                    onChange={handleShippingChange}
                    placeholder="Nama penerima"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingForm.email}
                    onChange={handleShippingChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    No. Telepon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleShippingChange}
                    placeholder="08123456789"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Kota *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    placeholder="Kota tujuan"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Alamat Lengkap *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleShippingChange}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingForm.postalCode}
                    onChange={handleShippingChange}
                    placeholder="Kode pos"
                    className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-muted/50 dark:bg-input text-foreground placeholder-muted-foreground transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Total Item:</span>
                  <span className="font-semibold">{getTotalItems()} item</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Ongkos Kirim:</span>
                  <span className="font-semibold text-emerald-600">Gratis</span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!allItemsHaveSize || submitting}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-200 ${
                  allItemsHaveSize && !submitting
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  "Buat Pesanan"
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {allItemsHaveSize
                  ? "✓ Siap untuk checkout"
                  : "Pilih ukuran untuk semua item terlebih dahulu"}
              </p>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  Pembayaran Aman
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
