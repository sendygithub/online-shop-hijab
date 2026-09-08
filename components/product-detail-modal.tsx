"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShoppingCart,
  Star,
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  Package,
  Sparkles,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  stock?: number;
  sold?: number;
}

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, size: string, quantity: number) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Silakan pilih ukuran terlebih dahulu");
      return;
    }
    onAddToCart(product.id, selectedSize, quantity);
  };

  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-card rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] md:max-h-[90vh] overflow-y-auto animate-fade-in border border-border/60">
        {/* Islamic decorative top bar */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600 sticky top-0 z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full shadow-xl hover:bg-white dark:hover:bg-card transition-all duration-200 hover:scale-110 border border-border/50"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left - Image Gallery */}
          <div className="p-5 md:p-8 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/20">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-card/95 backdrop-blur-md text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-border/50">
                {product.category}
              </div>
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-14 p-2.5 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white dark:hover:bg-card transition-all duration-200 border border-border/50 hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </button>
              {/* Best Seller badge */}
              {product.sold && product.sold > 50 && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  Best Seller
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-emerald-500 shadow-md shadow-emerald-200/60 dark:shadow-emerald-900/40 scale-[1.02]"
                      : "border-transparent hover:border-emerald-300"
                  }`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="p-5 md:p-8 flex flex-col">
            <div className="flex-1">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200 dark:text-gray-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.rating})
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mb-5 md:mb-6">
                <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 mb-1">
                  Rp {(product.price * 1.2).toLocaleString("id-ID")}
                </p>
                <p className="text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                {product.sold && product.sold > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.sold} terjual
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-5 md:mb-6">
                <h3 className="font-bold text-foreground mb-2 text-sm md:text-base">
                  Deskripsi Produk
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-5 md:mb-6">
                <h3 className="font-bold text-foreground mb-3 text-sm md:text-base">
                  Pilih Ukuran:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 md:px-5 py-2.5 rounded-xl border-2 transition-all duration-200 font-bold text-sm active:scale-95 ${
                        selectedSize === size
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/40 scale-105"
                          : "bg-white dark:bg-card text-foreground border-border/60 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Silakan pilih ukuran
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6 md:mb-8">
                <h3 className="font-bold text-foreground mb-3 text-sm md:text-base">
                  Jumlah:
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border/60 rounded-xl bg-muted/30">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="p-3 hover:bg-muted transition-colors rounded-l-xl active:scale-95"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="px-5 py-3 font-bold text-foreground min-w-[3.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors rounded-r-xl active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                  {product.stock && (
                    <span className="text-xs text-muted-foreground">
                      Stok: {product.stock}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-emerald-200/60 dark:shadow-emerald-900/40 hover:shadow-2xl active:scale-[0.98] text-base md:text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Tambah ke Keranjang
              </button>

              {/* Trust Badges */}
              <div className="mt-5 md:mt-6 grid grid-cols-3 gap-2 md:gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 dark:bg-muted/20 rounded-xl p-2.5 md:p-3">
                  <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Gratis Ongkir</span>
                  <span className="sm:hidden">Ongkir Gratis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 dark:bg-muted/20 rounded-xl p-2.5 md:p-3">
                  <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Garansi Halal</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 dark:bg-muted/20 rounded-xl p-2.5 md:p-3">
                  <Package className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Kualitas Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
