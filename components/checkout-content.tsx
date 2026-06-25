"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, ArrowLeft, ShoppingCart } from "lucide-react";
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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
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
            Pesanan Berhasil!
          </h2>
          <p className="text-muted-foreground mb-8">
            Terima kasih! Pesanan Anda telah diterima dan akan segera diproses.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
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
        className="flex items-center gap-2 text-primary hover:text-accent mb-8 w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Toko</span>
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
        Checkout
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">
            Keranjang Anda kosong
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors"
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
              <h2 className="text-xl font-bold text-foreground">
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
                    className="bg-white border border-border rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
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
                        <p className="text-xl font-bold text-primary mb-4">
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
                                className={`px-4 py-2 rounded-lg border-2 transition-colors font-semibold ${
                                  item.size === size
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white text-foreground border-border hover:border-primary"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          {item.size === "" && (
                            <p className="text-xs text-red-500 mt-2">
                              Ukuran harus dipilih
                            </p>
                          )}
                        </div>

                        {/* Quantity Selection */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-semibold text-foreground">
                            Jumlah:
                          </label>
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4 text-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors h-fit"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping Form */}
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Total Item:</span>
                  <span className="font-semibold">{getTotalItems()} item</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Ongkos Kirim:</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!allItemsHaveSize || submitting}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  allItemsHaveSize && !submitting
                    ? "bg-primary text-white hover:bg-accent cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {allItemsHaveSize
                  ? "Siap untuk checkout"
                  : "Pilih ukuran untuk semua item terlebih dahulu"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
