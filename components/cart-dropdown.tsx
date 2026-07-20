"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2, Star } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, updateItem, removeItem, getTotalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find((p) => p.id === String(item.productId));
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  const totalItems = getTotalItems();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed top-20 right-4 w-full max-w-md bg-white dark:bg-card border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-border/50 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Keranjang Belanja</h3>
                <p className="text-xs text-muted-foreground">
                  {totalItems} {totalItems > 1 ? "item" : "item"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 320px)" }}
        >
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-muted-foreground font-medium">
                Keranjang Anda kosong
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tambahkan produk favorit Anda
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item, index) => {
                const product = products.find(
                  (p) => p.id === String(item.productId),
                );
                if (!product) return null;

                return (
                  <div
                    key={index}
                    className="flex gap-3 bg-muted/30 dark:bg-muted/10 rounded-xl p-3 border border-border/30"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/30">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem(index);
                            } else {
                              updateItem(index, item.quantity - 1, item.size);
                            }
                          }}
                          className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-foreground" />
                        </button>
                        <span className="text-sm font-semibold text-foreground min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItem(index, item.quantity + 1, item.size)
                          }
                          className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                      <p className="text-xs font-bold text-foreground">
                        Rp{" "}
                        {(product.price * item.quantity).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border/50 p-5 bg-gradient-to-b from-transparent to-muted/30">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Belanja</p>
                <p className="text-xs text-muted-foreground">
                  {totalItems} item
                </p>
              </div>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                Rp {calculateTotal().toLocaleString("id-ID")}
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl"
            >
              <ShoppingCart className="w-4 h-4" />
              Checkout Sekarang
            </button>
          </div>
        )}
      </div>
    </>
  );
}
